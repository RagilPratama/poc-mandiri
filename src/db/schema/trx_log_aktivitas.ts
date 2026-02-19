import { pgTable, serial, varchar, integer, text, timestamp, index, jsonb } from 'drizzle-orm/pg-core';
import { mstPegawai } from './mst_pegawai';

export const trxLogAktivitas = pgTable('trx_log_aktivitas', {
  id: serial('id').primaryKey(),
  pegawai_id: integer('pegawai_id').references(() => mstPegawai.id),
  user_id: varchar('user_id', { length: 255 }), // Clerk user ID or external user ID
  username: varchar('username', { length: 255 }),
  email: varchar('email', { length: 255 }),
  
  // Activity details
  aktivitas: varchar('aktivitas', { length: 255 }).notNull(), // e.g., 'CREATE', 'UPDATE', 'DELETE', 'LOGIN', 'LOGOUT'
  modul: varchar('modul', { length: 100 }).notNull(), // e.g., 'PEGAWAI', 'ABSENSI', 'BANTUAN', 'AUTH'
  deskripsi: text('deskripsi').notNull(), // Description of the activity
  
  // Request details
  method: varchar('method', { length: 10 }), // HTTP method: GET, POST, PUT, DELETE
  endpoint: varchar('endpoint', { length: 500 }), // API endpoint
  ip_address: varchar('ip_address', { length: 50 }),
  user_agent: text('user_agent'),
  
  // Data details
  data_lama: jsonb('data_lama'), // Old data (for UPDATE/DELETE)
  data_baru: jsonb('data_baru'), // New data (for CREATE/UPDATE)
  
  // Status
  status: varchar('status', { length: 20 }).notNull().default('SUCCESS'), // 'SUCCESS', 'FAILED', 'ERROR'
  error_message: text('error_message'),
  
  created_at: timestamp('created_at').defaultNow(),
}, (table) => [
  index('idx_trx_log_aktivitas_pegawai').on(table.pegawai_id),
  index('idx_trx_log_aktivitas_user').on(table.user_id),
  index('idx_trx_log_aktivitas_modul').on(table.modul),
  index('idx_trx_log_aktivitas_aktivitas').on(table.aktivitas),
  index('idx_trx_log_aktivitas_created').on(table.created_at),
  index('idx_trx_log_aktivitas_modul_aktivitas').on(table.modul, table.aktivitas),
]);

export type TrxLogAktivitas = typeof trxLogAktivitas.$inferSelect;
export type InsertTrxLogAktivitas = typeof trxLogAktivitas.$inferInsert;
