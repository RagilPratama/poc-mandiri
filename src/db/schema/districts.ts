import { pgTable, text, bigint, numeric, foreignKey, index } from "drizzle-orm/pg-core";
import { regencies } from "./regencies";

export const districts = pgTable(
  "districts",
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
      foreignColumns: [regencies.id],
    }).onDelete("cascade").onUpdate("cascade"),
    
    // Index untuk foreign key lookup
    index("idx_districts_regency_id").on(table.regency_id),
    // Index untuk search by name (case-insensitive)
    index("idx_districts_name_lower").on(table.name),
    // Composite index untuk filter + sort
    index("idx_districts_regency_name").on(table.regency_id, table.name),
  ]
);

export type District = typeof districts.$inferSelect;
export type InsertDistrict = typeof districts.$inferInsert;
