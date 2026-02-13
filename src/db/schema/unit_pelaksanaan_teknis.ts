import { pgTable, serial, varchar, integer } from 'drizzle-orm/pg-core';
import { provinces } from './provinces';

export const unitPelaksanaanTeknis = pgTable('unit_pelaksanaan_teknis', {
  id: serial('id').primaryKey(),
  nama_organisasi: varchar('nama_organisasi', { length: 255 }).notNull(),
  pimpinan: varchar('pimpinan', { length: 255 }).notNull(),
  province_id: integer('province_id').notNull().references(() => provinces.id),
});
