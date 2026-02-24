import { pgTable, serial, varchar, text, integer, boolean, timestamp } from 'drizzle-orm/pg-core';

export const mstIku = pgTable('mst_iku', {
  id: serial('id').primaryKey(),
  tahun: integer('tahun').notNull(),
  level: varchar('level', { length: 100 }).notNull(),
  satuan: varchar('satuan', { length: 100 }),
  target: varchar('target', { length: 100 }),
  deskripsi: text('deskripsi'),
  is_active: boolean('is_active').notNull().default(true),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
});

export type MstIku = typeof mstIku.$inferSelect;
export type InsertMstIku = typeof mstIku.$inferInsert;
