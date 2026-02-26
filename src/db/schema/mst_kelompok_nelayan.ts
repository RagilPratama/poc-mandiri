import { pgTable, serial, varchar, integer, timestamp, text, date, index } from 'drizzle-orm/pg-core';
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
  jenis_kelamin_ketua: varchar('jenis_kelamin_ketua', { length: 20 }), // 'Laki-Laki', 'Perempuan'
  upt_id: integer('upt_id').notNull().references(() => mstUpt.id),
  province_id: integer('province_id').notNull().references(() => mstProvinsi.id),
  penyuluh_id: integer('penyuluh_id').notNull().references(() => mstPenyuluh.id),
  no_hp_penyuluh: varchar('no_hp_penyuluh', { length: 20 }),
  status_penyuluh: varchar('status_penyuluh', { length: 50 }), // Status penyuluh pendamping
  kelas_kelompok: varchar('kelas_kelompok', { length: 50 }), // 'Madya', 'Pemula', etc
  jenis_usaha_id: integer('jenis_usaha_id').references(() => mstJenisUsaha.id),
  alamat: text('alamat'),
  no_hp_ketua: varchar('no_hp_ketua', { length: 20 }),
  jumlah_anggota: integer('jumlah_anggota').notNull().default(1),
  tanggal_pembentukan_kelompok: date('tanggal_pembentukan_kelompok'),
  tanggal_peningkatan_kelas_kelompok: date('tanggal_peningkatan_kelas_kelompok'),
  tanggal_pembentukan_gapokan: date('tanggal_pembentukan_gapokan'),
  profil_kelompok_photo_url: varchar('profil_kelompok_photo_url', { length: 500 }),
  profil_kelompok_photo_id: varchar('profil_kelompok_photo_id', { length: 100 }),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
}, (table) => ({
  upt_id_idx: index('idx_kelompok_nelayan_upt_id').on(table.upt_id),
  province_id_idx: index('idx_kelompok_nelayan_province_id').on(table.province_id),
  penyuluh_id_idx: index('idx_kelompok_nelayan_penyuluh_id').on(table.penyuluh_id),
  jenis_usaha_id_idx: index('idx_kelompok_nelayan_jenis_usaha_id').on(table.jenis_usaha_id),
}));

export type MstKelompokNelayan = typeof mstKelompokNelayan.$inferSelect;
export type InsertMstKelompokNelayan = typeof mstKelompokNelayan.$inferInsert;
