import { db } from "../db";
import { villages } from "../db/schema/villages";
import { districts } from "../db/schema/districts";
import { regencies } from "../db/schema/regencies";
import { provinces } from "../db/schema/provinces";
import { asc, count, eq, ilike, and } from "drizzle-orm";
import { getCache, setCache } from "../redis";
import { VillageResponse } from "../types/village";

const CACHE_TTL = 86400; // 24 hours

export class VillageRepository {
  async getAllVillages(): Promise<VillageResponse[]> {
    const cacheKey = "villages:all";

    try {
      const cached = await getCache(cacheKey);
      if (cached) {
        return cached as VillageResponse[];
      }
    } catch (error) {
      console.warn("Cache gagal, fallback ke database:", error);
    }

    const result = await db
      .select({
        id: villages.id,
        district_id: villages.district_id,
        name: villages.name,
        alt_name: villages.alt_name,
        latitude: villages.latitude,
        longitude: villages.longitude,
      })
      .from(villages)
      .orderBy(asc(villages.name));

    const transformedData = result.map((row) => ({
      id: row.id,
      district_id: row.district_id,
      name: row.name,
      alt_name: row.alt_name,
      latitude: row.latitude,
      longitude: row.longitude,
    }));

    await setCache(cacheKey, transformedData, CACHE_TTL);
    return transformedData;
  }

  async getVillagesByDistrictId(district_id: number): Promise<VillageResponse[]> {
    const cacheKey = `villages:district:${district_id}`;

    try {
      const cached = await getCache(cacheKey);
      if (cached) {
        return cached as VillageResponse[];
      }
    } catch (error) {
      console.warn("Cache gagal, fallback ke database:", error);
    }

    const result = await db
      .select({
        id: villages.id,
        district_id: villages.district_id,
        name: villages.name,
        alt_name: villages.alt_name,
        latitude: villages.latitude,
        longitude: villages.longitude,
      })
      .from(villages)
      .where(eq(villages.district_id, district_id))
      .orderBy(asc(villages.name));

    const transformedData = result.map((row) => ({
      id: row.id,
      district_id: row.district_id,
      name: row.name,
      alt_name: row.alt_name,
      latitude: row.latitude,
      longitude: row.longitude,
    }));

    await setCache(cacheKey, transformedData, CACHE_TTL);
    return transformedData;
  }

  async getVillageById(id: number): Promise<VillageResponse | null> {
    const cacheKey = `village:${id}`;

    try {
      const cached = await getCache(cacheKey);
      if (cached) {
        return cached as VillageResponse;
      }
    } catch (error) {
      console.warn("Cache gagal, fallback ke database:", error);
    }

    const result = await db
      .select({
        id: villages.id,
        district_id: villages.district_id,
        name: villages.name,
        alt_name: villages.alt_name,
        latitude: villages.latitude,
        longitude: villages.longitude,
      })
      .from(villages)
      .where(eq(villages.id, id))
      .limit(1);

    if (result.length === 0) {
      return null;
    }

    const transformedData = {
      id: result[0].id,
      district_id: result[0].district_id,
      name: result[0].name,
      alt_name: result[0].alt_name,
      latitude: result[0].latitude,
      longitude: result[0].longitude,
    };

    await setCache(cacheKey, transformedData, CACHE_TTL);
    return transformedData;
  }

  async countVillages(): Promise<number> {
    const result = await db.select({ count: count() }).from(villages);
    return result[0].count;
  }

  async searchVillages(searchTerm: string, district_id?: number): Promise<VillageResponse[]> {
    const cacheKey = district_id 
      ? `villages:search:${searchTerm.toLowerCase()}:district:${district_id}`
      : `villages:search:${searchTerm.toLowerCase()}`;

    try {
      const cached = await getCache(cacheKey);
      if (cached) {
        return cached as VillageResponse[];
      }
    } catch (error) {
      console.warn("Cache gagal, fallback ke database:", error);
    }

    const searchPattern = `%${searchTerm}%`;

    const conditions = [ilike(villages.name, searchPattern)];
    if (district_id) {
      conditions.push(eq(villages.district_id, district_id));
    }

    const result = await db
      .select({
        id: villages.id,
        district_id: villages.district_id,
        name: villages.name,
        alt_name: villages.alt_name,
        latitude: villages.latitude,
        longitude: villages.longitude,
      })
      .from(villages)
      .where(and(...conditions))
      .orderBy(asc(villages.name));

    const transformedData = result.map((row) => ({
      id: row.id,
      district_id: row.district_id,
      name: row.name,
      alt_name: row.alt_name,
      latitude: row.latitude,
      longitude: row.longitude,
    }));

    await setCache(cacheKey, transformedData, CACHE_TTL);
    return transformedData;
  }

  // Method baru untuk get villages dengan semua relasi (district, regency, province) + pagination
  async getAllVillagesWithRelations(page: number = 1, limit: number = 10) {
    const offset = (page - 1) * limit;
    const cacheKey = `villages:all:with_relations:page:${page}:limit:${limit}`;

    try {
      const cached = await getCache(cacheKey);
      if (cached) {
        return cached;
      }
    } catch (error) {
      console.warn("Cache gagal, fallback ke database:", error);
    }

    // Get total count
    const totalResult = await db.select({ count: count() }).from(villages);
    const total = totalResult[0].count;

    // Get paginated data
    const result = await db
      .select({
        // Village data
        village_id: villages.id,
        village_name: villages.name,
        // District data
        district_id: districts.id,
        district_name: districts.name,
        // Regency data
        regency_id: regencies.id,
        regency_name: regencies.name,
        // Province data
        province_id: provinces.id,
        province_name: provinces.name,
      })
      .from(villages)
      .leftJoin(districts, eq(villages.district_id, districts.id))
      .leftJoin(regencies, eq(districts.regency_id, regencies.id))
      .leftJoin(provinces, eq(regencies.province_id, provinces.id))
      .orderBy(asc(villages.name))
      .limit(limit)
      .offset(offset);

    const response = {
      data: result,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };

    await setCache(cacheKey, response, CACHE_TTL);
    return response;
  }

  // Method untuk search dengan relasi lengkap + pagination
  async searchVillagesWithRelations(searchTerm?: string, page: number = 1, limit: number = 10) {
    const offset = (page - 1) * limit;
    const cacheKey = searchTerm 
      ? `villages:search:${searchTerm.toLowerCase()}:with_relations:page:${page}:limit:${limit}`
      : `villages:all:with_relations:page:${page}:limit:${limit}`;

    try {
      const cached = await getCache(cacheKey);
      if (cached) {
        return cached;
      }
    } catch (error) {
      console.warn("Cache gagal, fallback ke database:", error);
    }

    const conditions = searchTerm 
      ? [ilike(villages.name, `%${searchTerm}%`)]
      : [];

    // Get total count
    const totalResult = await db
      .select({ count: count() })
      .from(villages)
      .where(conditions.length > 0 ? and(...conditions) : undefined);
    const total = totalResult[0].count;

    // Get paginated data
    const result = await db
      .select({
        // Village data
        village_id: villages.id,
        village_name: villages.name,
        // District data
        district_id: districts.id,
        district_name: districts.name,
        // Regency data
        regency_id: regencies.id,
        regency_name: regencies.name,
        // Province data
        province_id: provinces.id,
        province_name: provinces.name,
      })
      .from(villages)
      .leftJoin(districts, eq(villages.district_id, districts.id))
      .leftJoin(regencies, eq(districts.regency_id, regencies.id))
      .leftJoin(provinces, eq(regencies.province_id, provinces.id))
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(asc(villages.name))
      .limit(limit)
      .offset(offset);

    const response = {
      data: result,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };

    await setCache(cacheKey, response, CACHE_TTL);
    return response;
  }
}
