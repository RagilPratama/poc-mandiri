import { pgTable, serial, varchar, text, timestamp } from 'drizzle-orm/pg-core';

export const roles = pgTable('roles', {
  id: serial('id').primaryKey(),
  level_role: varchar('level_role', { length: 100 }).notNull(),
  nama_role: varchar('nama_role', { length: 255 }).notNull(),
  keterangan: text('keterangan'),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
});

export type Role = typeof roles.$inferSelect;
export type InsertRole = typeof roles.$inferInsert;
