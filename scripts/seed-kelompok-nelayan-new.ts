import { db } from '../src/db';
import { mstKelompokNelayan } from '../src/db/schema';
import { mstUpt } from '../src/db/schema';
import { mstProvinsi } from '../src/db/schema';
import { mstPenyuluh } from '../src/db/schema';
import { mstJenisUsaha } from '../src/db/schema';
import { eq } from 'drizzle-orm';

// Generate random date between two dates
function randomDate(start: Date, end: Date): string {
  const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  return date.toISOString().split('T')[0]; // Return YYYY-MM-DD
}

// Dummy data kelompok nelayan dengan field-field baru
const dummyKelompokNelayan = [
  {
    nib_kelompok: 'KN2024001',
    no_registrasi: 'REG/001/2024',
    nama_kelompok: 'Kelompok Nelayan Maju Jaya',
    nik_ketua: '5301234567890001',
    nama_ketua: 'Budi Santoso',
    jenis_kelamin_ketua: 'Laki-Laki',
    jumlah_anggota: 25,
    no_hp_ketua: '081234567001',
    no_hp_penyuluh: '081234560001',
    status_penyuluh: 'Aktif',
    kelas_kelompok: 'Madya',
    alamat: 'Jl. Pantai Timur No. 123, Kec. Kupang Timur',
    tanggal_pembentukan_kelompok: '2020-05-15',
    tanggal_peningkatan_kelas_kelompok: '2023-06-20',
    tanggal_pembentukan_gapokan: '2021-08-10',
  },
  {
    nib_kelompok: 'KN2024002',
    no_registrasi: 'REG/002/2024',
    nama_kelompok: 'Kelompok Nelayan Sejahtera',
    nik_ketua: '5301234567890002',
    nama_ketua: 'Ahmad Dahlan',
    jenis_kelamin_ketua: 'Laki-Laki',
    jumlah_anggota: 30,
    no_hp_ketua: '081234567002',
    no_hp_penyuluh: '081234560002',
    status_penyuluh: 'Aktif',
    kelas_kelompok: 'Utama',
    alamat: 'Jl. Pantai Selatan No. 45, Kec. Kupang Tengah',
    tanggal_pembentukan_kelompok: '2019-03-10',
    tanggal_peningkatan_kelas_kelompok: '2022-09-15',
    tanggal_pembentukan_gapokan: '2020-11-05',
  },
  {
    nib_kelompok: 'KN2024003',
    no_registrasi: 'REG/003/2024',
    nama_kelompok: 'Kelompok Nelayan Bahari',
    nik_ketua: '5301234567890003',
    nama_ketua: 'Siti Nurhaliza',
    jenis_kelamin_ketua: 'Perempuan',
    jumlah_anggota: 20,
    no_hp_ketua: '081234567003',
    no_hp_penyuluh: '081234560003',
    status_penyuluh: 'Aktif',
    kelas_kelompok: 'Pemula',
    alamat: 'Jl. Nelayan No. 78, Kec. Kupang Barat',
    tanggal_pembentukan_kelompok: '2023-01-20',
    tanggal_peningkatan_kelas_kelompok: null,
    tanggal_pembentukan_gapokan: null,
  },
  {
    nib_kelompok: 'KN2024004',
    no_registrasi: 'REG/004/2024',
    nama_kelompok: 'Kelompok Nelayan Samudra',
    nik_ketua: '5301234567890004',
    nama_ketua: 'Rudi Hartono',
    jenis_kelamin_ketua: 'Laki-Laki',
    jumlah_anggota: 35,
    no_hp_ketua: '081234567004',
    no_hp_penyuluh: '081234560004',
    status_penyuluh: 'Aktif',
    kelas_kelompok: 'Madya',
    alamat: 'Jl. Samudra Raya No. 100, Kec. Oebobo',
    tanggal_pembentukan_kelompok: '2018-07-12',
    tanggal_peningkatan_kelas_kelompok: '2021-05-18',
    tanggal_pembentukan_gapokan: '2019-09-22',
  },
  {
    nib_kelompok: 'KN2024005',
    no_registrasi: 'REG/005/2024',
    nama_kelompok: 'Kelompok Nelayan Pantai Indah',
    nik_ketua: '5301234567890005',
    nama_ketua: 'Dewi Lestari',
    jenis_kelamin_ketua: 'Perempuan',
    jumlah_anggota: 28,
    no_hp_ketua: '081234567005',
    no_hp_penyuluh: '081234560005',
    status_penyuluh: 'Tidak Aktif',
    kelas_kelompok: 'Madya',
    alamat: 'Jl. Pantai Indah No. 56, Kec. Kelapa Lima',
    tanggal_pembentukan_kelompok: '2021-04-08',
    tanggal_peningkatan_kelas_kelompok: '2024-02-14',
    tanggal_pembentukan_gapokan: '2022-06-30',
  },
  {
    nib_kelompok: 'KN2024006',
    no_registrasi: 'REG/006/2024',
    nama_kelompok: 'Kelompok Nelayan Laut Biru',
    nik_ketua: '5301234567890006',
    nama_ketua: 'Eko Prasetyo',
    jenis_kelamin_ketua: 'Laki-Laki',
    jumlah_anggota: 22,
    no_hp_ketua: '081234567006',
    no_hp_penyuluh: '081234560006',
    status_penyuluh: 'Aktif',
    kelas_kelompok: 'Pemula',
    alamat: 'Jl. Laut Biru No. 34, Kec. Alak',
    tanggal_pembentukan_kelompok: '2022-11-25',
    tanggal_peningkatan_kelas_kelompok: null,
    tanggal_pembentukan_gapokan: null,
  },
  {
    nib_kelompok: 'KN2024007',
    no_registrasi: 'REG/007/2024',
    nama_kelompok: 'Kelompok Nelayan Mutiara',
    nik_ketua: '5301234567890007',
    nama_ketua: 'Maya Sari',
    jenis_kelamin_ketua: 'Perempuan',
    jumlah_anggota: 18,
    no_hp_ketua: '081234567007',
    no_hp_penyuluh: '081234560007',
    status_penyuluh: 'Aktif',
    kelas_kelompok: 'Utama',
    alamat: 'Jl. Mutiara No. 12, Kec. Kota Raja',
    tanggal_pembentukan_kelompok: '2017-02-28',
    tanggal_peningkatan_kelas_kelompok: '2020-10-05',
    tanggal_pembentukan_gapokan: '2018-12-15',
  },
  {
    nib_kelompok: 'KN2024008',
    no_registrasi: 'REG/008/2024',
    nama_kelompok: 'Kelompok Nelayan Harapan',
    nik_ketua: '5301234567890008',
    nama_ketua: 'Rina Wijaya',
    jenis_kelamin_ketua: 'Perempuan',
    jumlah_anggota: 32,
    no_hp_ketua: '081234567008',
    no_hp_penyuluh: '081234560008',
    status_penyuluh: 'Aktif',
    kelas_kelompok: 'Madya',
    alamat: 'Jl. Harapan Jaya No. 89, Kec. Maulafa',
    tanggal_pembentukan_kelompok: '2020-09-17',
    tanggal_peningkatan_kelas_kelompok: '2023-11-22',
    tanggal_pembentukan_gapokan: '2021-07-08',
  },
  {
    nib_kelompok: 'KN2024009',
    no_registrasi: 'REG/009/2024',
    nama_kelompok: 'Kelompok Nelayan Mandiri',
    nik_ketua: '5301234567890009',
    nama_ketua: 'Agus Setiawan',
    jenis_kelamin_ketua: 'Laki-Laki',
    jumlah_anggota: 26,
    no_hp_ketua: '081234567009',
    no_hp_penyuluh: '081234560009',
    status_penyuluh: 'Aktif',
    kelas_kelompok: 'Pemula',
    alamat: 'Jl. Mandiri No. 67, Kec. Penfui',
    tanggal_pembentukan_kelompok: '2023-08-05',
    tanggal_peningkatan_kelas_kelompok: null,
    tanggal_pembentukan_gapokan: null,
  },
  {
    nib_kelompok: 'KN2024010',
    no_registrasi: 'REG/010/2024',
    nama_kelompok: 'Kelompok Nelayan Berkah',
    nik_ketua: '5301234567890010',
    nama_ketua: 'Fitri Handayani',
    jenis_kelamin_ketua: 'Perempuan',
    jumlah_anggota: 24,
    no_hp_ketua: '081234567010',
    no_hp_penyuluh: '081234560010',
    status_penyuluh: 'Aktif',
    kelas_kelompok: 'Madya',
    alamat: 'Jl. Berkah Selalu No. 23, Kec. Oesapa',
    tanggal_pembentukan_kelompok: '2019-12-10',
    tanggal_peningkatan_kelas_kelompok: '2022-04-25',
    tanggal_pembentukan_gapokan: '2020-08-19',
  },
];

async function seedKelompokNelayan() {
  try {
    console.log('🌱 Starting kelompok nelayan seeding...');

    // Get all UPT, provinces, penyuluh, and jenis usaha
    const allUpt = await db.select().from(mstUpt);
    const allProvinces = await db.select().from(mstProvinsi).limit(10);
    const allPenyuluh = await db.select().from(mstPenyuluh);
    const allJenisUsaha = await db.select().from(mstJenisUsaha);

    if (allUpt.length === 0) {
      console.error('❌ No UPT found. Please seed UPT first.');
      process.exit(1);
    }

    if (allProvinces.length === 0) {
      console.error('❌ No provinces found. Please seed provinces first.');
      process.exit(1);
    }

    if (allPenyuluh.length === 0) {
      console.error('❌ No penyuluh found. Please seed penyuluh first.');
      process.exit(1);
    }

    console.log(`✅ Found ${allUpt.length} UPT`);
    console.log(`✅ Found ${allProvinces.length} provinces`);
    console.log(`✅ Found ${allPenyuluh.length} penyuluh`);
    console.log(`✅ Found ${allJenisUsaha.length} jenis usaha`);

    // Check if kelompok nelayan already exists
    const existingKelompok = await db.select().from(mstKelompokNelayan).limit(1);
    if (existingKelompok.length > 0) {
      console.log('⚠️  Kelompok nelayan data already exists. Skipping seed...');
      console.log('💡 To re-seed, manually delete old data from mst_kelompok_nelayan table first.');
      process.exit(0);
    }

    // Insert dummy kelompok nelayan
    let inserted = 0;
    for (let i = 0; i < dummyKelompokNelayan.length; i++) {
      const data = dummyKelompokNelayan[i];
      
      // Distribute kelompok across UPT, provinces, penyuluh, and jenis usaha
      const uptId = allUpt[i % allUpt.length].id;
      const provinceId = allProvinces[i % allProvinces.length].id;
      const penyuluhId = allPenyuluh[i % allPenyuluh.length].id;
      const jenisUsahaId = allJenisUsaha.length > 0 ? allJenisUsaha[i % allJenisUsaha.length].id : null;

      await db.insert(mstKelompokNelayan).values({
        ...data,
        upt_id: uptId,
        province_id: provinceId,
        penyuluh_id: penyuluhId,
        jenis_usaha_id: jenisUsahaId,
      });

      inserted++;
      console.log(`✅ [${i + 1}/${dummyKelompokNelayan.length}] ${data.nama_kelompok} (${data.kelas_kelompok})`);
    }

    console.log(`\n🎉 Successfully seeded ${inserted} kelompok nelayan!`);
    console.log('');
    console.log('📊 Summary:');
    console.log(`   - Madya: ${dummyKelompokNelayan.filter(k => k.kelas_kelompok === 'Madya').length}`);
    console.log(`   - Utama: ${dummyKelompokNelayan.filter(k => k.kelas_kelompok === 'Utama').length}`);
    console.log(`   - Pemula: ${dummyKelompokNelayan.filter(k => k.kelas_kelompok === 'Pemula').length}`);
    console.log(`   - Laki-Laki: ${dummyKelompokNelayan.filter(k => k.jenis_kelamin_ketua === 'Laki-Laki').length}`);
    console.log(`   - Perempuan: ${dummyKelompokNelayan.filter(k => k.jenis_kelamin_ketua === 'Perempuan').length}`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding kelompok nelayan:', error);
    process.exit(1);
  }
}

seedKelompokNelayan();
