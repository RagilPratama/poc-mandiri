import { pgTable, serial, varchar, text, boolean, timestamp, integer, index } from 'drizzle-orm/pg-core';

export const mstJenisPelatihan = pgTable('mst_jenis_pelatihan', {
  id: serial('id').primaryKey(),
  kode_jenis_pelatihan: varchar('kode_jenis_pelatihan', { length: 20 }).notNull().unique(),
  nama_jenis_pelatihan: varchar('nama_jenis_pelatihan', { length: 255 }).notNull(),
  kategori: varchar('kategori', { length: 100 }).notNull(), // 'Teknis', 'Manajemen', 'Pengolahan', 'Pemasaran'
  durasi_hari: integer('durasi_hari'), // Duration in days
  target_peserta: varchar('target_peserta', { length: 100 }), // 'Nelayan', 'Pembudidaya', 'Pengolah', 'Semua'
  keterangan: text('keterangan'),
  status_aktif: boolean('status_aktif').notNull().default(true),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
}, (table) => [
  index('idx_mst_jenis_pelatihan_kategori').on(table.kategori),
]);

export type MstJenisPelatihan = typeof mstJenisPelatihan.$inferSelect;
export type InsertMstJenisPelatihan = typeof mstJenisPelatihan.$inferInsert;
