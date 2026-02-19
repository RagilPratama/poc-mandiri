import { pgTable, text, bigint, numeric, foreignKey, index } from "drizzle-orm/pg-core";
import { mstKabupaten } from "./mst_kabupaten";

export const mstKecamatan = pgTable(
  "mst_kecamatan",
  {
    id: bigint({ mode: "number" }).primaryKey(),
    regency_id: bigint({ mode: "number" }).notNull(),
    name: text().notNull(),
    alt_name: text().notNull().default(""),
    latitude: numeric().notNull().default("0"),
    longitude: numeric().notNull().default("0"),
  },
  (table) => [
    foreignKey({
      columns: [table.regency_id],
      foreignColumns: [mstKabupaten.id],
    }).onDelete("cascade").onUpdate("cascade"),
    
    // Index untuk foreign key lookup
    index("idx_mst_kecamatan_regency_id").on(table.regency_id),
    // Index untuk search by name (case-insensitive)
    index("idx_mst_kecamatan_name_lower").on(table.name),
    // Composite index untuk filter + sort
    index("idx_mst_kecamatan_regency_name").on(table.regency_id, table.name),
  ]
);

export type MstKecamatan = typeof mstKecamatan.$inferSelect;
export type InsertMstKecamatan = typeof mstKecamatan.$inferInsert;
