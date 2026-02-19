import { pgTable, serial, varchar, text, boolean, timestamp, decimal, index } from 'drizzle-orm/pg-core';

export const mstJenisBantuan = pgTable('mst_jenis_bantuan', {
  id: serial('id').primaryKey(),
  kode_jenis_bantuan: varchar('kode_jenis_bantuan', { length: 20 }).notNull().unique(),
  nama_jenis_bantuan: varchar('nama_jenis_bantuan', { length: 255 }).notNull(),
  kategori: varchar('kategori', { length: 100 }).notNull(), // 'Alat', 'Modal', 'Benih', 'Pakan', 'Infrastruktur'
  satuan: varchar('satuan', { length: 50 }), // 'unit', 'paket', 'rupiah'
  nilai_estimasi: decimal('nilai_estimasi', { precision: 15, scale: 2 }), // Estimated value in IDR
  keterangan: text('keterangan'),
  status_aktif: boolean('status_aktif').notNull().default(true),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
}, (table) => [
  index('idx_mst_jenis_bantuan_kategori').on(table.kategori),
]);

export type MstJenisBantuan = typeof mstJenisBantuan.$inferSelect;
export type InsertMstJenisBantuan = typeof mstJenisBantuan.$inferInsert;
