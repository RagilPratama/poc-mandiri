import { db } from '../src/db';
import { sql } from 'drizzle-orm';
import { mstOrganisasi } from '../src/db/schema';

const result = await db
  .select({ count: sql`COUNT(*)` })
  .from(mstOrganisasi);

console.log(`Total organisasi: ${result[0]?.count || 0}`);
process.exit(0);
