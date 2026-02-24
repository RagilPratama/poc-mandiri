import { db } from '../src/db';
import { mstKelompokNelayan } from '../src/db/schema';
import { sql } from 'drizzle-orm';

// Update existing kelompok nelayan dengan field-field baru
const updateData = [
  { kelas_kelompok: 'Madya', jenis_kelamin_ketua: 'Laki-Laki', status_penyuluh: 'Aktif', no_hp_penyuluh: '081234560001' },
  { kelas_kelompok: 'Utama', jenis_kelamin_ketua: 'Laki-Laki', status_penyuluh: 'Aktif', no_hp_penyuluh: '081234560002' },
  { kelas_kelompok: 'Pemula', jenis_kelamin_ketua: 'Perempuan', status_penyuluh: 'Aktif', no_hp_penyuluh: '081234560003' },
  { kelas_kelompok: 'Madya', jenis_kelamin_ketua: 'Laki-Laki', status_penyuluh: 'Aktif', no_hp_penyuluh: '081234560004' },
  { kelas_kelompok: 'Madya', jenis_kelamin_ketua: 'Perempuan', status_penyuluh: 'Tidak Aktif', no_hp_penyuluh: '081234560005' },
  { kelas_kelompok: 'Pemula', jenis_kelamin_ketua: 'Laki-Laki', status_penyuluh: 'Aktif', no_hp_penyuluh: '081234560006' },
  { kelas_kelompok: 'Utama', jenis_kelamin_ketua: 'Perempuan', status_penyuluh: 'Aktif', no_hp_penyuluh: '081234560007' },
  { kelas_kelompok: 'Madya', jenis_kelamin_ketua: 'Perempuan', status_penyuluh: 'Aktif', no_hp_penyuluh: '081234560008' },
  { kelas_kelompok: 'Pemula', jenis_kelamin_ketua: 'Laki-Laki', status_penyuluh: 'Aktif', no_hp_penyuluh: '081234560009' },
  { kelas_kelompok: 'Madya', jenis_kelamin_ketua: 'Perempuan', status_penyuluh: 'Aktif', no_hp_penyuluh: '081234560010' },
];

// Generate random date
function randomDate(startYear: number, endYear: number): string {
  const start = new Date(startYear, 0, 1);
  const end = new Date(endYear, 11, 31);
  const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  return date.toISOString().split('T')[0];
}

async function updateKelompokNelayan() {
  try {
    console.log('🔄 Updating existing kelompok nelayan with new fields...');

    // Get all existing kelompok
    const allKelompok = await db.select().from(mstKelompokNelayan);

    if (allKelompok.length === 0) {
      console.log('⚠️  No kelompok nelayan found. Please seed first.');
      process.exit(1);
    }

    console.log(`✅ Found ${allKelompok.length} kelompok nelayan to update`);

    let updated = 0;
    for (let i = 0; i < allKelompok.length; i++) {
      const kelompok = allKelompok[i];
      const data = updateData[i % updateData.length];
      
      // Generate random dates
      const tanggalPembentukan = randomDate(2017, 2023);
      const pembentukan = new Date(tanggalPembentukan);
      const tanggalPeningkatan = i % 3 === 0 ? null : randomDate(pembentukan.getFullYear() + 1, 2024);
      const tanggalGapokan = i % 4 === 0 ? null : randomDate(pembentukan.getFullYear(), 2024);

      await db.update(mstKelompokNelayan)
        .set({
          jenis_kelamin_ketua: data.jenis_kelamin_ketua,
          no_hp_penyuluh: data.no_hp_penyuluh,
          status_penyuluh: data.status_penyuluh,
          kelas_kelompok: data.kelas_kelompok,
          tanggal_pembentukan_kelompok: tanggalPembentukan,
          tanggal_peningkatan_kelas_kelompok: tanggalPeningkatan,
          tanggal_pembentukan_gapokan: tanggalGapokan,
        })
        .where(sql`${mstKelompokNelayan.id} = ${kelompok.id}`);

      updated++;
      console.log(`✅ [${i + 1}/${allKelompok.length}] Updated: ${kelompok.nama_kelompok} → ${data.kelas_kelompok}, ${data.jenis_kelamin_ketua}`);
    }

    console.log(`\n🎉 Successfully updated ${updated} kelompok nelayan!`);
    console.log('');
    console.log('📋 Fields updated:');
    console.log('   ✓ jenis_kelamin_ketua');
    console.log('   ✓ no_hp_penyuluh');
    console.log('   ✓ status_penyuluh');
    console.log('   ✓ kelas_kelompok');
    console.log('   ✓ tanggal_pembentukan_kelompok');
    console.log('   ✓ tanggal_peningkatan_kelas_kelompok');
    console.log('   ✓ tanggal_pembentukan_gapokan');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error updating kelompok nelayan:', error);
    process.exit(1);
  }
}

updateKelompokNelayan();
