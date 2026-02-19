import { db } from "../db";
import { mstKecamatan } from "../db/schema";
import { asc, count, eq, ilike } from "drizzle-orm";
import { getCache, setCache } from "../redis";
import { DistrictResponse } from "../types/district";

const CACHE_TTL = 86400; // 24 hours

export class DistrictRepository {
  async getAllDistricts(): Promise<DistrictResponse[]> {
    const cacheKey = "districts:all";

    try {
      const cached = await getCache(cacheKey);
      if (cached) {
        return cached as DistrictResponse[];
      }
    } catch (error) {
      console.warn("Cache gagal, fallback ke database:", error);
    }

    const result = await db
      .select({
        id: mstKecamatan.id,
        regency_id: mstKecamatan.regency_id,
        name: mstKecamatan.name,
        alt_name: mstKecamatan.alt_name,
        latitude: mstKecamatan.latitude,
        longitude: mstKecamatan.longitude,
      })
      .from(mstKecamatan)
      .orderBy(asc(mstKecamatan.name));

    const transformedData = result.map((row) => ({
      id: row.id,
      regency_id: row.regency_id,
      name: row.name,
      alt_name: row.alt_name,
      latitude: row.latitude,
      longitude: row.longitude,
    }));

    await setCache(cacheKey, transformedData, CACHE_TTL);
    return transformedData;
  }

  async getDistrictsByRegencyId(regency_id: number): Promise<DistrictResponse[]> {
    const cacheKey = `districts:regency:${regency_id}`;

    try {
      const cached = await getCache(cacheKey);
      if (cached) {
        return cached as DistrictResponse[];
      }
    } catch (error) {
      console.warn("Cache gagal, fallback ke database:", error);
    }

    const result = await db
      .select({
        id: mstKecamatan.id,
        regency_id: mstKecamatan.regency_id,
        name: mstKecamatan.name,
        alt_name: mstKecamatan.alt_name,
        latitude: mstKecamatan.latitude,
        longitude: mstKecamatan.longitude,
      })
      .from(mstKecamatan)
      .where(eq(mstKecamatan.regency_id, regency_id))
      .orderBy(asc(mstKecamatan.name));

    const transformedData = result.map((row) => ({
      id: row.id,
      regency_id: row.regency_id,
      name: row.name,
      alt_name: row.alt_name,
      latitude: row.latitude,
      longitude: row.longitude,
    }));

    await setCache(cacheKey, transformedData, CACHE_TTL);
    return transformedData;
  }

  async getDistrictById(id: number): Promise<DistrictResponse | null> {
    const cacheKey = `district:${id}`;

    try {
      const cached = await getCache(cacheKey);
      if (cached) {
        return cached as DistrictResponse;
      }
    } catch (error) {
      console.warn("Cache gagal, fallback ke database:", error);
    }

    const result = await db
      .select({
        id: mstKecamatan.id,
        regency_id: mstKecamatan.regency_id,
        name: mstKecamatan.name,
        alt_name: mstKecamatan.alt_name,
        latitude: mstKecamatan.latitude,
        longitude: mstKecamatan.longitude,
      })
      .from(mstKecamatan)
      .where(eq(mstKecamatan.id, id))
      .limit(1);

    if (result.length === 0) {
      return null;
    }

    const transformedData = {
      id: result[0].id,
      regency_id: result[0].regency_id,
      name: result[0].name,
      alt_name: result[0].alt_name,
      latitude: result[0].latitude,
      longitude: result[0].longitude,
    };

    await setCache(cacheKey, transformedData, CACHE_TTL);
    return transformedData;
  }

  async countDistricts(): Promise<number> {
    const result = await db.select({ count: count() }).from(mstKecamatan);
    return result[0].count;
  }

  async searchDistricts(searchTerm: string): Promise<DistrictResponse[]> {
    const cacheKey = `districts:search:${searchTerm.toLowerCase()}`;

    try {
      const cached = await getCache(cacheKey);
      if (cached) {
        return cached as DistrictResponse[];
      }
    } catch (error) {
      console.warn("Cache gagal, fallback ke database:", error);
    }

    const searchPattern = `%${searchTerm}%`;

    const result = await db
      .select({
        id: mstKecamatan.id,
        regency_id: mstKecamatan.regency_id,
        name: mstKecamatan.name,
        alt_name: mstKecamatan.alt_name,
        latitude: mstKecamatan.latitude,
        longitude: mstKecamatan.longitude,
      })
      .from(mstKecamatan)
      .where(ilike(mstKecamatan.name, searchPattern))
      .orderBy(asc(mstKecamatan.name));

    const transformedData = result.map((row) => ({
      id: row.id,
      regency_id: row.regency_id,
      name: row.name,
      alt_name: row.alt_name,
      latitude: row.latitude,
      longitude: row.longitude,
    }));

    await setCache(cacheKey, transformedData, CACHE_TTL);
    return transformedData;
  }
}
