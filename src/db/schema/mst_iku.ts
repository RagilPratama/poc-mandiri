import { pgTable, serial, varchar, text, boolean, timestamp, integer, numeric, index } from 'drizzle-orm/pg-core';

export const mstIku = pgTable('mst_iku', {
  id: serial('id').primaryKey(),
  kode_iku: varchar('kode_iku', { length: 50 }).notNull().unique(),
  nama_iku: varchar('nama_iku', { length: 255 }).notNull(),
  deskripsi: text('deskripsi'),
  tahun: integer('tahun').notNull(),
  target: numeric('target', { precision: 15, scale: 2 }),
  satuan: varchar('satuan', { length: 50 }),
  is_active: boolean('is_active').notNull().default(true),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
}, (table) => [
  index('idx_mst_iku_tahun').on(table.tahun),
  index('idx_mst_iku_is_active').on(table.is_active),
]);

export type MstIku = typeof mstIku.$inferSelect;
export type InsertMstIku = typeof mstIku.$inferInsert;
