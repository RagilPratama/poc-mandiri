import { db } from '../src/db';
import { 
  mstJenisUsaha, 
  mstKomoditas, 
  mstAlatTangkap, 
  mstJenisBantuan,
  mstJenisPelatihan,
  mstJenisSertifikasi
} from '../src/db/schema';

async function seedAllMasterTables() {
  try {
    console.log('🌱 Starting to seed all master tables...\n');

    // 1. Seed mst_jenis_usaha
    console.log('📝 Seeding mst_jenis_usaha...');
    const existingJenisUsaha = await db.select().from(mstJenisUsaha).limit(1);
    if (existingJenisUsaha.length === 0) {
      const jenisUsahaData = [
        { kode_jenis_usaha: 'JU001', nama_jenis_usaha: 'Budidaya Ikan Air Tawar', kategori: 'Budidaya', keterangan: 'Usaha budidaya ikan di air tawar seperti lele, nila, gurame' },
        { kode_jenis_usaha: 'JU002', nama_jenis_usaha: 'Budidaya Ikan Air Laut', kategori: 'Budidaya', keterangan: 'Usaha budidaya ikan di air laut seperti kerapu, kakap' },
        { kode_jenis_usaha: 'JU003', nama_jenis_usaha: 'Budidaya Udang', kategori: 'Budidaya', keterangan: 'Usaha budidaya udang vaname, windu' },
        { kode_jenis_usaha: 'JU004', nama_jenis_usaha: 'Penangkapan Ikan Laut', kategori: 'Penangkapan', keterangan: 'Usaha penangkapan ikan di laut lepas' },
        { kode_jenis_usaha: 'JU005', nama_jenis_usaha: 'Penangkapan Ikan Pesisir', kategori: 'Penangkapan', keterangan: 'Usaha penangkapan ikan di wilayah pesisir' },
        { kode_jenis_usaha: 'JU006', nama_jenis_usaha: 'Pengolahan Ikan', kategori: 'Pengolahan', keterangan: 'Usaha pengolahan hasil perikanan menjadi produk olahan' },
        { kode_jenis_usaha: 'JU007', nama_jenis_usaha: 'Pembenihan Ikan', kategori: 'Pembenihan', keterangan: 'Usaha pembenihan dan pembibitan ikan' },
        { kode_jenis_usaha: 'JU008', nama_jenis_usaha: 'Budidaya Rumput Laut', kategori: 'Budidaya', keterangan: 'Usaha budidaya rumput laut' },
        { kode_jenis_usaha: 'JU009', nama_jenis_usaha: 'Budidaya Kerang', kategori: 'Budidaya', keterangan: 'Usaha budidaya kerang hijau, tiram' },
        { kode_jenis_usaha: 'JU010', nama_jenis_usaha: 'Pemasaran Hasil Perikanan', kategori: 'Pemasaran', keterangan: 'Usaha pemasaran dan distribusi hasil perikanan' },
      ];
      await db.insert(mstJenisUsaha).values(jenisUsahaData);
      console.log('✅ Seeded 10 jenis usaha\n');
    } else {
      console.log('⏭️  Skipped - jenis usaha already exists\n');
    }

    // 2. Seed mst_komoditas
    console.log('📝 Seeding mst_komoditas...');
    const existingKomoditas = await db.select().from(mstKomoditas).limit(1);
    if (existingKomoditas.length === 0) {
      const komoditasData = [
        { kode_komoditas: 'KOM001', nama_komoditas: 'Ikan Tuna', kategori: 'Ikan Laut', satuan: 'kg', nama_ilmiah: 'Thunnus', keterangan: 'Ikan tuna sirip kuning' },
        { kode_komoditas: 'KOM002', nama_komoditas: 'Ikan Cakalang', kategori: 'Ikan Laut', satuan: 'kg', nama_ilmiah: 'Katsuwonus pelamis', keterangan: 'Ikan cakalang untuk kaleng' },
        { kode_komoditas: 'KOM003', nama_komoditas: 'Udang Vaname', kategori: 'Udang', satuan: 'kg', nama_ilmiah: 'Litopenaeus vannamei', keterangan: 'Udang vaname budidaya' },
        { kode_komoditas: 'KOM004', nama_komoditas: 'Ikan Nila', kategori: 'Ikan Air Tawar', satuan: 'kg', nama_ilmiah: 'Oreochromis niloticus', keterangan: 'Ikan nila budidaya' },
        { kode_komoditas: 'KOM005', nama_komoditas: 'Ikan Lele', kategori: 'Ikan Air Tawar', satuan: 'kg', nama_ilmiah: 'Clarias gariepinus', keterangan: 'Ikan lele dumbo' },
        { kode_komoditas: 'KOM006', nama_komoditas: 'Ikan Kerapu', kategori: 'Ikan Laut', satuan: 'kg', nama_ilmiah: 'Epinephelus', keterangan: 'Ikan kerapu macan' },
        { kode_komoditas: 'KOM007', nama_komoditas: 'Rumput Laut', kategori: 'Rumput Laut', satuan: 'kg', nama_ilmiah: 'Eucheuma cottonii', keterangan: 'Rumput laut untuk karaginan' },
        { kode_komoditas: 'KOM008', nama_komoditas: 'Kepiting', kategori: 'Krustasea', satuan: 'kg', nama_ilmiah: 'Scylla serrata', keterangan: 'Kepiting bakau' },
        { kode_komoditas: 'KOM009', nama_komoditas: 'Ikan Kakap', kategori: 'Ikan Laut', satuan: 'kg', nama_ilmiah: 'Lates calcarifer', keterangan: 'Ikan kakap putih' },
        { kode_komoditas: 'KOM010', nama_komoditas: 'Kerang Hijau', kategori: 'Moluska', satuan: 'kg', nama_ilmiah: 'Perna viridis', keterangan: 'Kerang hijau budidaya' },
      ];
      await db.insert(mstKomoditas).values(komoditasData);
      console.log('✅ Seeded 10 komoditas\n');
    } else {
      console.log('⏭️  Skipped - komoditas already exists\n');
    }

    // 3. Seed mst_alat_tangkap
    console.log('📝 Seeding mst_alat_tangkap...');
    const existingAlatTangkap = await db.select().from(mstAlatTangkap).limit(1);
    if (existingAlatTangkap.length === 0) {
      const alatTangkapData = [
        { kode_alat_tangkap: 'AT001', nama_alat_tangkap: 'Jaring Insang', jenis: 'Jaring', keterangan: 'Jaring insang hanyut untuk menangkap ikan pelagis' },
        { kode_alat_tangkap: 'AT002', nama_alat_tangkap: 'Pukat Cincin', jenis: 'Pukat', keterangan: 'Pukat cincin untuk menangkap ikan bergerombol' },
        { kode_alat_tangkap: 'AT003', nama_alat_tangkap: 'Pancing Tonda', jenis: 'Pancing', keterangan: 'Pancing tonda untuk menangkap tuna' },
        { kode_alat_tangkap: 'AT004', nama_alat_tangkap: 'Bubu', jenis: 'Perangkap', keterangan: 'Bubu untuk menangkap kepiting dan lobster' },
        { kode_alat_tangkap: 'AT005', nama_alat_tangkap: 'Jaring Arad', jenis: 'Jaring', keterangan: 'Jaring arad untuk menangkap udang' },
        { kode_alat_tangkap: 'AT006', nama_alat_tangkap: 'Rawai Tuna', jenis: 'Pancing', keterangan: 'Rawai untuk menangkap tuna dan cakalang' },
        { kode_alat_tangkap: 'AT007', nama_alat_tangkap: 'Bagan', jenis: 'Jaring Angkat', keterangan: 'Bagan apung untuk menangkap ikan teri' },
        { kode_alat_tangkap: 'AT008', nama_alat_tangkap: 'Sero', jenis: 'Perangkap', keterangan: 'Sero untuk menangkap ikan di pesisir' },
        { kode_alat_tangkap: 'AT009', nama_alat_tangkap: 'Jaring Rampus', jenis: 'Jaring', keterangan: 'Jaring rampus untuk menangkap ikan demersal' },
        { kode_alat_tangkap: 'AT010', nama_alat_tangkap: 'Pancing Ulur', jenis: 'Pancing', keterangan: 'Pancing ulur untuk menangkap ikan karang' },
      ];
      await db.insert(mstAlatTangkap).values(alatTangkapData);
      console.log('✅ Seeded 10 alat tangkap\n');
    } else {
      console.log('⏭️  Skipped - alat tangkap already exists\n');
    }

    // 4. Seed mst_jenis_bantuan
    console.log('📝 Seeding mst_jenis_bantuan...');
    const existingJenisBantuan = await db.select().from(mstJenisBantuan).limit(1);
    if (existingJenisBantuan.length === 0) {
      const jenisBantuanData = [
        { kode_jenis_bantuan: 'BT001', nama_jenis_bantuan: 'Bantuan Alat Tangkap', kategori: 'Alat', satuan: 'unit', keterangan: 'Bantuan berupa alat tangkap ikan' },
        { kode_jenis_bantuan: 'BT002', nama_jenis_bantuan: 'Bantuan Perahu', kategori: 'Infrastruktur', satuan: 'unit', keterangan: 'Bantuan perahu untuk nelayan' },
        { kode_jenis_bantuan: 'BT003', nama_jenis_bantuan: 'Bantuan Mesin Kapal', kategori: 'Alat', satuan: 'unit', keterangan: 'Bantuan mesin tempel untuk kapal' },
        { kode_jenis_bantuan: 'BT004', nama_jenis_bantuan: 'Bantuan Bibit Ikan', kategori: 'Benih', satuan: 'ekor', keterangan: 'Bantuan bibit ikan untuk budidaya' },
        { kode_jenis_bantuan: 'BT005', nama_jenis_bantuan: 'Bantuan Pakan Ikan', kategori: 'Pakan', satuan: 'kg', keterangan: 'Bantuan pakan untuk budidaya ikan' },
        { kode_jenis_bantuan: 'BT006', nama_jenis_bantuan: 'Bantuan Modal Usaha', kategori: 'Modal', satuan: 'rupiah', keterangan: 'Bantuan modal usaha perikanan' },
        { kode_jenis_bantuan: 'BT007', nama_jenis_bantuan: 'Bantuan Kolam Budidaya', kategori: 'Infrastruktur', satuan: 'unit', keterangan: 'Bantuan pembuatan kolam budidaya' },
        { kode_jenis_bantuan: 'BT008', nama_jenis_bantuan: 'Bantuan Keramba Jaring Apung', kategori: 'Infrastruktur', satuan: 'unit', keterangan: 'Bantuan KJA untuk budidaya' },
        { kode_jenis_bantuan: 'BT009', nama_jenis_bantuan: 'Bantuan Alat Pengolahan', kategori: 'Alat', satuan: 'paket', keterangan: 'Bantuan alat pengolahan hasil perikanan' },
        { kode_jenis_bantuan: 'BT010', nama_jenis_bantuan: 'Bantuan Cold Storage', kategori: 'Infrastruktur', satuan: 'unit', keterangan: 'Bantuan cold storage untuk penyimpanan' },
      ];
      await db.insert(mstJenisBantuan).values(jenisBantuanData);
      console.log('✅ Seeded 10 jenis bantuan\n');
    } else {
      console.log('⏭️  Skipped - jenis bantuan already exists\n');
    }

    // 5. Seed mst_jenis_pelatihan
    console.log('📝 Seeding mst_jenis_pelatihan...');
    const existingJenisPelatihan = await db.select().from(mstJenisPelatihan).limit(1);
    if (existingJenisPelatihan.length === 0) {
      const jenisPelatihanData = [
        { kode_jenis_pelatihan: 'PL001', nama_jenis_pelatihan: 'Pelatihan Budidaya Ikan', kategori: 'Teknis', durasi_hari: 3, target_peserta: 'Pembudidaya', keterangan: 'Pelatihan teknik budidaya ikan air tawar' },
        { kode_jenis_pelatihan: 'PL002', nama_jenis_pelatihan: 'Pelatihan Pengolahan Ikan', kategori: 'Pengolahan', durasi_hari: 2, target_peserta: 'Pengolah', keterangan: 'Pelatihan pengolahan dan diversifikasi produk' },
        { kode_jenis_pelatihan: 'PL003', nama_jenis_pelatihan: 'Pelatihan Manajemen Usaha', kategori: 'Manajemen', durasi_hari: 2, target_peserta: 'Semua', keterangan: 'Pelatihan manajemen usaha perikanan' },
        { kode_jenis_pelatihan: 'PL004', nama_jenis_pelatihan: 'Pelatihan Keselamatan Melaut', kategori: 'Teknis', durasi_hari: 1, target_peserta: 'Nelayan', keterangan: 'Pelatihan keselamatan dan survival di laut' },
        { kode_jenis_pelatihan: 'PL005', nama_jenis_pelatihan: 'Pelatihan Pembenihan Ikan', kategori: 'Teknis', durasi_hari: 5, target_peserta: 'Pembudidaya', keterangan: 'Pelatihan teknik pembenihan ikan' },
        { kode_jenis_pelatihan: 'PL006', nama_jenis_pelatihan: 'Pelatihan Budidaya Udang', kategori: 'Teknis', durasi_hari: 3, target_peserta: 'Pembudidaya', keterangan: 'Pelatihan budidaya udang vaname' },
        { kode_jenis_pelatihan: 'PL007', nama_jenis_pelatihan: 'Pelatihan Penanganan Pasca Panen', kategori: 'Pengolahan', durasi_hari: 2, target_peserta: 'Nelayan', keterangan: 'Pelatihan penanganan hasil tangkapan' },
        { kode_jenis_pelatihan: 'PL008', nama_jenis_pelatihan: 'Pelatihan Navigasi Kapal', kategori: 'Teknis', durasi_hari: 3, target_peserta: 'Nelayan', keterangan: 'Pelatihan navigasi dan penggunaan GPS' },
        { kode_jenis_pelatihan: 'PL009', nama_jenis_pelatihan: 'Pelatihan Pakan Ikan Mandiri', kategori: 'Teknis', durasi_hari: 2, target_peserta: 'Pembudidaya', keterangan: 'Pelatihan pembuatan pakan ikan mandiri' },
        { kode_jenis_pelatihan: 'PL010', nama_jenis_pelatihan: 'Pelatihan Pemasaran Digital', kategori: 'Pemasaran', durasi_hari: 2, target_peserta: 'Semua', keterangan: 'Pelatihan pemasaran produk secara online' },
      ];
      await db.insert(mstJenisPelatihan).values(jenisPelatihanData);
      console.log('✅ Seeded 10 jenis pelatihan\n');
    } else {
      console.log('⏭️  Skipped - jenis pelatihan already exists\n');
    }

    // 6. Seed mst_jenis_sertifikasi
    console.log('📝 Seeding mst_jenis_sertifikasi...');
    const existingJenisSertifikasi = await db.select().from(mstJenisSertifikasi).limit(1);
    if (existingJenisSertifikasi.length === 0) {
      const jenisSertifikasiData = [
        { kode_jenis_sertifikasi: 'SR001', nama_jenis_sertifikasi: 'Sertifikat CBIB', kategori: 'Produk', lembaga_penerbit: 'Kementerian Kelautan dan Perikanan', masa_berlaku_tahun: 3, keterangan: 'Cara Budidaya Ikan yang Baik' },
        { kode_jenis_sertifikasi: 'SR002', nama_jenis_sertifikasi: 'Sertifikat CPIB', kategori: 'Produk', lembaga_penerbit: 'Kementerian Kelautan dan Perikanan', masa_berlaku_tahun: 3, keterangan: 'Cara Penanganan Ikan yang Baik' },
        { kode_jenis_sertifikasi: 'SR003', nama_jenis_sertifikasi: 'Sertifikat Halal', kategori: 'Produk', lembaga_penerbit: 'Majelis Ulama Indonesia', masa_berlaku_tahun: 2, keterangan: 'Sertifikat halal produk perikanan' },
        { kode_jenis_sertifikasi: 'SR004', nama_jenis_sertifikasi: 'Sertifikat HACCP', kategori: 'Produk', lembaga_penerbit: 'BPOM', masa_berlaku_tahun: 3, keterangan: 'Hazard Analysis Critical Control Point' },
        { kode_jenis_sertifikasi: 'SR005', nama_jenis_sertifikasi: 'Sertifikat Organik', kategori: 'Produk', lembaga_penerbit: 'Kementerian Pertanian', masa_berlaku_tahun: 1, keterangan: 'Sertifikat produk organik' },
        { kode_jenis_sertifikasi: 'SR006', nama_jenis_sertifikasi: 'Sertifikat SIUP', kategori: 'Usaha', lembaga_penerbit: 'Dinas Kelautan dan Perikanan', masa_berlaku_tahun: 5, keterangan: 'Surat Izin Usaha Perikanan' },
        { kode_jenis_sertifikasi: 'SR007', nama_jenis_sertifikasi: 'Sertifikat SIPI', kategori: 'Usaha', lembaga_penerbit: 'Dinas Kelautan dan Perikanan', masa_berlaku_tahun: 5, keterangan: 'Surat Izin Penangkapan Ikan' },
        { kode_jenis_sertifikasi: 'SR008', nama_jenis_sertifikasi: 'Sertifikat Kelayakan Kapal', kategori: 'Usaha', lembaga_penerbit: 'Syahbandar', masa_berlaku_tahun: 2, keterangan: 'Sertifikat kelayakan kapal perikanan' },
        { kode_jenis_sertifikasi: 'SR009', nama_jenis_sertifikasi: 'Sertifikat Nahkoda', kategori: 'Kompetensi', lembaga_penerbit: 'Kementerian Perhubungan', masa_berlaku_tahun: 5, keterangan: 'Sertifikat kompetensi nahkoda' },
        { kode_jenis_sertifikasi: 'SR010', nama_jenis_sertifikasi: 'Sertifikat MSC', kategori: 'Produk', lembaga_penerbit: 'Marine Stewardship Council', masa_berlaku_tahun: 3, keterangan: 'Sertifikasi perikanan berkelanjutan' },
      ];
      await db.insert(mstJenisSertifikasi).values(jenisSertifikasiData);
      console.log('✅ Seeded 10 jenis sertifikasi\n');
    } else {
      console.log('⏭️  Skipped - jenis sertifikasi already exists\n');
    }

    console.log('🎉 All master tables seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding master tables:', error);
    process.exit(1);
  }
}

seedAllMasterTables();
