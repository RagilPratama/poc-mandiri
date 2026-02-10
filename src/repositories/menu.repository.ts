import { pool } from "../db";
import type { Menu } from "../types/menu";
import { getCache, setCache, deleteCache } from "../redis";

const MENUS_CACHE_KEY = "menus:all";
const MENUS_CACHE_TTL = 300; 

export class MenuRepository {
  async getAllMenus(): Promise<Menu[]> {
    try {
      const cachedMenus = await getCache<Menu[]>(MENUS_CACHE_KEY);
      if (cachedMenus) {
        console.log("Dari Cache");
        return cachedMenus;
      }
    } catch (error) {
      console.warn("Cache Gagal konek langsung ke database:", error);
    }

    const client = await pool.connect();
    try {
      const result = await client.query(
        "SELECT * FROM menus ORDER BY id ASC"
      );
      const menus = result.rows;

      await setCache(MENUS_CACHE_KEY, menus, MENUS_CACHE_TTL);
      console.log("Menus cached sukses");
      return menus;
    } finally {
      client.release();
    }
  }

  async invalidateMenuCache(): Promise<void> {
    await deleteCache(MENUS_CACHE_KEY);
    console.log("🗑️ Menu cache invalidated");
  }
}
