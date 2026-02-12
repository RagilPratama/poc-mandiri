import { pgTable, text, numeric, integer, index } from "drizzle-orm/pg-core";

export const provinces = pgTable(
  "provinces",
  {
    id: integer().primaryKey(),
    name: text().notNull(),
    alt_name: text(),
    latitude: numeric(),
    longitude: numeric(),
  },
  (table) => [
    // Index untuk search by name (case-insensitive)
    index("idx_provinces_name_lower").on(table.name),
  ]
);

export type Province = typeof provinces.$inferSelect;
export type InsertProvince = typeof provinces.$inferInsert;
