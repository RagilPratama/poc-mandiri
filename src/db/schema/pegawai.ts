import { pgTable, serial, varchar, boolean, timestamp, integer } from 'drizzle-orm/pg-core';
import { organisasi } from './organisasi';
import { roles } from './roles';

export const pegawai = pgTable('pegawai', {
  id: serial('id').primaryKey(),
  nip: varchar('nip', { length: 50 }).notNull().unique(),
  nama: varchar('nama', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  jabatan: varchar('jabatan', { length: 255 }).notNull(),
  organisasi_id: integer('organisasi_id').notNull().references(() => organisasi.id),
  role_id: integer('role_id').notNull().references(() => roles.id),
  status_aktif: boolean('status_aktif').notNull().default(true),
  last_login: timestamp('last_login'),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
});

export type Pegawai = typeof pegawai.$inferSelect;
export type InsertPegawai = typeof pegawai.$inferInsert;
