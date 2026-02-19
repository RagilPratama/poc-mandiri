import { pgTable, serial, varchar, text, boolean, timestamp, index } from 'drizzle-orm/pg-core';

export const mstJenisUsaha = pgTable('mst_jenis_usaha', {
  id: serial('id').primaryKey(),
  kode_jenis_usaha: varchar('kode_jenis_usaha', { length: 20 }).notNull().unique(),
  nama_jenis_usaha: varchar('nama_jenis_usaha', { length: 255 }).notNull(),
  kategori: varchar('kategori', { length: 100 }).notNull(), // 'Tangkap', 'Budidaya', 'Pengolahan', 'Pemasaran'
  keterangan: text('keterangan'),
  status_aktif: boolean('status_aktif').notNull().default(true),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
}, (table) => [
  index('idx_mst_jenis_usaha_kategori').on(table.kategori),
]);

export type MstJenisUsaha = typeof mstJenisUsaha.$inferSelect;
export type InsertMstJenisUsaha = typeof mstJenisUsaha.$inferInsert;
