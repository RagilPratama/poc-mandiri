import { pgTable, serial, varchar, integer } from 'drizzle-orm/pg-core';
import { regencies } from './regencies';

export const unitPelaksanaanTeknis = pgTable('unit_pelaksanaan_teknis', {
  id: serial('id').primaryKey(),
  nama_organisasi: varchar('nama_organisasi', { length: 255 }).notNull(),
  pimpinan: varchar('pimpinan', { length: 255 }).notNull(),
  regencies_id: integer('regencies_id').notNull().references(() => regencies.id),
});
