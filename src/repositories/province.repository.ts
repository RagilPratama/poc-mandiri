import { db } from "../db";
import { provinces } from "../db/schema";
import { asc, count, eq, like, ilike } from "drizzle-orm";
import { getCache, setCache } from "../redis";

const CACHE_TTL = 3600; // 1 hour

export class ProvinceRepository {
  async getAllProvinces() {
    const cacheKey = "provinces:all";

    try {
      const cached = await getCache(cacheKey);
      if (cached) {
        console.log("Cache hit: all provinces");
        return cached;
      }
      console.log("Cache miss: all provinces");
    } catch (error) {
      console.warn("Cache gagal, fallback ke database:", error);
    }

    const result = await db
      .select({
        id: provinces.id,
        name: provinces.name,
        alt_name: provinces.alt_name,
        latitude: provinces.latitude,
        longitude: provinces.longitude,
      })
      .from(provinces)
      .orderBy(asc(provinces.name));

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

  async getProvinceById(id: number) {
    const cacheKey = `province:${id}`;

    try {
      const cached = await getCache(cacheKey);
      if (cached) {
        console.log(`Cache hit: province ${id}`);
        return cached;
      }
      console.log(`Cache miss: province ${id}`);
    } catch (error) {
      console.warn("Cache gagal, fallback ke database:", error);
    }

    const result = await db
      .select({
        id: provinces.id,
        name: provinces.name,
        alt_name: provinces.alt_name,
        latitude: provinces.latitude,
        longitude: provinces.longitude,
      })
      .from(provinces)
      .where(eq(provinces.id, id))
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

  async countProvinces() {
    const result = await db.select({ count: count() }).from(provinces);
    return result[0].count;
  }

  async searchProvinces(searchTerm: string) {
    const cacheKey = `provinces:search:${searchTerm.toLowerCase()}`;

    try {
      const cached = await getCache(cacheKey);
      if (cached) {
        console.log(`Cache hit: provinces search "${searchTerm}"`);
        return cached;
      }
      console.log(`Cache miss: provinces search "${searchTerm}"`);
    } catch (error) {
      console.warn("Cache gagal, fallback ke database:", error);
    }

    const searchPattern = `%${searchTerm}%`;
    
    const result = await db
      .select({
        id: provinces.id,
        name: provinces.name,
        alt_name: provinces.alt_name,
        latitude: provinces.latitude,
        longitude: provinces.longitude,
      })
      .from(provinces)
      .where(ilike(provinces.name, searchPattern))
      .orderBy(asc(provinces.name));

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
