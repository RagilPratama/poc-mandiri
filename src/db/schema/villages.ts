import { pgTable, text, bigint, doublePrecision, foreignKey } from "drizzle-orm/pg-core";
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
  ]
);

export type Village = typeof villages.$inferSelect;
export type InsertVillage = typeof villages.$inferInsert;
