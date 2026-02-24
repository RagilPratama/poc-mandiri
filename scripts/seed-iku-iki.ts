import { db } from '../src/db';
import { mstIku, mstIki } from '../src/db/schema';

async function seedIkuIki() {
  try {
    console.log('🌱 Starting seed mst_iku & mst_iki...\n');

    // ─── 1. Seed mst_iku ───────────────────────────────────────────────────────
    console.log('📝 Seeding mst_iku...');
    const existingIku = await db.select().from(mstIku).limit(1);

    if (existingIku.length > 0) {
      console.log('⏭️  Skipped - mst_iku already has data\n');
    } else {
      const ikuData = [
        {
          kode_iku: 'IKU-01',
          nama_iku: 'Peningkatan Produksi Perikanan Tangkap',
          deskripsi:
            'Meningkatkan volume produksi hasil tangkapan nelayan binaan di wilayah kerja',
          tahun: 2026,
          target: '1500.00',
          satuan: 'ton',
          is_active: true,
        },
        {
          kode_iku: 'IKU-02',
          nama_iku: 'Peningkatan Produksi Perikanan Budidaya',
          deskripsi:
            'Meningkatkan volume produksi hasil budidaya pembudidaya ikan binaan',
          tahun: 2026,
          target: '2000.00',
          satuan: 'ton',
          is_active: true,
        },
        {
          kode_iku: 'IKU-03',
          nama_iku: 'Peningkatan Pendapatan Pelaku Usaha Perikanan',
          deskripsi:
            'Meningkatkan rata-rata pendapatan nelayan dan pembudidaya ikan binaan',
          tahun: 2026,
          target: '5000000.00',
          satuan: 'rupiah/bulan',
          is_active: true,
        },
        {
          kode_iku: 'IKU-04',
          nama_iku: 'Penguatan Kelembagaan Kelompok Nelayan',
          deskripsi:
            'Meningkatkan jumlah kelompok nelayan yang aktif dan berdaya saing',
          tahun: 2026,
          target: '25.00',
          satuan: 'kelompok',
          is_active: true,
        },
        {
          kode_iku: 'IKU-05',
          nama_iku: 'Peningkatan Adopsi Teknologi Perikanan',
          deskripsi:
            'Meningkatkan persentase nelayan dan pembudidaya yang mengadopsi teknologi baru',
          tahun: 2026,
          target: '70.00',
          satuan: '%',
          is_active: true,
        },
        {
          kode_iku: 'IKU-06',
          nama_iku: 'Peningkatan Kualitas SDM Perikanan',
          deskripsi:
            'Meningkatkan kompetensi pelaku usaha perikanan melalui pelatihan dan sertifikasi',
          tahun: 2026,
          target: '200.00',
          satuan: 'orang',
          is_active: true,
        },
      ];

      const insertedIku = await db.insert(mstIku).values(ikuData).returning();
      console.log(`✅ Seeded ${insertedIku.length} IKU\n`);

      // ─── 2. Seed mst_iki ─────────────────────────────────────────────────────
      console.log('📝 Seeding mst_iki...');

      // Petakan kode_iku → id hasil insert
      const ikuMap = new Map(insertedIku.map((r) => [r.kode_iku, r.id]));

      const ikiData = [
        // ── IKU-01: Produksi Tangkap ──────────────────────────────────────────
        {
          iku_id: ikuMap.get('IKU-01')!,
          kode_iki: 'IKI-01-01',
          nama_iki: 'Jumlah Kunjungan ke Kelompok Nelayan Tangkap',
          deskripsi:
            'Frekuensi kunjungan penyuluh ke kelompok nelayan tangkap per bulan',
          target: '8.00',
          satuan: 'kunjungan/bulan',
          is_active: true,
        },
        {
          iku_id: ikuMap.get('IKU-01')!,
          kode_iki: 'IKI-01-02',
          nama_iki: 'Jumlah Demonstrasi Teknologi Penangkapan',
          deskripsi:
            'Jumlah kegiatan demonstrasi teknik dan alat tangkap yang lebih produktif',
          target: '4.00',
          satuan: 'kegiatan/semester',
          is_active: true,
        },
        {
          iku_id: ikuMap.get('IKU-01')!,
          kode_iki: 'IKI-01-03',
          nama_iki: 'Jumlah Nelayan yang Menerima Rekomendasi Daerah Penangkapan',
          deskripsi:
            'Jumlah nelayan yang mendapatkan informasi fishing ground dari penyuluh',
          target: '50.00',
          satuan: 'nelayan',
          is_active: true,
        },

        // ── IKU-02: Produksi Budidaya ─────────────────────────────────────────
        {
          iku_id: ikuMap.get('IKU-02')!,
          kode_iki: 'IKI-02-01',
          nama_iki: 'Jumlah Kunjungan ke Kelompok Pembudidaya Ikan',
          deskripsi:
            'Frekuensi kunjungan penyuluh ke kelompok pembudidaya ikan per bulan',
          target: '10.00',
          satuan: 'kunjungan/bulan',
          is_active: true,
        },
        {
          iku_id: ikuMap.get('IKU-02')!,
          kode_iki: 'IKI-02-02',
          nama_iki: 'Jumlah Demonstrasi Teknik Budidaya Intensif',
          deskripsi:
            'Jumlah kegiatan demonstrasi cara budidaya ikan yang baik (CBIB)',
          target: '6.00',
          satuan: 'kegiatan/semester',
          is_active: true,
        },
        {
          iku_id: ikuMap.get('IKU-02')!,
          kode_iki: 'IKI-02-03',
          nama_iki: 'Jumlah Pendampingan Pembenihan',
          deskripsi:
            'Jumlah kegiatan pendampingan teknik pembenihan ikan kepada pembudidaya',
          target: '12.00',
          satuan: 'kegiatan/tahun',
          is_active: true,
        },
        {
          iku_id: ikuMap.get('IKU-02')!,
          kode_iki: 'IKI-02-04',
          nama_iki: 'Jumlah Rekomendasi Pakan dan Obat Ikan',
          deskripsi:
            'Jumlah rekomendasi penggunaan pakan, pupuk, dan obat ikan yang diberikan',
          target: '24.00',
          satuan: 'rekomendasi/tahun',
          is_active: true,
        },

        // ── IKU-03: Pendapatan ────────────────────────────────────────────────
        {
          iku_id: ikuMap.get('IKU-03')!,
          kode_iki: 'IKI-03-01',
          nama_iki: 'Jumlah Fasilitasi Akses Permodalan',
          deskripsi:
            'Jumlah pelaku usaha yang difasilitasi mengakses KUR atau bantuan modal',
          target: '15.00',
          satuan: 'pelaku usaha/tahun',
          is_active: true,
        },
        {
          iku_id: ikuMap.get('IKU-03')!,
          kode_iki: 'IKI-03-02',
          nama_iki: 'Jumlah Fasilitasi Akses Pasar',
          deskripsi:
            'Jumlah kegiatan temu usaha atau fasilitasi pemasaran hasil perikanan',
          target: '4.00',
          satuan: 'kegiatan/tahun',
          is_active: true,
        },
        {
          iku_id: ikuMap.get('IKU-03')!,
          kode_iki: 'IKI-03-03',
          nama_iki: 'Jumlah Pendampingan Diversifikasi Produk Olahan',
          deskripsi:
            'Jumlah pendampingan pengolahan hasil perikanan menjadi produk bernilai tambah',
          target: '6.00',
          satuan: 'kegiatan/tahun',
          is_active: true,
        },

        // ── IKU-04: Kelembagaan ───────────────────────────────────────────────
        {
          iku_id: ikuMap.get('IKU-04')!,
          kode_iki: 'IKI-04-01',
          nama_iki: 'Jumlah Kelompok Nelayan yang Dibentuk/Dikukuhkan',
          deskripsi:
            'Jumlah kelompok nelayan baru yang berhasil dibentuk dan dikukuhkan',
          target: '3.00',
          satuan: 'kelompok/tahun',
          is_active: true,
        },
        {
          iku_id: ikuMap.get('IKU-04')!,
          kode_iki: 'IKI-04-02',
          nama_iki: 'Jumlah Kelompok Nelayan Naik Kelas',
          deskripsi:
            'Jumlah kelompok nelayan yang kelas kelompoknya meningkat (Pemula→Madya→Utama)',
          target: '5.00',
          satuan: 'kelompok/tahun',
          is_active: true,
        },
        {
          iku_id: ikuMap.get('IKU-04')!,
          kode_iki: 'IKI-04-03',
          nama_iki: 'Jumlah Musyawarah Kelompok yang Difasilitasi',
          deskripsi:
            'Jumlah kegiatan musyawarah atau rapat kelompok yang difasilitasi penyuluh',
          target: '24.00',
          satuan: 'kegiatan/tahun',
          is_active: true,
        },

        // ── IKU-05: Adopsi Teknologi ──────────────────────────────────────────
        {
          iku_id: ikuMap.get('IKU-05')!,
          kode_iki: 'IKI-05-01',
          nama_iki: 'Jumlah Demonstrasi Penggunaan Alat Modern',
          deskripsi:
            'Jumlah demo penggunaan GPS, fish finder, atau teknologi modern lainnya',
          target: '6.00',
          satuan: 'kegiatan/tahun',
          is_active: true,
        },
        {
          iku_id: ikuMap.get('IKU-05')!,
          kode_iki: 'IKI-05-02',
          nama_iki: 'Jumlah Penyebaran Informasi Teknologi',
          deskripsi:
            'Jumlah leaflet, brosur, atau konten digital teknologi yang disebarkan',
          target: '100.00',
          satuan: 'materi/tahun',
          is_active: true,
        },
        {
          iku_id: ikuMap.get('IKU-05')!,
          kode_iki: 'IKI-05-03',
          nama_iki: 'Jumlah Nelayan yang Menggunakan Teknologi Baru',
          deskripsi:
            'Jumlah nelayan/pembudidaya yang terbukti mengadopsi teknologi baru setelah penyuluhan',
          target: '40.00',
          satuan: 'orang/tahun',
          is_active: true,
        },

        // ── IKU-06: SDM ───────────────────────────────────────────────────────
        {
          iku_id: ikuMap.get('IKU-06')!,
          kode_iki: 'IKI-06-01',
          nama_iki: 'Jumlah Peserta Pelatihan Teknis yang Difasilitasi',
          deskripsi:
            'Jumlah pelaku usaha perikanan yang mengikuti pelatihan teknis atas fasilitasi penyuluh',
          target: '80.00',
          satuan: 'orang/tahun',
          is_active: true,
        },
        {
          iku_id: ikuMap.get('IKU-06')!,
          kode_iki: 'IKI-06-02',
          nama_iki: 'Jumlah Peserta yang Mendapat Sertifikasi',
          deskripsi:
            'Jumlah pelaku usaha perikanan yang berhasil memperoleh sertifikat kompetensi',
          target: '30.00',
          satuan: 'orang/tahun',
          is_active: true,
        },
        {
          iku_id: ikuMap.get('IKU-06')!,
          kode_iki: 'IKI-06-03',
          nama_iki: 'Jumlah Magang/Studi Banding yang Difasilitasi',
          deskripsi:
            'Jumlah kegiatan magang atau studi banding ke lokasi percontohan yang difasilitasi',
          target: '2.00',
          satuan: 'kegiatan/tahun',
          is_active: true,
        },
      ];

      const insertedIki = await db.insert(mstIki).values(ikiData).returning();
      console.log(`✅ Seeded ${insertedIki.length} IKI\n`);
    }

    console.log('🎉 Seed mst_iku & mst_iki selesai!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding IKU/IKI:', error);
    process.exit(1);
  }
}

seedIkuIki();
