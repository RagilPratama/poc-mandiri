import { pgTable, serial, varchar, boolean, integer, timestamp, text } from 'drizzle-orm/pg-core';
import { mstPegawai } from './mst_pegawai';
import { mstUpt } from './mst_upt';
import { mstProvinsi } from './mst_provinsi';

export const mstPenyuluh = pgTable('mst_penyuluh', {
  id: serial('id').primaryKey(),
  pegawai_id: integer('pegawai_id').notNull().references(() => mstPegawai.id),
  upt_id: integer('upt_id').notNull().references(() => mstUpt.id),
  province_id: integer('province_id').notNull().references(() => mstProvinsi.id),
  jumlah_kelompok: integer('jumlah_kelompok').notNull().default(0),
  program_prioritas: varchar('program_prioritas', { length: 255 }),
  status_aktif: boolean('status_aktif').notNull().default(true),
  // New columns
  wilayah_binaan: text('wilayah_binaan'), // JSON array of district/village IDs
  spesialisasi: varchar('spesialisasi', { length: 255 }), // e.g., "Budidaya", "Tangkap", "Pengolahan"
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
});

export type MstPenyuluh = typeof mstPenyuluh.$inferSelect;
export type InsertMstPenyuluh = typeof mstPenyuluh.$inferInsert;
