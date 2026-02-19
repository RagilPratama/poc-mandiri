import { pgTable, text, bigint, numeric, foreignKey, index } from "drizzle-orm/pg-core";
import { mstProvinsi } from "./mst_provinsi";

export const mstKabupaten = pgTable(
  "mst_kabupaten",
  {
    id: bigint({ mode: "number" }).primaryKey(),
    province_id: bigint({ mode: "number" }).notNull(),
    name: text().notNull(),
    alt_name: text().notNull().default(""),
    latitude: numeric().notNull().default("0"),
    longitude: numeric().notNull().default("0"),
  },
  (table) => [
    foreignKey({
      columns: [table.province_id],
      foreignColumns: [mstProvinsi.id],
    }).onDelete("cascade").onUpdate("cascade"),
    
    // Index untuk foreign key lookup
    index("idx_mst_kabupaten_province_id").on(table.province_id),
    // Index untuk search by name (case-insensitive)
    index("idx_mst_kabupaten_name_lower").on(table.name),
    // Composite index untuk filter + sort
    index("idx_mst_kabupaten_province_name").on(table.province_id, table.name),
  ]
);

export type MstKabupaten = typeof mstKabupaten.$inferSelect;
export type InsertMstKabupaten = typeof mstKabupaten.$inferInsert;
