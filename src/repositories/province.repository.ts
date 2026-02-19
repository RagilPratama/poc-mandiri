import { db } from "../db";
import { mstProvinsi } from "../db/schema";
import { asc, count, eq, like, ilike } from "drizzle-orm";
import { getCache, setCache } from "../redis";
import { ProvinceResponse } from "../types/province";

const CACHE_TTL = 86400;

export class ProvinceRepository {
  async getAllProvinces(): Promise<ProvinceResponse[]> {
    const cacheKey = "provinces:all";

    try {
      const cached = await getCache(cacheKey);
      if (cached) {
        return cached as ProvinceResponse[];
      }
    } catch (error) {
      console.warn("Cache gagal, fallback ke database:", error);
    }

    const result = await db
      .select({
        id: mstProvinsi.id,
        name: mstProvinsi.name,
        alt_name: mstProvinsi.alt_name,
        latitude: mstProvinsi.latitude,
        longitude: mstProvinsi.longitude,
      })
      .from(mstProvinsi)
      .orderBy(asc(mstProvinsi.name));

    const transformedData = result.map((row) => ({
      id: row.id,
      name: row.name,
      alt_name: row.alt_name,
      latitude: row.latitude,
      longitude: row.longitude,
    }));

    await setCache(cacheKey, transformedData, CACHE_TTL);
    return transformedData;
  }

  async getProvinceById(id: number): Promise<ProvinceResponse | null> {
    const cacheKey = `province:${id}`;

    try {
      const cached = await getCache(cacheKey);
      if (cached) {
        return cached as ProvinceResponse;
      }
    } catch (error) {
      console.warn("Cache gagal, fallback ke database:", error);
    }

    const result = await db
      .select({
        id: mstProvinsi.id,
        name: mstProvinsi.name,
        alt_name: mstProvinsi.alt_name,
        latitude: mstProvinsi.latitude,
        longitude: mstProvinsi.longitude,
      })
      .from(mstProvinsi)
      .where(eq(mstProvinsi.id, id))
      .limit(1);

    if (result.length === 0) {
      return null;
    }

    const transformedData = {
      id: result[0].id,
      name: result[0].name,
      alt_name: result[0].alt_name,
      latitude: result[0].latitude,
      longitude: result[0].longitude,
    };

    await setCache(cacheKey, transformedData, CACHE_TTL);
    return transformedData;
  }

  async countProvinces(): Promise<number> {
    const result = await db.select({ count: count() }).from(mstProvinsi);
    return result[0].count;
  }

  async searchProvinces(searchTerm: string): Promise<ProvinceResponse[]> {
    const cacheKey = `provinces:search:${searchTerm.toLowerCase()}`;

    try {
      const cached = await getCache(cacheKey);
      if (cached) {
        return cached as ProvinceResponse[];
      }
    } catch (error) {
      console.warn("Cache gagal, fallback ke database:", error);
    }

    const searchPattern = `%${searchTerm}%`;
    
    const result = await db
      .select({
        id: mstProvinsi.id,
        name: mstProvinsi.name,
        alt_name: mstProvinsi.alt_name,
        latitude: mstProvinsi.latitude,
        longitude: mstProvinsi.longitude,
      })
      .from(mstProvinsi)
      .where(ilike(mstProvinsi.name, searchPattern))
      .orderBy(asc(mstProvinsi.name));

    const transformedData = result.map((row) => ({
      id: row.id,
      name: row.name,
      alt_name: row.alt_name,
      latitude: row.latitude,
      longitude: row.longitude,
    }));

    await setCache(cacheKey, transformedData, CACHE_TTL);
    return transformedData;
  }
}
