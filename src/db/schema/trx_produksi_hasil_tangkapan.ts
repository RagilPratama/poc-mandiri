import { pgTable, serial, integer, date, decimal, varchar, text, timestamp, index } from 'drizzle-orm/pg-core';
import { mstKelompokNelayan } from './mst_kelompok_nelayan';
import { mstKapal } from './mst_kapal';
import { mstKomoditas } from './mst_komoditas';
import { mstAlatTangkap } from './mst_alat_tangkap';

export const trxProduksiHasilTangkapan = pgTable('trx_produksi_hasil_tangkapan', {
  id: serial('id').primaryKey(),
  kelompok_nelayan_id: integer('kelompok_nelayan_id').notNull().references(() => mstKelompokNelayan.id),
  kapal_id: integer('kapal_id').references(() => mstKapal.id),
  tanggal_produksi: date('tanggal_produksi').notNull(),
  komoditas_id: integer('komoditas_id').notNull().references(() => mstKomoditas.id),
  alat_tangkap_id: integer('alat_tangkap_id').references(() => mstAlatTangkap.id),
  jumlah_produksi: decimal('jumlah_produksi', { precision: 15, scale: 2 }).notNull(), // Quantity
  satuan: varchar('satuan', { length: 50 }).notNull(), // 'kg', 'ton', 'ekor'
  harga_jual: decimal('harga_jual', { precision: 15, scale: 2 }), // Selling price per unit
  total_nilai: decimal('total_nilai', { precision: 15, scale: 2 }), // Total value
  lokasi_penangkapan: varchar('lokasi_penangkapan', { length: 255 }), // Fishing location
  koordinat_latitude: decimal('koordinat_latitude', { precision: 10, scale: 8 }),
  koordinat_longitude: decimal('koordinat_longitude', { precision: 11, scale: 8 }),
  keterangan: text('keterangan'),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
}, (table) => [
  index('idx_trx_produksi_kelompok').on(table.kelompok_nelayan_id),
  index('idx_trx_produksi_tanggal').on(table.tanggal_produksi),
  index('idx_trx_produksi_komoditas').on(table.komoditas_id),
  index('idx_trx_produksi_kelompok_tanggal').on(table.kelompok_nelayan_id, table.tanggal_produksi),
]);

export type TrxProduksiHasilTangkapan = typeof trxProduksiHasilTangkapan.$inferSelect;
export type InsertTrxProduksiHasilTangkapan = typeof trxProduksiHasilTangkapan.$inferInsert;
