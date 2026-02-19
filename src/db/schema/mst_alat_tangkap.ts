import { pgTable, serial, varchar, text, boolean, timestamp, index } from 'drizzle-orm/pg-core';

export const mstAlatTangkap = pgTable('mst_alat_tangkap', {
  id: serial('id').primaryKey(),
  kode_alat_tangkap: varchar('kode_alat_tangkap', { length: 20 }).notNull().unique(),
  nama_alat_tangkap: varchar('nama_alat_tangkap', { length: 255 }).notNull(),
  jenis: varchar('jenis', { length: 100 }).notNull(), // 'Jaring', 'Pancing', 'Perangkap', 'Lainnya'
  target_komoditas: text('target_komoditas'), // JSON array of commodity IDs
  keterangan: text('keterangan'),
  status_aktif: boolean('status_aktif').notNull().default(true),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
}, (table) => [
  index('idx_mst_alat_tangkap_jenis').on(table.jenis),
]);

export type MstAlatTangkap = typeof mstAlatTangkap.$inferSelect;
export type InsertMstAlatTangkap = typeof mstAlatTangkap.$inferInsert;
