import { db } from '../src/db';
import { mstUpt, mstProvinsi } from '../src/db/schema';
import { ilike } from 'drizzle-orm';

export async function seedUpt() {
  console.log('📝 Seeding mst_upt...');
  const existing = await db.select().from(mstUpt).limit(1);
  if (existing.length > 0) {
    console.log('⏭️  Skipped - mst_upt already has data\n');
    return;
  }

  // Ambil province Sulawesi Selatan
  const provinsi = await db
    .select()
    .from(mstProvinsi)
    .where(ilike(mstProvinsi.name, '%sulawesi selatan%'))
    .limit(1);

  if (provinsi.length === 0) {
    throw new Error('Provinsi Sulawesi Selatan tidak ditemukan. Pastikan data wilayah sudah di-seed.');
  }

  const provinceId = provinsi[0].id;
  console.log(`   Menggunakan provinsi: ${provinsi[0].name} (ID: ${provinceId})`);

  const data = [
    {
      nama_organisasi: 'UPT Pengelolaan Perikanan Wilayah I Makassar',
      pimpinan: 'Haerullah Rahman, S.Pi., M.Si.',
      province_id: provinceId,
    },
    {
      nama_organisasi: 'UPT Pengelolaan Perikanan Wilayah II Bone',
      pimpinan: 'Darmawan Latif, S.Pi.',
      province_id: provinceId,
    },
    {
      nama_organisasi: 'UPT Pengelolaan Perikanan Wilayah III Pangkep',
      pimpinan: 'Ruslan Hasanuddin, S.Pi., M.M.',
      province_id: provinceId,
    },
    {
      nama_organisasi: 'UPT Pengelolaan Perikanan Wilayah IV Barru',
      pimpinan: 'Jumadi Mappeasse, S.St.Pi.',
      province_id: provinceId,
    },
    {
      nama_organisasi: 'UPT Pengelolaan Perikanan Wilayah V Sinjai',
      pimpinan: 'Amirullah Tahir, S.Pi.',
      province_id: provinceId,
    },
  ];

  const result = await db.insert(mstUpt).values(data).returning();
  console.log(`✅ Seeded ${result.length} UPT\n`);
}

async function main() {
  try {
    console.log('🌱 Seeding mst_upt...\n');
    await seedUpt();
    console.log('🎉 Selesai!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

if (import.meta.main) main();
