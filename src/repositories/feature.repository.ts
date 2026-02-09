import { pool } from "../db";
import type { Feature } from "../types/feature";

export class FeatureRepository {
  async getAllFeatures(): Promise<Feature[]> {
    const client = await pool.connect();
    try {
      const result = await client.query(
        "SELECT * FROM features ORDER BY id ASC"
      );
      return result.rows;
    } finally {
      client.release();
    }
  }
}
