import { db } from '../src/db';
import { penyuluh } from '../src/db/schema/penyuluh';
import { pegawai } from '../src/db/schema/pegawai';
import { unitPelaksanaanTeknis } from '../src/db/schema/unit_pelaksanaan_teknis';
import { provinces } from '../src/db/schema/provinces';
import { eq } from 'drizzle-orm';

async function seedPenyuluh() {
  try {
    console.log('🌱 Starting penyuluh seeding...');

    // Get all active pegawai, UPT, and provinces
    const allPegawai = await db.select().from(pegawai).where(eq(pegawai.status_aktif, true));
    const allUpt = await db.select().from(unitPelaksanaanTeknis);
    const allProvinces = await db.select().from(provinces).limit(10);

    if (allPegawai.length === 0) {
      console.error('❌ No active pegawai found. Please seed pegawai first.');
      process.exit(1);
    }

    if (allUpt.length === 0) {
      console.error('❌ No UPT found. Please seed UPT first.');
      process.exit(1);
    }

    if (allProvinces.length === 0) {
      console.error('❌ No provinces found. Please seed provinces first.');
      process.exit(1);
    }

    console.log(`✅ Found ${allPegawai.length} active pegawai`);
    console.log(`✅ Found ${allUpt.length} UPT`);
    console.log(`✅ Found ${allProvinces.length} provinces`);

    // Check if penyuluh already exists
    const existingPenyuluh = await db.select().from(penyuluh).limit(1);
    if (existingPenyuluh.length > 0) {
      console.log('⚠️  Penyuluh data already exists. Skipping...');
      process.exit(0);
    }

    const programPrioritas = [
      'Program Prioritas 1',
      'Program Prioritas 2',
      'Program Prioritas 3',
      null,
    ];

    // Insert penyuluh for each active pegawai
    let inserted = 0;
    for (let i = 0; i < allPegawai.length; i++) {
      const pegawaiData = allPegawai[i];
      
      // Distribute across UPT and provinces
      const uptId = allUpt[i % allUpt.length].id;
      const provinceId = allProvinces[i % allProvinces.length].id;
      const program = programPrioritas[i % programPrioritas.length];

      await db.insert(penyuluh).values({
        pegawai_id: pegawaiData.id,
        upt_id: uptId,
        province_id: provinceId,
        jumlah_kelompok: Math.floor(Math.random() * 10) + 1, // Random 1-10
        program_prioritas: program,
        status_aktif: true,
      });

      inserted++;
      console.log(`✅ Inserted: ${pegawaiData.nama} (${pegawaiData.nip}) - UPT ID: ${uptId}, Province ID: ${provinceId}`);
    }

    console.log(`\n🎉 Successfully seeded ${inserted} penyuluh!`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding penyuluh:', error);
    process.exit(1);
  }
}

seedPenyuluh();
