import { pgTable, serial, varchar, integer, decimal, timestamp, index } from 'drizzle-orm/pg-core';
import { mstKelompokNelayan } from './mst_kelompok_nelayan';

export const mstKapal = pgTable('mst_kapal', {
  id: serial('id').primaryKey(),
  kelompok_nelayan_id: integer('kelompok_nelayan_id').notNull().references(() => mstKelompokNelayan.id),
  no_registrasi_kapal: varchar('no_registrasi_kapal', { length: 50 }).notNull().unique(),
  nama_kapal: varchar('nama_kapal', { length: 255 }).notNull(),
  jenis_kapal: varchar('jenis_kapal', { length: 100 }).notNull(), // 'Motor', 'Perahu', 'Kapal Besar'
  ukuran_gt: decimal('ukuran_gt', { precision: 10, scale: 2 }), // Gross Tonnage
  ukuran_panjang: decimal('ukuran_panjang', { precision: 10, scale: 2 }), // meters
  ukuran_lebar: decimal('ukuran_lebar', { precision: 10, scale: 2 }), // meters
  mesin_pk: decimal('mesin_pk', { precision: 10, scale: 2 }), // Horse Power
  tahun_pembuatan: integer('tahun_pembuatan'),
  pelabuhan_pangkalan: varchar('pelabuhan_pangkalan', { length: 255 }),
  status_kapal: varchar('status_kapal', { length: 50 }).notNull().default('Aktif'), // 'Aktif', 'Tidak Aktif', 'Perbaikan'
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
}, (table) => [
  index('idx_mst_kapal_kelompok').on(table.kelompok_nelayan_id),
  index('idx_mst_kapal_status').on(table.status_kapal),
]);

export type MstKapal = typeof mstKapal.$inferSelect;
export type InsertMstKapal = typeof mstKapal.$inferInsert;
