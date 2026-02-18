import { db } from '../src/db';
import { pegawai } from '../src/db/schema/pegawai';
import { penyuluh } from '../src/db/schema/penyuluh';
import { absensi } from '../src/db/schema/absensi';
import { kelompokNelayan } from '../src/db/schema/kelompok_nelayan';

async function updatePegawaiNip() {
  console.log('Starting pegawai NIP update...\n');

  try {
    // 1. Delete all absensi data (foreign key constraint)
    console.log('1. Deleting all absensi data...');
    await db.delete(absensi);
    console.log('   ✓ All absensi data deleted\n');

    // 2. Delete all kelompok_nelayan data (foreign key constraint to penyuluh)
    console.log('2. Deleting all kelompok_nelayan data...');
    await db.delete(kelompokNelayan);
    console.log('   ✓ All kelompok_nelayan data deleted\n');

    // 3. Delete all penyuluh data (foreign key constraint)
    console.log('3. Deleting all penyuluh data...');
    await db.delete(penyuluh);
    console.log('   ✓ All penyuluh data deleted\n');

    // 4. Delete all pegawai data
    console.log('4. Deleting all pegawai data...');
    await db.delete(pegawai);
    console.log('   ✓ All pegawai data deleted\n');

    // 5. Insert new pegawai data with new NIPs
    console.log('5. Inserting pegawai with new NIPs...');
    
    const newPegawaiData = [
      { nip: '01928001', nama: 'Penyuluh Satu', email: 'penyuluh1@example.com', jabatan: 'Penyuluh Perikanan', organisasi_id: 1, role_id: 1 },
      { nip: '28743900', nama: 'Penyuluh Dua', email: 'penyuluh2@example.com', jabatan: 'Penyuluh Perikanan', organisasi_id: 1, role_id: 1 },
      { nip: '01928491', nama: 'Penyuluh Tiga', email: 'penyuluh3@example.com', jabatan: 'Penyuluh Perikanan', organisasi_id: 1, role_id: 1 },
      { nip: '10292489', nama: 'Penyuluh Empat', email: 'penyuluh4@example.com', jabatan: 'Penyuluh Perikanan', organisasi_id: 1, role_id: 1 },
      { nip: '10012094', nama: 'Penyuluh Lima', email: 'penyuluh5@example.com', jabatan: 'Penyuluh Perikanan', organisasi_id: 1, role_id: 1 },
      { nip: '34029401', nama: 'Penyuluh Enam', email: 'penyuluh6@example.com', jabatan: 'Penyuluh Perikanan', organisasi_id: 1, role_id: 1 },
      { nip: '59840192', nama: 'Penyuluh Tujuh', email: 'penyuluh7@example.com', jabatan: 'Penyuluh Perikanan', organisasi_id: 1, role_id: 1 },
      { nip: '01928402', nama: 'Penyuluh Delapan', email: 'penyuluh8@example.com', jabatan: 'Penyuluh Perikanan', organisasi_id: 1, role_id: 1 },
    ];

    for (const data of newPegawaiData) {
      await db.insert(pegawai).values(data);
      console.log(`   ✓ Inserted: ${data.nip} - ${data.nama}`);
    }

    console.log(`\n✓ Successfully inserted ${newPegawaiData.length} pegawai\n`);

    // 6. Summary
    console.log('=== SUMMARY ===');
    console.log(`Total pegawai: ${newPegawaiData.length}`);
    console.log('\nNew NIPs:');
    newPegawaiData.forEach(p => {
      console.log(`  - ${p.nip}: ${p.nama}`);
    });

  } catch (error) {
    console.error('Error updating pegawai NIP:', error);
    throw error;
  }
}

updatePegawaiNip()
  .then(() => {
    console.log('\n✓ Update completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n✗ Update failed:', error);
    process.exit(1);
  });
