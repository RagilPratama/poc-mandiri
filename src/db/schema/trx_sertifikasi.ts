import { pgTable, serial, varchar, integer, date, text, timestamp, index } from 'drizzle-orm/pg-core';
import { mstJenisSertifikasi } from './mst_jenis_sertifikasi';
import { mstKelompokNelayan } from './mst_kelompok_nelayan';
import { mstPenyuluh } from './mst_penyuluh';

export const trxSertifikasi = pgTable('trx_sertifikasi', {
  id: serial('id').primaryKey(),
  no_sertifikat: varchar('no_sertifikat', { length: 50 }).notNull().unique(),
  jenis_sertifikasi_id: integer('jenis_sertifikasi_id').notNull().references(() => mstJenisSertifikasi.id),
  kelompok_nelayan_id: integer('kelompok_nelayan_id').notNull().references(() => mstKelompokNelayan.id),
  penyuluh_id: integer('penyuluh_id').references(() => mstPenyuluh.id), // Facilitator
  tanggal_terbit: date('tanggal_terbit').notNull(),
  tanggal_berlaku: date('tanggal_berlaku').notNull(),
  tanggal_kadaluarsa: date('tanggal_kadaluarsa').notNull(),
  lembaga_penerbit: varchar('lembaga_penerbit', { length: 255 }).notNull(),
  status_sertifikat: varchar('status_sertifikat', { length: 50 }).notNull().default('Aktif'), // 'Aktif', 'Kadaluarsa', 'Dicabut'
  file_sertifikat_url: varchar('file_sertifikat_url', { length: 500 }),
  keterangan: text('keterangan'),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
}, (table) => [
  index('idx_trx_sertifikasi_kelompok').on(table.kelompok_nelayan_id),
  index('idx_trx_sertifikasi_kadaluarsa').on(table.tanggal_kadaluarsa),
  index('idx_trx_sertifikasi_status').on(table.status_sertifikat),
  index('idx_trx_sertifikasi_kelompok_status').on(table.kelompok_nelayan_id, table.status_sertifikat),
]);

export type TrxSertifikasi = typeof trxSertifikasi.$inferSelect;
export type InsertTrxSertifikasi = typeof trxSertifikasi.$inferInsert;
