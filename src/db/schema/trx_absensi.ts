import { pgTable, serial, varchar, date, timestamp, decimal, integer, text } from 'drizzle-orm/pg-core';
import { mstPegawai } from './mst_pegawai';

export const trxAbsensi = pgTable('trx_absensi', {
  id: serial('id').primaryKey(),
  date: date('date').notNull(),
  nip: varchar('nip', { length: 50 }).notNull().references(() => mstPegawai.nip),
  checkin: timestamp('checkin').notNull(),
  ci_latitude: decimal('ci_latitude', { precision: 10, scale: 8 }).notNull(),
  ci_longitude: decimal('ci_longitude', { precision: 11, scale: 8 }).notNull(),
  checkin_photo_url: varchar('checkin_photo_url', { length: 500 }),
  checkin_photo_id: varchar('checkin_photo_id', { length: 255 }),
  checkout: timestamp('checkout'),
  co_latitude: decimal('co_latitude', { precision: 10, scale: 8 }),
  co_longitude: decimal('co_longitude', { precision: 11, scale: 8 }),
  working_hours: decimal('working_hours', { precision: 5, scale: 2 }),
  status: varchar('status', { length: 50 }),
  total_overtime: decimal('total_overtime', { precision: 5, scale: 2 }).default('0'), // in hours
  // New columns
  keterangan: text('keterangan'),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
});

export type TrxAbsensi = typeof trxAbsensi.$inferSelect;
export type InsertTrxAbsensi = typeof trxAbsensi.$inferInsert;
