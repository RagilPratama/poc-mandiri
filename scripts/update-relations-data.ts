import { db } from '../src/db';
import { sql } from 'drizzle-orm';

async function updateRelationsData() {
  console.log('Starting data update for relation migration...\n');

  try {
    // 1. Update UPT: map regencies_id to province_id
    console.log('1. Updating UPT data: regencies_id -> province_id...');
    const uptResult = await db.execute(sql`
      UPDATE unit_pelaksanaan_teknis upt
      SET regencies_id = r.province_id
      FROM regencies r
      WHERE upt.regencies_id = r.id
      RETURNING upt.id, upt.regencies_id as new_province_id
    `);

    console.log(`   ✓ Updated ${uptResult.rows.length} UPT records`);
    for (const row of uptResult.rows) {
      console.log(`     UPT ID ${row.id} -> province_id: ${row.new_province_id}`);
    }

    // 2. Update Kelompok Nelayan: map pegawai_id to penyuluh_id
    console.log('\n2. Updating Kelompok Nelayan data: pegawai_id -> penyuluh_id...');
    const kelompokResult = await db.execute(sql`
      UPDATE kelompok_nelayan kn
      SET penyuluh_id = p.id
      FROM penyuluh p
      WHERE kn.penyuluh_id = p.pegawai_id
      RETURNING kn.id, kn.penyuluh_id as new_penyuluh_id
    `);

    console.log(`   ✓ Updated ${kelompokResult.rows.length} Kelompok Nelayan records`);
    for (const row of kelompokResult.rows) {
      console.log(`     Kelompok ID ${row.id} -> penyuluh_id: ${row.new_penyuluh_id}`);
    }

    console.log('\n✓ Data update complete!');
    console.log('\nNext step: Run the schema migration SQL');
    
  } catch (error) {
    console.error('Error during data update:', error);
    throw error;
  }
}

updateRelationsData()
  .then(() => {
    console.log('\nDone!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Data update failed:', error);
    process.exit(1);
  });
