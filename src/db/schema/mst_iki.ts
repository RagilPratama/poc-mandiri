import { pgTable, serial, varchar, text, boolean, timestamp, integer, numeric, index } from 'drizzle-orm/pg-core';
import { mstIku } from './mst_iku';

export const mstIki = pgTable('mst_iki', {
  id: serial('id').primaryKey(),
  iku_id: integer('iku_id').references(() => mstIku.id).notNull(),
  kode_iki: varchar('kode_iki', { length: 50 }).notNull().unique(),
  nama_iki: varchar('nama_iki', { length: 255 }).notNull(),
  deskripsi: text('deskripsi'),
  target: numeric('target', { precision: 15, scale: 2 }),
  satuan: varchar('satuan', { length: 50 }),
  is_active: boolean('is_active').notNull().default(true),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
}, (table) => [
  index('idx_mst_iki_iku_id').on(table.iku_id),
  index('idx_mst_iki_is_active').on(table.is_active),
]);

export type MstIki = typeof mstIki.$inferSelect;
export type InsertMstIki = typeof mstIki.$inferInsert;
