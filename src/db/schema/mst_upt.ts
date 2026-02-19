import { pgTable, serial, varchar, integer } from 'drizzle-orm/pg-core';
import { mstProvinsi } from './mst_provinsi';

export const mstUpt = pgTable('mst_upt', {
  id: serial('id').primaryKey(),
  nama_organisasi: varchar('nama_organisasi', { length: 255 }).notNull(),
  pimpinan: varchar('pimpinan', { length: 255 }).notNull(),
  province_id: integer('province_id').notNull().references(() => mstProvinsi.id),
});

export type MstUpt = typeof mstUpt.$inferSelect;
export type InsertMstUpt = typeof mstUpt.$inferInsert;
