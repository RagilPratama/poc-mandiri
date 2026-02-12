import { pgTable, text, numeric, integer } from "drizzle-orm/pg-core";

export const provinces = pgTable("provinces", {
  id: integer().primaryKey(),
  name: text().notNull(),
  alt_name: text(),
  latitude: numeric(),
  longitude: numeric(),
});

export type Province = typeof provinces.$inferSelect;
export type InsertProvince = typeof provinces.$inferInsert;
