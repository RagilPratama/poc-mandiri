import { pgTable, serial, varchar, integer, date, decimal, text, timestamp, index } from 'drizzle-orm/pg-core';
import { mstJenisBantuan } from './mst_jenis_bantuan';
import { mstKelompokNelayan } from './mst_kelompok_nelayan';
import { mstPenyuluh } from './mst_penyuluh';

export const trxBantuan = pgTable('trx_bantuan', {
  id: serial('id').primaryKey(),
  no_bantuan: varchar('no_bantuan', { length: 50 }).notNull().unique(),
  jenis_bantuan_id: integer('jenis_bantuan_id').notNull().references(() => mstJenisBantuan.id),
  kelompok_nelayan_id: integer('kelompok_nelayan_id').notNull().references(() => mstKelompokNelayan.id),
  penyuluh_id: integer('penyuluh_id').notNull().references(() => mstPenyuluh.id),
  tanggal_penyaluran: date('tanggal_penyaluran').notNull(),
  jumlah: decimal('jumlah', { precision: 15, scale: 2 }).notNull(),
  satuan: varchar('satuan', { length: 50 }).notNull(),
  nilai_bantuan: decimal('nilai_bantuan', { precision: 15, scale: 2 }).notNull(), // Value in IDR
  sumber_dana: varchar('sumber_dana', { length: 255 }), // Funding source: 'APBN', 'APBD', 'Swasta'
  tahun_anggaran: integer('tahun_anggaran').notNull(),
  status_penyaluran: varchar('status_penyaluran', { length: 50 }).notNull().default('Direncanakan'), // 'Direncanakan', 'Disalurkan', 'Selesai'
  tanggal_selesai: date('tanggal_selesai'),
  bukti_penyaluran_url: varchar('bukti_penyaluran_url', { length: 500 }), // Photo/document URL
  keterangan: text('keterangan'),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
}, (table) => [
  index('idx_trx_bantuan_kelompok').on(table.kelompok_nelayan_id),
  index('idx_trx_bantuan_tanggal').on(table.tanggal_penyaluran),
  index('idx_trx_bantuan_status').on(table.status_penyaluran),
  index('idx_trx_bantuan_tahun_status').on(table.tahun_anggaran, table.status_penyaluran),
]);

export type TrxBantuan = typeof trxBantuan.$inferSelect;
export type InsertTrxBantuan = typeof trxBantuan.$inferInsert;
