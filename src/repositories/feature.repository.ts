import { db } from "../db";
import { features } from "../db/schema";
import { asc } from "drizzle-orm";
import { getCache, setCache, deleteCache } from "../redis";


const FEATURES_CACHE_KEY = "features:all";
const FEATURES_CACHE_TTL = 300;
export class FeatureRepository {
  async getAllFeatures() {

    try {
      const cachedFeatures = await getCache(FEATURES_CACHE_KEY);
      if (cachedFeatures) {
        console.log("Dari Cache");
        return cachedFeatures;
      }
    } catch (error) {
      console.warn("Cache Gagal konek langsung ke database:", error);
    }
    const query = db.select({
      id: features.id,
      title: features.title,
      subtitle: features.subtitle,
      amount: features.amount,
      icon: features.icon,
    })
    .from(features)
    .orderBy(asc(features.id));

    const result = await query;
    await setCache(FEATURES_CACHE_KEY, result, FEATURES_CACHE_TTL);
    
    return result;
  }
}
