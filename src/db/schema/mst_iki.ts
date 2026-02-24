import { pgTable, serial, varchar, text, boolean, timestamp, index } from 'drizzle-orm/pg-core';

export const mstIki = pgTable('mst_iki', {
  id: serial('id').primaryKey(),
  kategori_iki: varchar('kategori_iki', { length: 50 }).notNull(), // IKI 1, IKI 2, IKI 3, dst
  detail_iki: text('detail_iki').notNull(),
  is_active: boolean('is_active').notNull().default(true),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
}, (table) => [
  index('idx_mst_iki_kategori').on(table.kategori_iki),
]);

export type MstIki = typeof mstIki.$inferSelect;
export type InsertMstIki = typeof mstIki.$inferInsert;
