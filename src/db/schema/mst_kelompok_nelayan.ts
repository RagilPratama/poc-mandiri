import { pgTable, serial, varchar, integer, timestamp, text, decimal } from 'drizzle-orm/pg-core';
import { mstUpt } from './mst_upt';
import { mstProvinsi } from './mst_provinsi';
import { mstPenyuluh } from './mst_penyuluh';
import { mstJenisUsaha } from './mst_jenis_usaha';

export const mstKelompokNelayan = pgTable('mst_kelompok_nelayan', {
  id: serial('id').primaryKey(),
  nib_kelompok: varchar('nib_kelompok', { length: 50 }).notNull().unique(),
  no_registrasi: varchar('no_registrasi', { length: 50 }).notNull().unique(),
  nama_kelompok: varchar('nama_kelompok', { length: 255 }).notNull(),
  nik_ketua: varchar('nik_ketua', { length: 50 }).notNull(),
  nama_ketua: varchar('nama_ketua', { length: 255 }).notNull(),
  upt_id: integer('upt_id').notNull().references(() => mstUpt.id),
  province_id: integer('province_id').notNull().references(() => mstProvinsi.id),
  penyuluh_id: integer('penyuluh_id').notNull().references(() => mstPenyuluh.id),
  gabungan_kelompok_id: integer('gabungan_kelompok_id').references(() => mstKelompokNelayan.id),
  jumlah_anggota: integer('jumlah_anggota').notNull().default(1),
  // New columns
  jenis_usaha_id: integer('jenis_usaha_id').references(() => mstJenisUsaha.id),
  alamat: text('alamat'),
  no_hp_ketua: varchar('no_hp_ketua', { length: 20 }),
  tahun_berdiri: integer('tahun_berdiri'),
  status_kelompok: varchar('status_kelompok', { length: 50 }), // 'Aktif', 'Tidak Aktif', 'Pembinaan'
  luas_lahan: decimal('luas_lahan', { precision: 10, scale: 2 }), // in hectares
  koordinat_latitude: decimal('koordinat_latitude', { precision: 10, scale: 8 }),
  koordinat_longitude: decimal('koordinat_longitude', { precision: 11, scale: 8 }),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
});

export type MstKelompokNelayan = typeof mstKelompokNelayan.$inferSelect;
export type InsertMstKelompokNelayan = typeof mstKelompokNelayan.$inferInsert;
