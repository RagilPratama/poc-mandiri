import { pgTable, text, numeric, integer, index } from "drizzle-orm/pg-core";

export const mstProvinsi = pgTable(
  "mst_provinsi",
  {
    id: integer().primaryKey(),
    name: text().notNull(),
    alt_name: text(),
    latitude: numeric(),
    longitude: numeric(),
  },
  (table) => [
    // Index untuk search by name (case-insensitive)
    index("idx_mst_provinsi_name_lower").on(table.name),
  ]
);

export type MstProvinsi = typeof mstProvinsi.$inferSelect;
export type InsertMstProvinsi = typeof mstProvinsi.$inferInsert;
