import { db } from '../src/db';
import { sql } from 'drizzle-orm';

async function removeFotoCheckout() {
  try {
    console.log('🔄 Removing foto_checkout columns from trx_absensi...');
    
    await db.execute(sql`ALTER TABLE trx_absensi DROP COLUMN IF EXISTS foto_checkout_url`);
    await db.execute(sql`ALTER TABLE trx_absensi DROP COLUMN IF EXISTS foto_checkout_id`);
    
    console.log('✅ Successfully removed foto_checkout columns');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error removing foto_checkout columns:', error);
    process.exit(1);
  }
}

removeFotoCheckout();
