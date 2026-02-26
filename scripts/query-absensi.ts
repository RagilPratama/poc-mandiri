import { db } from '../src/db';
import { sql } from 'drizzle-orm';
import { trxAbsensi } from '../src/db/schema';

const today = new Date().toISOString().split('T')[0];

const result = await db
  .select({ count: sql`COUNT(*)` })
  .from(trxAbsensi)
  .where(sql`DATE(${trxAbsensi.date}) = ${today} AND ${trxAbsensi.status} = 'Absen'`);

console.log(`Pegawai absen hari ini (${today}): ${result[0]?.count || 0}`);
process.exit(0);
