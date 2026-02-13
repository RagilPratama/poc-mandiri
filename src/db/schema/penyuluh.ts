import { pgTable, serial, varchar, boolean, integer, timestamp } from 'drizzle-orm/pg-core';
import { pegawai } from './pegawai';
import { unitPelaksanaanTeknis } from './unit_pelaksanaan_teknis';
import { provinces } from './provinces';

export const penyuluh = pgTable('penyuluh', {
  id: serial('id').primaryKey(),
  pegawai_id: integer('pegawai_id').notNull().references(() => pegawai.id),
  upt_id: integer('upt_id').notNull().references(() => unitPelaksanaanTeknis.id),
  province_id: integer('province_id').notNull().references(() => provinces.id),
  jumlah_kelompok: integer('jumlah_kelompok').notNull().default(0),
  program_prioritas: varchar('program_prioritas', { length: 255 }),
  status_aktif: boolean('status_aktif').notNull().default(true),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
});

export type Penyuluh = typeof penyuluh.$inferSelect;
export type InsertPenyuluh = typeof penyuluh.$inferInsert;
