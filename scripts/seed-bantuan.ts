import { db } from '../src/db';
import { 
  trxBantuan,
  mstJenisBantuan,
  mstKelompokNelayan,
  mstPenyuluh,
  mstPegawai,
  mstUpt,
  mstProvinsi
} from '../src/db/schema';
import { eq } from 'drizzle-orm';

async function seedBantuan() {
  try {
    console.log('🌱 Starting bantuan seeding...\n');

    // Check if bantuan already exists
    const existingBantuan = await db.select().from(trxBantuan).limit(1);
    if (existingBantuan.length > 0) {
      console.log('⏭️  Skipped - bantuan data already exists\n');
      process.exit(0);
    }

    // Step 1: Ensure we have penyuluh data
    console.log('📝 Checking penyuluh data...');
    let penyuluhData = await db.select().from(mstPenyuluh).limit(10);
    
    if (penyuluhData.length === 0) {
      console.log('Creating penyuluh data first...');
      const pegawaiData = await db.select().from(mstPegawai).where(eq(mstPegawai.status_aktif, true)).limit(5);
      const uptData = await db.select().from(mstUpt).limit(3);
      const provinsiData = await db.select().from(mstProvinsi).limit(3);

      if (pegawaiData.length === 0 || uptData.length === 0 || provinsiData.length === 0) {
        console.error('❌ Missing required data: pegawai, upt, or provinsi');
        process.exit(1);
      }

      for (let i = 0; i < 5; i++) {
        await db.insert(mstPenyuluh).values({
          pegawai_id: pegawaiData[i % pegawaiData.length].id,
          upt_id: uptData[i % uptData.length].id,
          province_id: provinsiData[i % provinsiData.length].id,
          jumlah_kelompok: Math.floor(Math.random() * 10) + 5,
          program_prioritas: i % 2 === 0 ? 'Program Prioritas Nasional' : null,
          status_aktif: true,
        });
      }
      penyuluhData = await db.select().from(mstPenyuluh).limit(10);
      console.log(`✅ Created ${penyuluhData.length} penyuluh\n`);
    } else {
      console.log(`✅ Found ${penyuluhData.length} penyuluh\n`);
    }

    // Step 2: Ensure we have kelompok nelayan data
    console.log('📝 Checking kelompok nelayan data...');
    let kelompokData = await db.select().from(mstKelompokNelayan).limit(10);
    
    if (kelompokData.length === 0) {
      console.log('Creating kelompok nelayan data first...');
      const uptData = await db.select().from(mstUpt).limit(3);
      const provinsiData = await db.select().from(mstProvinsi).limit(3);

      const kelompokNames = [
        'Kelompok Nelayan Maju Jaya',
        'Kelompok Nelayan Sejahtera',
        'Kelompok Nelayan Bahari',
        'Kelompok Nelayan Samudra',
        'Kelompok Nelayan Pantai Indah',
        'Kelompok Nelayan Laut Biru',
        'Kelompok Nelayan Mutiara',
        'Kelompok Nelayan Harapan',
        'Kelompok Nelayan Mandiri',
        'Kelompok Nelayan Berkah',
      ];

      for (let i = 0; i < 10; i++) {
        await db.insert(mstKelompokNelayan).values({
          nib_kelompok: `01234567${i}`,
          no_registrasi: `REG-2024-${String(i + 1).padStart(4, '0')}`,
          nama_kelompok: kelompokNames[i],
          nik_ketua: `320123456789${String(i).padStart(4, '0')}`,
          nama_ketua: `Ketua ${i + 1}`,
          jumlah_anggota: Math.floor(Math.random() * 20) + 15,
          upt_id: uptData[i % uptData.length].id,
          province_id: provinsiData[i % provinsiData.length].id,
          penyuluh_id: penyuluhData[i % penyuluhData.length].id,
        });
      }
      kelompokData = await db.select().from(mstKelompokNelayan).limit(10);
      console.log(`✅ Created ${kelompokData.length} kelompok nelayan\n`);
    } else {
      console.log(`✅ Found ${kelompokData.length} kelompok nelayan\n`);
    }

    // Step 3: Get jenis bantuan data
    console.log('📝 Getting jenis bantuan data...');
    const jenisBantuanData = await db.select().from(mstJenisBantuan).limit(10);
    if (jenisBantuanData.length === 0) {
      console.error('❌ No jenis bantuan found. Please run seed-all-master-tables.ts first.');
      process.exit(1);
    }
    console.log(`✅ Found ${jenisBantuanData.length} jenis bantuan\n`);

    // Step 4: Create bantuan data
    console.log('📝 Creating bantuan data...');
    const statusOptions = ['Direncanakan', 'Disalurkan', 'Selesai'];
    const sumberDanaOptions = ['APBN', 'APBD Provinsi', 'APBD Kabupaten', 'Swasta'];
    const currentYear = 2026;

    for (let i = 0; i < 15; i++) {
      const jenisBantuan = jenisBantuanData[i % jenisBantuanData.length];
      const kelompok = kelompokData[i % kelompokData.length];
      const penyuluh = penyuluhData[i % penyuluhData.length];
      const status = statusOptions[i % statusOptions.length];
      
      // Generate dates based on status
      const monthOffset = Math.floor(Math.random() * 6);
      const tanggalPenyaluran = new Date(currentYear, monthOffset, Math.floor(Math.random() * 28) + 1);
      const tanggalSelesai = status === 'Selesai' 
        ? new Date(currentYear, monthOffset + 1, Math.floor(Math.random() * 28) + 1)
        : null;

      const jumlah = Math.floor(Math.random() * 50) + 10;
      const nilaiPerUnit = Math.floor(Math.random() * 5000000) + 1000000;
      const nilaiBantuan = jumlah * nilaiPerUnit;

      await db.insert(trxBantuan).values({
        no_bantuan: `BNT-${currentYear}-${String(i + 1).padStart(5, '0')}`,
        jenis_bantuan_id: jenisBantuan.id,
        kelompok_nelayan_id: kelompok.id,
        penyuluh_id: penyuluh.id,
        tanggal_penyaluran: tanggalPenyaluran.toISOString().split('T')[0],
        jumlah: jumlah.toString(),
        satuan: jenisBantuan.satuan || 'unit',
        nilai_bantuan: nilaiBantuan.toString(),
        sumber_dana: sumberDanaOptions[i % sumberDanaOptions.length],
        tahun_anggaran: currentYear,
        status_penyaluran: status,
        tanggal_selesai: tanggalSelesai ? tanggalSelesai.toISOString().split('T')[0] : null,
        keterangan: `Bantuan ${jenisBantuan.nama_jenis_bantuan} untuk ${kelompok.nama_kelompok}`,
      });

      console.log(`✅ Created bantuan ${i + 1}: ${jenisBantuan.nama_jenis_bantuan} - ${kelompok.nama_kelompok}`);
    }

    console.log(`\n🎉 Successfully seeded 15 bantuan records!`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding bantuan:', error);
    process.exit(1);
  }
}

seedBantuan();
