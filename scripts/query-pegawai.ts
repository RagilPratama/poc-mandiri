import { db } from '../src/db';
import { sql } from 'drizzle-orm';
import { mstPegawai } from '../src/db/schema';

const result = await db
  .select({ count: sql`COUNT(*)` })
  .from(mstPegawai);

console.log(`Total pegawai: ${result[0]?.count || 0}`);
process.exit(0);
