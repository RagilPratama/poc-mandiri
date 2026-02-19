import { pgTable, serial, varchar, text, timestamp } from 'drizzle-orm/pg-core';

export const mstOrganisasi = pgTable('mst_organisasi', {
  id: serial('id').primaryKey(),
  level_organisasi: varchar('level_organisasi', { length: 100 }).notNull(),
  kode_organisasi: varchar('kode_organisasi', { length: 50 }).notNull(),
  nama_organisasi: varchar('nama_organisasi', { length: 255 }).notNull(),
  keterangan: text('keterangan'),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
});

export type MstOrganisasi = typeof mstOrganisasi.$inferSelect;
export type InsertMstOrganisasi = typeof mstOrganisasi.$inferInsert;
