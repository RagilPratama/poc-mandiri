import { pgTable, serial, varchar, integer, timestamp } from 'drizzle-orm/pg-core';
import { unitPelaksanaanTeknis } from './unit_pelaksanaan_teknis';
import { provinces } from './provinces';
import { pegawai } from './pegawai';

export const kelompokNelayan = pgTable('kelompok_nelayan', {
  id: serial('id').primaryKey(),
  nib_kelompok: varchar('nib_kelompok', { length: 50 }).notNull().unique(),
  no_registrasi: varchar('no_registrasi', { length: 50 }).notNull().unique(),
  nama_kelompok: varchar('nama_kelompok', { length: 255 }).notNull(),
  nik_ketua: varchar('nik_ketua', { length: 50 }).notNull(),
  nama_ketua: varchar('nama_ketua', { length: 255 }).notNull(),
  upt_id: integer('upt_id').notNull().references(() => unitPelaksanaanTeknis.id),
  province_id: integer('province_id').notNull().references(() => provinces.id),
  penyuluh_id: integer('penyuluh_id').notNull().references(() => pegawai.id),
  gabungan_kelompok_id: integer('gabungan_kelompok_id').references(() => kelompokNelayan.id),
  jumlah_anggota: integer('jumlah_anggota').notNull().default(1),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
});

export type KelompokNelayan = typeof kelompokNelayan.$inferSelect;
export type InsertKelompokNelayan = typeof kelompokNelayan.$inferInsert;
