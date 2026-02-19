import { pgTable, serial, varchar, boolean, timestamp, integer, text, date } from 'drizzle-orm/pg-core';
import { mstOrganisasi } from './mst_organisasi';
import { mstRole } from './mst_role';

export const mstPegawai = pgTable('mst_pegawai', {
  id: serial('id').primaryKey(),
  nip: varchar('nip', { length: 50 }).notNull().unique(),
  nama: varchar('nama', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  jabatan: varchar('jabatan', { length: 255 }).notNull(),
  organisasi_id: integer('organisasi_id').notNull().references(() => mstOrganisasi.id),
  role_id: integer('role_id').notNull().references(() => mstRole.id),
  status_aktif: boolean('status_aktif').notNull().default(true),
  last_login: timestamp('last_login'),
  // New columns
  no_hp: varchar('no_hp', { length: 20 }),
  alamat: text('alamat'),
  foto_url: varchar('foto_url', { length: 500 }),
  tanggal_lahir: date('tanggal_lahir'),
  jenis_kelamin: varchar('jenis_kelamin', { length: 1 }), // 'L' or 'P'
  pendidikan_terakhir: varchar('pendidikan_terakhir', { length: 100 }),
  tanggal_bergabung: date('tanggal_bergabung'),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
});

export type MstPegawai = typeof mstPegawai.$inferSelect;
export type InsertMstPegawai = typeof mstPegawai.$inferInsert;
