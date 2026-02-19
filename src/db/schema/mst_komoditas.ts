import { pgTable, serial, varchar, text, boolean, timestamp, decimal, index } from 'drizzle-orm/pg-core';

export const mstKomoditas = pgTable('mst_komoditas', {
  id: serial('id').primaryKey(),
  kode_komoditas: varchar('kode_komoditas', { length: 20 }).notNull().unique(),
  nama_komoditas: varchar('nama_komoditas', { length: 255 }).notNull(),
  nama_ilmiah: varchar('nama_ilmiah', { length: 255 }), // Scientific name
  kategori: varchar('kategori', { length: 100 }).notNull(), // 'Ikan', 'Udang', 'Rumput Laut', 'Kerang', etc.
  satuan: varchar('satuan', { length: 50 }).notNull(), // 'kg', 'ton', 'ekor'
  harga_pasar_rata: decimal('harga_pasar_rata', { precision: 15, scale: 2 }), // Average market price
  keterangan: text('keterangan'),
  status_aktif: boolean('status_aktif').notNull().default(true),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
}, (table) => [
  index('idx_mst_komoditas_kategori').on(table.kategori),
  index('idx_mst_komoditas_nama').on(table.nama_komoditas),
]);

export type MstKomoditas = typeof mstKomoditas.$inferSelect;
export type InsertMstKomoditas = typeof mstKomoditas.$inferInsert;
