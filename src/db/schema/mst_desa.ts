import { pgTable, text, bigint, doublePrecision, foreignKey, index } from "drizzle-orm/pg-core";
import { mstKecamatan } from "./mst_kecamatan";

export const mstDesa = pgTable(
  "mst_desa",
  {
    id: bigint({ mode: "number" }).primaryKey(),
    district_id: bigint({ mode: "number" }).notNull(),
    name: text().notNull(),
    alt_name: text().notNull().default(""),
    latitude: doublePrecision().notNull().default(0),
    longitude: doublePrecision().notNull().default(0),
  },
  (table) => [
    foreignKey({
      columns: [table.district_id],
      foreignColumns: [mstKecamatan.id],
    }).onDelete("cascade").onUpdate("cascade"),
    
    // Index untuk foreign key lookup
    index("idx_mst_desa_district_id").on(table.district_id),
    // Index untuk search by name (case-insensitive)
    index("idx_mst_desa_name_lower").on(table.name),
    // Composite index untuk filter + sort
    index("idx_mst_desa_district_name").on(table.district_id, table.name),
  ]
);

export type MstDesa = typeof mstDesa.$inferSelect;
export type InsertMstDesa = typeof mstDesa.$inferInsert;
