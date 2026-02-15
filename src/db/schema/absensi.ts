import { pgTable, serial, varchar, date, timestamp, decimal, integer } from 'drizzle-orm/pg-core';
import { pegawai } from './pegawai';

export const absensi = pgTable('absensi', {
  id: serial('id').primaryKey(),
  date: date('date').notNull(),
  nip: varchar('nip', { length: 50 }).notNull().references(() => pegawai.nip),
  checkin: timestamp('checkin').notNull(),
  checkout: timestamp('checkout'),
  working_hours: decimal('working_hours', { precision: 5, scale: 2 }),
  latitude: decimal('latitude', { precision: 10, scale: 8 }).notNull(),
  longitude: decimal('longitude', { precision: 11, scale: 8 }).notNull(),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
});

export type Absensi = typeof absensi.$inferSelect;
export type InsertAbsensi = typeof absensi.$inferInsert;
