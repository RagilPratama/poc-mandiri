import { db } from "../db";
import { menus } from "../db/schema";
import { getCache, setCache, deleteCache } from "../redis";
import { dumpQuery, dumpResult } from "../utils/logger";
import { asc } from "drizzle-orm";

const MENUS_CACHE_KEY = "menus:all";
const MENUS_CACHE_TTL = 60;

export class MenuRepository {
  async getAllMenus() {
    // await deleteCache(MENUS_CACHE_KEY);

    try {
      const cachedMenus = await getCache(MENUS_CACHE_KEY);
      if (cachedMenus) {
        console.log("Dari Cache");
        return cachedMenus;
      }
    } catch (error) {
      console.warn("Cache Gagal konek langsung ke database:", error);
    }

    const query = db.select({
      id: menus.id,
      icon: menus.icon,
      iconColor: menus.icon_color,
      bgColor: menus.bg_color,
      route: menus.route,
    })
    .from(menus)
    .orderBy(asc(menus.id));
    
    // const sqlQuery = query.toSQL();
    // dumpQuery(sqlQuery);
    const result = await query;
    await setCache(MENUS_CACHE_KEY, result, MENUS_CACHE_TTL);
    // dumpResult(result, "Data Menus");
    // console.log("Menus cached sukses");
    return result;
  }

  async invalidateMenuCache(): Promise<void> {
    await deleteCache(MENUS_CACHE_KEY);
    console.log("🗑️ Menu cache invalidated");
  }
}
