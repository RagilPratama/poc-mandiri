import { pgTable, serial, varchar, integer, date, decimal, text, timestamp, index } from 'drizzle-orm/pg-core';
import { mstJenisPelatihan } from './mst_jenis_pelatihan';
import { mstPenyuluh } from './mst_penyuluh';

export const trxPelatihan = pgTable('trx_pelatihan', {
  id: serial('id').primaryKey(),
  no_pelatihan: varchar('no_pelatihan', { length: 50 }).notNull().unique(),
  jenis_pelatihan_id: integer('jenis_pelatihan_id').notNull().references(() => mstJenisPelatihan.id),
  nama_pelatihan: varchar('nama_pelatihan', { length: 255 }).notNull(),
  penyelenggara: varchar('penyelenggara', { length: 255 }).notNull(), // Organizer
  penyuluh_id: integer('penyuluh_id').references(() => mstPenyuluh.id), // Coordinator
  tanggal_mulai: date('tanggal_mulai').notNull(),
  tanggal_selesai: date('tanggal_selesai').notNull(),
  lokasi: varchar('lokasi', { length: 255 }).notNull(),
  jumlah_peserta: integer('jumlah_peserta').notNull().default(0),
  target_peserta: integer('target_peserta').notNull(),
  peserta_kelompok: text('peserta_kelompok'), // JSON array of kelompok_nelayan_id
  narasumber: varchar('narasumber', { length: 255 }),
  biaya: decimal('biaya', { precision: 15, scale: 2 }),
  sumber_dana: varchar('sumber_dana', { length: 255 }),
  status_pelatihan: varchar('status_pelatihan', { length: 50 }).notNull().default('Direncanakan'), // 'Direncanakan', 'Berlangsung', 'Selesai', 'Dibatalkan'
  hasil_evaluasi: text('hasil_evaluasi'),
  dokumentasi_url: varchar('dokumentasi_url', { length: 500 }),
  keterangan: text('keterangan'),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
}, (table) => [
  index('idx_trx_pelatihan_tanggal').on(table.tanggal_mulai),
  index('idx_trx_pelatihan_status').on(table.status_pelatihan),
  index('idx_trx_pelatihan_tanggal_status').on(table.tanggal_mulai, table.status_pelatihan),
]);

export type TrxPelatihan = typeof trxPelatihan.$inferSelect;
export type InsertTrxPelatihan = typeof trxPelatihan.$inferInsert;
