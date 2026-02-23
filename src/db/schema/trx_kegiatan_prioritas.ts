import { pgTable, serial, varchar, text, date, timestamp, integer, boolean, json, index } from 'drizzle-orm/pg-core';
import { mstPegawai } from './mst_pegawai';
import { mstKelompokNelayan } from './mst_kelompok_nelayan';

export const trxKegiatanPrioritas = pgTable('trx_kegiatan_prioritas', {
  id: serial('id').primaryKey(),
  pegawai_id: integer('pegawai_id').references(() => mstPegawai.id).notNull(),
  kelompok_nelayan_id: integer('kelompok_nelayan_id').references(() => mstKelompokNelayan.id),
  tanggal: date('tanggal').notNull(),
  lokasi_kegiatan: varchar('lokasi_kegiatan', { length: 255 }),
  iki: varchar('iki', { length: 255 }), // IKI (Indikator Kinerja Individu)
  rencana_kerja: text('rencana_kerja'), // max 1000 chars
  detail_keterangan: text('detail_keterangan'),
  foto_kegiatan: json('foto_kegiatan').$type<string[]>(), // Array of photo URLs (max 5)
  is_active: boolean('is_active').notNull().default(true),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
}, (table) => [
  index('idx_trx_kegiatan_prioritas_pegawai_id').on(table.pegawai_id),
  index('idx_trx_kegiatan_prioritas_kelompok_id').on(table.kelompok_nelayan_id),
  index('idx_trx_kegiatan_prioritas_tanggal').on(table.tanggal),
]);

export type TrxKegiatanPrioritas = typeof trxKegiatanPrioritas.$inferSelect;
export type InsertTrxKegiatanPrioritas = typeof trxKegiatanPrioritas.$inferInsert;
