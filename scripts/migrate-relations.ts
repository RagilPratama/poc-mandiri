import { db } from '../src/db';
import { sql } from 'drizzle-orm';

async function migrateRelations() {
  console.log('Starting relation migration...\n');

  try {
    // 1. Analyze UPT: regency_id -> province_id mapping
    console.log('1. Analyzing UPT regencies_id to province_id mapping...');
    const uptMapping = await db.execute(sql`
      SELECT 
        upt.id as upt_id,
        upt.regencies_id,
        r.province_id
      FROM unit_pelaksanaan_teknis upt
      LEFT JOIN regencies r ON upt.regencies_id = r.id
    `);

    console.log(`   Found ${uptMapping.rows.length} UPT records`);
    for (const row of uptMapping.rows) {
      if (row.province_id) {
        console.log(`   UPT ID ${row.upt_id}: regency ${row.regencies_id} -> province ${row.province_id}`);
      } else {
        console.log(`   WARNING: UPT ID ${row.upt_id} has invalid regency_id ${row.regencies_id}`);
      }
    }

    // 2. Analyze Kelompok Nelayan: pegawai_id -> penyuluh_id mapping
    console.log('\n2. Analyzing Kelompok Nelayan penyuluh_id mapping...');
    const kelompokMapping = await db.execute(sql`
      SELECT 
        kn.id as kelompok_id,
        kn.penyuluh_id as pegawai_id,
        p.id as penyuluh_id
      FROM kelompok_nelayan kn
      LEFT JOIN penyuluh p ON kn.penyuluh_id = p.pegawai_id
    `);

    console.log(`   Found ${kelompokMapping.rows.length} Kelompok Nelayan records`);
    let validMappings = 0;
    let invalidMappings = 0;
    
    for (const row of kelompokMapping.rows) {
      if (row.penyuluh_id) {
        console.log(`   Kelompok ID ${row.kelompok_id}: pegawai ${row.pegawai_id} -> penyuluh ${row.penyuluh_id}`);
        validMappings++;
      } else {
        console.log(`   WARNING: Kelompok ID ${row.kelompok_id} has pegawai_id ${row.pegawai_id} that is not a penyuluh`);
        invalidMappings++;
      }
    }

    console.log(`\n   Valid mappings: ${validMappings}`);
    console.log(`   Invalid mappings: ${invalidMappings}`);

    if (invalidMappings > 0) {
      console.log('\n⚠️  WARNING: Some kelompok nelayan reference pegawai that are not penyuluh!');
      console.log('   You need to either:');
      console.log('   1. Create penyuluh records for those pegawai, OR');
      console.log('   2. Update kelompok nelayan to reference valid penyuluh');
      return;
    }

    console.log('\n✓ All mappings are valid!');
    console.log('\nReady to proceed with migration.');
    
  } catch (error) {
    console.error('Error during migration analysis:', error);
    throw error;
  }
}

migrateRelations()
  .then(() => {
    console.log('\nDone!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Migration failed:', error);
    process.exit(1);
  });
