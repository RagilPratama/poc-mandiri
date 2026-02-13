import { db } from '../src/db';
import { kelompokNelayan } from '../src/db/schema/kelompok_nelayan';
import { unitPelaksanaanTeknis } from '../src/db/schema/unit_pelaksanaan_teknis';
import { provinces } from '../src/db/schema/provinces';
import { pegawai } from '../src/db/schema/pegawai';

// Dummy data kelompok nelayan
const dummyKelompokNelayan = [
  {
    nib_kelompok: '012345678',
    no_registrasi: '012345678',
    nama_kelompok: 'Kelompok Nelayan Maju Jaya',
    nik_ketua: '3201234567890123',
    nama_ketua: 'Budi Santoso',
    jumlah_anggota: 25,
  },
  {
    nib_kelompok: '012345679',
    no_registrasi: '012345679',
    nama_kelompok: 'Kelompok Nelayan Sejahtera',
    nik_ketua: '3201234567890124',
    nama_ketua: 'Ahmad Dahlan',
    jumlah_anggota: 30,
  },
  {
    nib_kelompok: '012345680',
    no_registrasi: '012345680',
    nama_kelompok: 'Kelompok Nelayan Bahari',
    nik_ketua: '3201234567890125',
    nama_ketua: 'Siti Nurhaliza',
    jumlah_anggota: 20,
  },
  {
    nib_kelompok: '012345681',
    no_registrasi: '012345681',
    nama_kelompok: 'Kelompok Nelayan Samudra',
    nik_ketua: '3201234567890126',
    nama_ketua: 'Rudi Hartono',
    jumlah_anggota: 35,
  },
  {
    nib_kelompok: '012345682',
    no_registrasi: '012345682',
    nama_kelompok: 'Kelompok Nelayan Pantai Indah',
    nik_ketua: '3201234567890127',
    nama_ketua: 'Dewi Lestari',
    jumlah_anggota: 28,
  },
  {
    nib_kelompok: '012345683',
    no_registrasi: '012345683',
    nama_kelompok: 'Kelompok Nelayan Laut Biru',
    nik_ketua: '3201234567890128',
    nama_ketua: 'Eko Prasetyo',
    jumlah_anggota: 22,
  },
  {
    nib_kelompok: '012345684',
    no_registrasi: '012345684',
    nama_kelompok: 'Kelompok Nelayan Mutiara',
    nik_ketua: '3201234567890129',
    nama_ketua: 'Maya Sari',
    jumlah_anggota: 18,
  },
  {
    nib_kelompok: '012345685',
    no_registrasi: '012345685',
    nama_kelompok: 'Kelompok Nelayan Harapan',
    nik_ketua: '3201234567890130',
    nama_ketua: 'Rina Wijaya',
    jumlah_anggota: 32,
  },
  {
    nib_kelompok: '012345686',
    no_registrasi: '012345686',
    nama_kelompok: 'Kelompok Nelayan Mandiri',
    nik_ketua: '3201234567890131',
    nama_ketua: 'Agus Setiawan',
    jumlah_anggota: 26,
  },
  {
    nib_kelompok: '012345687',
    no_registrasi: '012345687',
    nama_kelompok: 'Kelompok Nelayan Berkah',
    nik_ketua: '3201234567890132',
    nama_ketua: 'Fitri Handayani',
    jumlah_anggota: 24,
  },
];

async function seedKelompokNelayan() {
  try {
    console.log('🌱 Starting kelompok nelayan seeding...');

    // Get all UPT, provinces, and active pegawai
    const allUpt = await db.select().from(unitPelaksanaanTeknis);
    const allProvinces = await db.select().from(provinces).limit(10);
    const allPenyuluh = await db.select().from(pegawai).where(eq(pegawai.status_aktif, true));

    if (allUpt.length === 0) {
      console.error('❌ No UPT found. Please seed UPT first.');
      process.exit(1);
    }

    if (allProvinces.length === 0) {
      console.error('❌ No provinces found. Please seed provinces first.');
      process.exit(1);
    }

    if (allPenyuluh.length === 0) {
      console.error('❌ No active pegawai found. Please seed pegawai first.');
      process.exit(1);
    }

    console.log(`✅ Found ${allUpt.length} UPT`);
    console.log(`✅ Found ${allProvinces.length} provinces`);
    console.log(`✅ Found ${allPenyuluh.length} active penyuluh`);

    // Check if kelompok nelayan already exists
    const existingKelompok = await db.select().from(kelompokNelayan).limit(1);
    if (existingKelompok.length > 0) {
      console.log('⚠️  Kelompok nelayan data already exists. Skipping...');
      process.exit(0);
    }

    // Insert dummy kelompok nelayan
    let inserted = 0;
    for (let i = 0; i < dummyKelompokNelayan.length; i++) {
      const data = dummyKelompokNelayan[i];
      
      // Distribute kelompok across UPT, provinces, and penyuluh
      const uptId = allUpt[i % allUpt.length].id;
      const provinceId = allProvinces[i % allProvinces.length].id;
      const penyuluhId = allPenyuluh[i % allPenyuluh.length].id;

      await db.insert(kelompokNelayan).values({
        ...data,
        upt_id: uptId,
        province_id: provinceId,
        penyuluh_id: penyuluhId,
        gabungan_kelompok_id: null, // No parent for initial seed
      });

      inserted++;
      console.log(`✅ Inserted: ${data.nama_kelompok} - UPT ID: ${uptId}, Province ID: ${provinceId}, Penyuluh ID: ${penyuluhId}`);
    }

    console.log(`\n🎉 Successfully seeded ${inserted} kelompok nelayan!`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding kelompok nelayan:', error);
    process.exit(1);
  }
}

// Import eq from drizzle-orm
import { eq } from 'drizzle-orm';

seedKelompokNelayan();
