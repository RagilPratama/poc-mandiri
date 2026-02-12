import { pgTable, text, bigint, doublePrecision, foreignKey, index } from "drizzle-orm/pg-core";
import { districts } from "./districts";

export const villages = pgTable(
  "villages",
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
      foreignColumns: [districts.id],
    }).onDelete("cascade").onUpdate("cascade"),
    
    // Index untuk foreign key lookup
    index("idx_villages_district_id").on(table.district_id),
    // Index untuk search by name (case-insensitive)
    index("idx_villages_name_lower").on(table.name),
    // Composite index untuk filter + sort
    index("idx_villages_district_name").on(table.district_id, table.name),
  ]
);

export type Village = typeof villages.$inferSelect;
export type InsertVillage = typeof villages.$inferInsert;
