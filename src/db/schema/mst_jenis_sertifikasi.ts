import { pgTable, serial, varchar, text, boolean, timestamp, integer, index } from 'drizzle-orm/pg-core';

export const mstJenisSertifikasi = pgTable('mst_jenis_sertifikasi', {
  id: serial('id').primaryKey(),
  kode_jenis_sertifikasi: varchar('kode_jenis_sertifikasi', { length: 20 }).notNull().unique(),
  nama_jenis_sertifikasi: varchar('nama_jenis_sertifikasi', { length: 255 }).notNull(),
  kategori: varchar('kategori', { length: 100 }).notNull(), // 'Produk', 'Kompetensi', 'Usaha'
  lembaga_penerbit: varchar('lembaga_penerbit', { length: 255 }).notNull(), // Issuing authority
  masa_berlaku_tahun: integer('masa_berlaku_tahun'), // Validity period in years
  persyaratan: text('persyaratan'), // Requirements
  keterangan: text('keterangan'),
  status_aktif: boolean('status_aktif').notNull().default(true),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
}, (table) => [
  index('idx_mst_jenis_sertifikasi_kategori').on(table.kategori),
]);

export type MstJenisSertifikasi = typeof mstJenisSertifikasi.$inferSelect;
export type InsertMstJenisSertifikasi = typeof mstJenisSertifikasi.$inferInsert;
