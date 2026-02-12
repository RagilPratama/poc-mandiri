import { pgTable, text, bigint, numeric, foreignKey } from "drizzle-orm/pg-core";
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
  ]
);

export type Regency = typeof regencies.$inferSelect;
export type InsertRegency = typeof regencies.$inferInsert;
