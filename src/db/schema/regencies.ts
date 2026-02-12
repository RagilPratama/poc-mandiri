import { pgTable, text, bigint, numeric, foreignKey, index } from "drizzle-orm/pg-core";
import { provinces } from "./provinces";

export const regencies = pgTable(
  "regencies",
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
      foreignColumns: [provinces.id],
    }).onDelete("cascade").onUpdate("cascade"),
    
    // Index untuk foreign key lookup
    index("idx_regencies_province_id").on(table.province_id),
    // Index untuk search by name (case-insensitive)
    index("idx_regencies_name_lower").on(table.name),
    // Composite index untuk filter + sort
    index("idx_regencies_province_name").on(table.province_id, table.name),
  ]
);

export type Regency = typeof regencies.$inferSelect;
export type InsertRegency = typeof regencies.$inferInsert;
