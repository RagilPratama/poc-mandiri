import { pool } from "../db";
import type { Menu } from "../types/menu";

export class MenuRepository {
  async getAllMenus(): Promise<Menu[]> {
    const client = await pool.connect();
    try {
      const result = await client.query(
        "SELECT * FROM menus ORDER BY id ASC"
      );
      return result.rows;
    } finally {
      client.release();
    }
  }
}
