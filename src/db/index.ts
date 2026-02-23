import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  throw new Error("DATABASE_PUBLIC_URL or DATABASE_URL environment variable must be set");
}

console.log("Connecting to database:", DATABASE_URL.replace(/:[^:@]+@/, ':****@'));

export const pool = new Pool({
  connectionString: DATABASE_URL,
  max: 3,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000
});

// Initialize Drizzle with the pool
export const db = drizzle(pool, { schema });

// Handle pool errors
pool.on("error", (err: any) => {
  console.error("Unexpected error on idle client:", err);
});

// Warm up pool and verify connection
;(async () => {
  try {
    const result = await pool.query("SELECT NOW() as current_time, version() as pg_version");
    console.log("✅ Database pool warmed up successfully");
    console.log("📊 PostgreSQL version:", result.rows[0].pg_version.split(' ')[0] + ' ' + result.rows[0].pg_version.split(' ')[1]);
    console.log("🕐 Server time:", result.rows[0].current_time);
  } catch (err: any) {
    console.error("❌ Database warmup failed:", err.message);
  }
})();
