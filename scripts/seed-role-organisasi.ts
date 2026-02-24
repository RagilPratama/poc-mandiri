import { db } from '../src/db';
import { mstRole, mstOrganisasi } from '../src/db/schema';

export async function seedRole() {
  console.log('📝 Seeding mst_role...');
  const existing = await db.select().from(mstRole).limit(1);
  if (existing.length > 0) {
    console.log('⏭️  Skipped - mst_role already has data\n');
    return;
  }

  const data = [
    { level_role: '1', nama_role: 'Super Admin', keterangan: 'Akses penuh ke seluruh sistem' },
    { level_role: '2', nama_role: 'Admin Sistem', keterangan: 'Mengelola data master dan pengguna' },
    { level_role: '3', nama_role: 'Kepala Dinas', keterangan: 'Pimpinan Dinas Kelautan dan Perikanan Provinsi' },
    { level_role: '4', nama_role: 'Kepala Bidang', keterangan: 'Kepala Bidang lingkup Dinas KP' },
    { level_role: '5', nama_role: 'Kepala UPT', keterangan: 'Kepala Unit Pelaksana Teknis Perikanan' },
    { level_role: '6', nama_role: 'Penyuluh Perikanan Ahli Madya', keterangan: 'Penyuluh fungsional Golongan IV, jabatan Madya' },
    { level_role: '7', nama_role: 'Penyuluh Perikanan Ahli Muda', keterangan: 'Penyuluh fungsional Golongan III/c–III/d, jabatan Muda' },
    { level_role: '8', nama_role: 'Penyuluh Perikanan Ahli Pertama', keterangan: 'Penyuluh fungsional Golongan III/a–III/b, jabatan Pertama' },
    { level_role: '9', nama_role: 'Penyuluh Perikanan Terampil', keterangan: 'Penyuluh fungsional Golongan II–III, kategori Terampil' },
    { level_role: '10', nama_role: 'Staf Administrasi', keterangan: 'Pegawai pendukung administrasi dan tata usaha' },
  ];

  const result = await db.insert(mstRole).values(data).returning();
  console.log(`✅ Seeded ${result.length} role\n`);
}

export async function seedOrganisasi() {
  console.log('📝 Seeding mst_organisasi...');
  const existing = await db.select().from(mstOrganisasi).limit(1);
  if (existing.length > 0) {
    console.log('⏭️  Skipped - mst_organisasi already has data\n');
    return;
  }

  const data = [
    {
      level_organisasi: 'Dinas',
      kode_organisasi: 'DKP-SULSEL',
      nama_organisasi: 'Dinas Kelautan dan Perikanan Provinsi Sulawesi Selatan',
      keterangan: 'Instansi utama pengelola kelautan dan perikanan tingkat provinsi',
    },
    {
      level_organisasi: 'Bidang',
      kode_organisasi: 'BID-TANGKAP',
      nama_organisasi: 'Bidang Perikanan Tangkap',
      keterangan: 'Membidangi perencanaan, pengelolaan, dan pengembangan perikanan tangkap',
    },
    {
      level_organisasi: 'Bidang',
      kode_organisasi: 'BID-BUDIDAYA',
      nama_organisasi: 'Bidang Perikanan Budidaya',
      keterangan: 'Membidangi pengembangan budidaya ikan air tawar, payau, dan laut',
    },
    {
      level_organisasi: 'Bidang',
      kode_organisasi: 'BID-OLAHAN',
      nama_organisasi: 'Bidang Pengolahan dan Pemasaran Hasil Perikanan',
      keterangan: 'Membidangi mutu produk, diversifikasi olahan, dan akses pasar',
    },
    {
      level_organisasi: 'Bidang',
      kode_organisasi: 'BID-PENGAWASAN',
      nama_organisasi: 'Bidang Pengawasan Sumber Daya Kelautan dan Perikanan',
      keterangan: 'Membidangi pengawasan penangkapan, budidaya, dan konservasi SDKP',
    },
    {
      level_organisasi: 'Sekretariat',
      kode_organisasi: 'SEKRET-DKP',
      nama_organisasi: 'Sekretariat Dinas Kelautan dan Perikanan',
      keterangan: 'Unit pelayanan administrasi umum, keuangan, dan kepegawaian dinas',
    },
    {
      level_organisasi: 'UPT',
      kode_organisasi: 'UPT-WIL1',
      nama_organisasi: 'UPT Pengelolaan Perikanan Wilayah I Makassar',
      keterangan: 'Meliputi wilayah kerja Kota Makassar, Gowa, dan Takalar',
    },
    {
      level_organisasi: 'UPT',
      kode_organisasi: 'UPT-WIL2',
      nama_organisasi: 'UPT Pengelolaan Perikanan Wilayah II Bone',
      keterangan: 'Meliputi wilayah kerja Kabupaten Bone, Wajo, dan Soppeng',
    },
    {
      level_organisasi: 'UPT',
      kode_organisasi: 'UPT-WIL3',
      nama_organisasi: 'UPT Pengelolaan Perikanan Wilayah III Pangkep',
      keterangan: 'Meliputi wilayah kerja Kabupaten Pangkajene Kepulauan dan Maros',
    },
    {
      level_organisasi: 'UPT',
      kode_organisasi: 'UPT-WIL4',
      nama_organisasi: 'UPT Pengelolaan Perikanan Wilayah IV Barru',
      keterangan: 'Meliputi wilayah kerja Kabupaten Barru dan Parepare',
    },
    {
      level_organisasi: 'UPT',
      kode_organisasi: 'UPT-WIL5',
      nama_organisasi: 'UPT Pengelolaan Perikanan Wilayah V Sinjai',
      keterangan: 'Meliputi wilayah kerja Kabupaten Sinjai dan Bulukumba',
    },
  ];

  const result = await db.insert(mstOrganisasi).values(data).returning();
  console.log(`✅ Seeded ${result.length} organisasi\n`);
}

async function main() {
  try {
    console.log('🌱 Seeding mst_role & mst_organisasi...\n');
    await seedRole();
    await seedOrganisasi();
    console.log('🎉 Selesai!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

if (import.meta.main) main();
