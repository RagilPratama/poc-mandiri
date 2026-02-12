import { db } from "../db";
import { regencies } from "../db/schema";
import { asc, count, eq, ilike } from "drizzle-orm";
import { getCache, setCache } from "../redis";
import { RegencyResponse } from "../types/regency";

const CACHE_TTL = 86400; // 24 hours

export class RegencyRepository {
  async getAllRegencies(): Promise<RegencyResponse[]> {
    const cacheKey = "regencies:all";

    try {
      const cached = await getCache(cacheKey);
      if (cached) {
        return cached as RegencyResponse[];
      }
    } catch (error) {
      console.warn("Cache gagal, fallback ke database:", error);
    }

    const result = await db
      .select({
        id: regencies.id,
        province_id: regencies.province_id,
        name: regencies.name,
        alt_name: regencies.alt_name,
        latitude: regencies.latitude,
        longitude: regencies.longitude,
      })
      .from(regencies)
      .orderBy(asc(regencies.name));

    const transformedData = result.map((row) => ({
      id: row.id,
      province_id: row.province_id,
      name: row.name,
      alt_name: row.alt_name,
      latitude: row.latitude,
      longitude: row.longitude,
    }));

    await setCache(cacheKey, transformedData, CACHE_TTL);
    return transformedData;
  }

  async getRegenciesByProvinceId(province_id: number): Promise<RegencyResponse[]> {
    const cacheKey = `regencies:province:${province_id}`;

    try {
      const cached = await getCache(cacheKey);
      if (cached) {
        return cached as RegencyResponse[];
      }
    } catch (error) {
      console.warn("Cache gagal, fallback ke database:", error);
    }

    const result = await db
      .select({
        id: regencies.id,
        province_id: regencies.province_id,
        name: regencies.name,
        alt_name: regencies.alt_name,
        latitude: regencies.latitude,
        longitude: regencies.longitude,
      })
      .from(regencies)
      .where(eq(regencies.province_id, province_id))
      .orderBy(asc(regencies.name));

    const transformedData = result.map((row) => ({
      id: row.id,
      province_id: row.province_id,
      name: row.name,
      alt_name: row.alt_name,
      latitude: row.latitude,
      longitude: row.longitude,
    }));

    await setCache(cacheKey, transformedData, CACHE_TTL);
    return transformedData;
  }

  async getRegencyById(id: number): Promise<RegencyResponse | null> {
    const cacheKey = `regency:${id}`;

    try {
      const cached = await getCache(cacheKey);
      if (cached) {
        return cached as RegencyResponse;
      }
    } catch (error) {
      console.warn("Cache gagal, fallback ke database:", error);
    }

    const result = await db
      .select({
        id: regencies.id,
        province_id: regencies.province_id,
        name: regencies.name,
        alt_name: regencies.alt_name,
        latitude: regencies.latitude,
        longitude: regencies.longitude,
      })
      .from(regencies)
      .where(eq(regencies.id, id))
      .limit(1);

    if (result.length === 0) {
      return null;
    }

    const transformedData = {
      id: result[0].id,
      province_id: result[0].province_id,
      name: result[0].name,
      alt_name: result[0].alt_name,
      latitude: result[0].latitude,
      longitude: result[0].longitude,
    };

    await setCache(cacheKey, transformedData, CACHE_TTL);
    return transformedData;
  }

  async countRegencies(): Promise<number> {
    const result = await db.select({ count: count() }).from(regencies);
    return result[0].count;
  }

  async searchRegencies(searchTerm: string): Promise<RegencyResponse[]> {
    const cacheKey = `regencies:search:${searchTerm.toLowerCase()}`;

    try {
      const cached = await getCache(cacheKey);
      if (cached) {
        console.log(`Cache hit: regencies search "${searchTerm}"`);
        return cached as RegencyResponse[];
      }
      console.log(`Cache miss: regencies search "${searchTerm}"`);
    } catch (error) {
      console.warn("Cache gagal, fallback ke database:", error);
    }

    const searchPattern = `%${searchTerm}%`;

    const result = await db
      .select({
        id: regencies.id,
        province_id: regencies.province_id,
        name: regencies.name,
        alt_name: regencies.alt_name,
        latitude: regencies.latitude,
        longitude: regencies.longitude,
      })
      .from(regencies)
      .where(ilike(regencies.name, searchPattern))
      .orderBy(asc(regencies.name));

    const transformedData = result.map((row) => ({
      id: row.id,
      province_id: row.province_id,
      name: row.name,
      alt_name: row.alt_name,
      latitude: row.latitude,
      longitude: row.longitude,
    }));

    await setCache(cacheKey, transformedData, CACHE_TTL);
    return transformedData;
  }
}
