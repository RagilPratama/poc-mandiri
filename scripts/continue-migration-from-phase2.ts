import { pool } from '../src/db';

/**
 * Continue Database Restructure Migration from Phase 2
 * 
 * Phase 1 is already complete (wilayah tables renamed)
 * This script continues from Phase 2 onwards
 */

async function continueMigration() {
  console.log('\n╔════════════════════════════════════════╗');
  console.log('║  CONTINUE DATABASE MIGRATION          ║');
  console.log('║  Starting from Phase 2                ║');
  console.log('╚════════════════════════════════════════╝\n');

  try {
    // Phase 2: Rename Organization & Staff Tables
    console.log('========================================');
    console.log('PHASE 2: RENAME ORGANIZATION & STAFF TABLES');
    console.log('========================================\n');

    await pool.query('BEGIN');

    console.log('1. Renaming roles → mst_role...');
    await pool.query('ALTER TABLE roles RENAME TO mst_role');
    console.log('   ✓ roles renamed to mst_role');

    console.log('\n2. Renaming organisasi → mst_organisasi...');
    await pool.query('ALTER TABLE organisasi RENAME TO mst_organisasi');
    console.log('   ✓ organisasi renamed to mst_organisasi');

    console.log('\n3. Renaming unit_pelaksanaan_teknis → mst_upt...');
    await pool.query('ALTER TABLE unit_pelaksanaan_teknis RENAME TO mst_upt');
    console.log('   ✓ unit_pelaksanaan_teknis renamed to mst_upt');

    console.log('\n4. Renaming pegawai → mst_pegawai...');
    await pool.query('ALTER TABLE pegawai RENAME TO mst_pegawai');
    console.log('   ✓ pegawai renamed to mst_pegawai');

    console.log('\n5. Renaming penyuluh → mst_penyuluh...');
    await pool.query('ALTER TABLE penyuluh RENAME TO mst_penyuluh');
    console.log('   ✓ penyuluh renamed to mst_penyuluh');

    console.log('\n6. Renaming kelompok_nelayan → mst_kelompok_nelayan...');
    await pool.query('ALTER TABLE kelompok_nelayan RENAME TO mst_kelompok_nelayan');
    console.log('   ✓ kelompok_nelayan renamed to mst_kelompok_nelayan');

    await pool.query('COMMIT');
    console.log('\n✅ Phase 2 completed\n');

    // Phase 3: Rename Transaction Tables
    console.log('========================================');
    console.log('PHASE 3: RENAME TRANSACTION TABLES');
    console.log('========================================\n');

    await pool.query('BEGIN');

    console.log('1. Renaming absensi → trx_absensi...');
    await pool.query('ALTER TABLE absensi RENAME TO trx_absensi');
    console.log('   ✓ absensi renamed to trx_absensi');

    await pool.query('COMMIT');
    console.log('\n✅ Phase 3 completed\n');

    // Phase 4: Add New Columns
    console.log('========================================');
    console.log('PHASE 4: ADD NEW COLUMNS TO EXISTING TABLES');
    console.log('========================================\n');

    await pool.query('BEGIN');

    console.log('1. Adding columns to mst_pegawai...');
    await pool.query(`
      ALTER TABLE mst_pegawai
        ADD COLUMN IF NOT EXISTS no_hp varchar(20),
        ADD COLUMN IF NOT EXISTS alamat text,
        ADD COLUMN IF NOT EXISTS foto_url varchar(500),
        ADD COLUMN IF NOT EXISTS tanggal_lahir date,
        ADD COLUMN IF NOT EXISTS jenis_kelamin varchar(1),
        ADD COLUMN IF NOT EXISTS pendidikan_terakhir varchar(100),
        ADD COLUMN IF NOT EXISTS tanggal_bergabung date
    `);
    console.log('   ✓ Added 7 columns to mst_pegawai');

    console.log('\n2. Adding columns to mst_penyuluh...');
    await pool.query(`
      ALTER TABLE mst_penyuluh
        ADD COLUMN IF NOT EXISTS wilayah_binaan text,
        ADD COLUMN IF NOT EXISTS spesialisasi varchar(255)
    `);
    console.log('   ✓ Added 2 columns to mst_penyuluh');

    console.log('\n3. Adding columns to mst_kelompok_nelayan...');
    await pool.query(`
      ALTER TABLE mst_kelompok_nelayan
        ADD COLUMN IF NOT EXISTS jenis_usaha_id integer,
        ADD COLUMN IF NOT EXISTS alamat text,
        ADD COLUMN IF NOT EXISTS no_hp_ketua varchar(20),
        ADD COLUMN IF NOT EXISTS tahun_berdiri integer,
        ADD COLUMN IF NOT EXISTS status_kelompok varchar(50),
        ADD COLUMN IF NOT EXISTS luas_lahan decimal(10,2),
        ADD COLUMN IF NOT EXISTS koordinat_latitude decimal(10,8),
        ADD COLUMN IF NOT EXISTS koordinat_longitude decimal(11,8)
    `);
    console.log('   ✓ Added 8 columns to mst_kelompok_nelayan');

    console.log('\n4. Adding columns to trx_absensi...');
    await pool.query(`
      ALTER TABLE trx_absensi
        ADD COLUMN IF NOT EXISTS keterangan text,
        ADD COLUMN IF NOT EXISTS foto_checkout_url varchar(500),
        ADD COLUMN IF NOT EXISTS foto_checkout_id varchar(255)
    `);
    console.log('   ✓ Added 3 columns to trx_absensi');

    await pool.query('COMMIT');
    console.log('\n✅ Phase 4 completed\n');

    // Phase 5: Create New Master Tables (Part 1)
    console.log('========================================');
    console.log('PHASE 5: CREATE NEW MASTER TABLES (PART 1)');
    console.log('========================================\n');

    await pool.query('BEGIN');

    console.log('1. Creating mst_jenis_usaha...');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS mst_jenis_usaha (
        id SERIAL PRIMARY KEY,
        kode_jenis_usaha VARCHAR(20) NOT NULL UNIQUE,
        nama_jenis_usaha VARCHAR(255) NOT NULL,
        kategori VARCHAR(100) NOT NULL,
        keterangan TEXT,
        status_aktif BOOLEAN NOT NULL DEFAULT true,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);
    await pool.query('CREATE INDEX IF NOT EXISTS idx_mst_jenis_usaha_kategori ON mst_jenis_usaha(kategori)');
    console.log('   ✓ mst_jenis_usaha created');

    console.log('\n2. Creating mst_komoditas...');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS mst_komoditas (
        id SERIAL PRIMARY KEY,
        kode_komoditas VARCHAR(20) NOT NULL UNIQUE,
        nama_komoditas VARCHAR(255) NOT NULL,
        nama_ilmiah VARCHAR(255),
        kategori VARCHAR(100) NOT NULL,
        satuan VARCHAR(50) NOT NULL,
        harga_pasar_rata DECIMAL(15,2),
        keterangan TEXT,
        status_aktif BOOLEAN NOT NULL DEFAULT true,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);
    await pool.query('CREATE INDEX IF NOT EXISTS idx_mst_komoditas_kategori ON mst_komoditas(kategori)');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_mst_komoditas_nama ON mst_komoditas(nama_komoditas)');
    console.log('   ✓ mst_komoditas created');

    console.log('\n3. Creating mst_alat_tangkap...');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS mst_alat_tangkap (
        id SERIAL PRIMARY KEY,
        kode_alat_tangkap VARCHAR(20) NOT NULL UNIQUE,
        nama_alat_tangkap VARCHAR(255) NOT NULL,
        jenis VARCHAR(100) NOT NULL,
        target_komoditas TEXT,
        keterangan TEXT,
        status_aktif BOOLEAN NOT NULL DEFAULT true,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);
    await pool.query('CREATE INDEX IF NOT EXISTS idx_mst_alat_tangkap_jenis ON mst_alat_tangkap(jenis)');
    console.log('   ✓ mst_alat_tangkap created');

    await pool.query('COMMIT');
    console.log('\n✅ Phase 5 completed\n');

    // Phase 6: Create New Master Tables (Part 2)
    console.log('========================================');
    console.log('PHASE 6: CREATE NEW MASTER TABLES (PART 2)');
    console.log('========================================\n');

    await pool.query('BEGIN');

    console.log('1. Creating mst_kapal...');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS mst_kapal (
        id SERIAL PRIMARY KEY,
        kelompok_nelayan_id INTEGER NOT NULL REFERENCES mst_kelompok_nelayan(id),
        no_registrasi_kapal VARCHAR(50) NOT NULL UNIQUE,
        nama_kapal VARCHAR(255) NOT NULL,
        jenis_kapal VARCHAR(100) NOT NULL,
        ukuran_gt DECIMAL(10,2),
        ukuran_panjang DECIMAL(10,2),
        ukuran_lebar DECIMAL(10,2),
        mesin_pk DECIMAL(10,2),
        tahun_pembuatan INTEGER,
        pelabuhan_pangkalan VARCHAR(255),
        status_kapal VARCHAR(50) NOT NULL DEFAULT 'Aktif',
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);
    await pool.query('CREATE INDEX IF NOT EXISTS idx_mst_kapal_kelompok ON mst_kapal(kelompok_nelayan_id)');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_mst_kapal_status ON mst_kapal(status_kapal)');
    console.log('   ✓ mst_kapal created');

    console.log('\n2. Creating mst_jenis_bantuan...');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS mst_jenis_bantuan (
        id SERIAL PRIMARY KEY,
        kode_jenis_bantuan VARCHAR(20) NOT NULL UNIQUE,
        nama_jenis_bantuan VARCHAR(255) NOT NULL,
        kategori VARCHAR(100) NOT NULL,
        satuan VARCHAR(50),
        nilai_estimasi DECIMAL(15,2),
        keterangan TEXT,
        status_aktif BOOLEAN NOT NULL DEFAULT true,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);
    await pool.query('CREATE INDEX IF NOT EXISTS idx_mst_jenis_bantuan_kategori ON mst_jenis_bantuan(kategori)');
    console.log('   ✓ mst_jenis_bantuan created');

    console.log('\n3. Creating mst_jenis_pelatihan...');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS mst_jenis_pelatihan (
        id SERIAL PRIMARY KEY,
        kode_jenis_pelatihan VARCHAR(20) NOT NULL UNIQUE,
        nama_jenis_pelatihan VARCHAR(255) NOT NULL,
        kategori VARCHAR(100) NOT NULL,
        durasi_hari INTEGER,
        target_peserta VARCHAR(100),
        keterangan TEXT,
        status_aktif BOOLEAN NOT NULL DEFAULT true,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);
    await pool.query('CREATE INDEX IF NOT EXISTS idx_mst_jenis_pelatihan_kategori ON mst_jenis_pelatihan(kategori)');
    console.log('   ✓ mst_jenis_pelatihan created');

    console.log('\n4. Creating mst_jenis_sertifikasi...');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS mst_jenis_sertifikasi (
        id SERIAL PRIMARY KEY,
        kode_jenis_sertifikasi VARCHAR(20) NOT NULL UNIQUE,
        nama_jenis_sertifikasi VARCHAR(255) NOT NULL,
        kategori VARCHAR(100) NOT NULL,
        lembaga_penerbit VARCHAR(255) NOT NULL,
        masa_berlaku_tahun INTEGER,
        persyaratan TEXT,
        keterangan TEXT,
        status_aktif BOOLEAN NOT NULL DEFAULT true,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);
    await pool.query('CREATE INDEX IF NOT EXISTS idx_mst_jenis_sertifikasi_kategori ON mst_jenis_sertifikasi(kategori)');
    console.log('   ✓ mst_jenis_sertifikasi created');

    await pool.query('COMMIT');
    console.log('\n✅ Phase 6 completed\n');

    // Phase 7: Add Foreign Key
    console.log('========================================');
    console.log('PHASE 7: ADD FOREIGN KEY FOR JENIS_USAHA_ID');
    console.log('========================================\n');

    await pool.query('BEGIN');

    console.log('Adding foreign key constraint to mst_kelompok_nelayan...');
    await pool.query(`
      DO $$ 
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_constraint 
          WHERE conname = 'fk_kelompok_nelayan_jenis_usaha'
        ) THEN
          ALTER TABLE mst_kelompok_nelayan
            ADD CONSTRAINT fk_kelompok_nelayan_jenis_usaha
            FOREIGN KEY (jenis_usaha_id) REFERENCES mst_jenis_usaha(id);
        END IF;
      END $$;
    `);
    console.log('   ✓ Foreign key constraint added');

    await pool.query('COMMIT');
    console.log('\n✅ Phase 7 completed\n');

    // Phase 8: Create Transaction Tables (Part 1)
    console.log('========================================');
    console.log('PHASE 8: CREATE TRANSACTION TABLES (PART 1)');
    console.log('========================================\n');

    await pool.query('BEGIN');

    console.log('1. Creating trx_produksi_hasil_tangkapan...');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS trx_produksi_hasil_tangkapan (
        id SERIAL PRIMARY KEY,
        kelompok_nelayan_id INTEGER NOT NULL REFERENCES mst_kelompok_nelayan(id),
        kapal_id INTEGER REFERENCES mst_kapal(id),
        tanggal_produksi DATE NOT NULL,
        komoditas_id INTEGER NOT NULL REFERENCES mst_komoditas(id),
        alat_tangkap_id INTEGER REFERENCES mst_alat_tangkap(id),
        jumlah_produksi DECIMAL(15,2) NOT NULL,
        satuan VARCHAR(50) NOT NULL,
        harga_jual DECIMAL(15,2),
        total_nilai DECIMAL(15,2),
        lokasi_penangkapan VARCHAR(255),
        koordinat_latitude DECIMAL(10,8),
        koordinat_longitude DECIMAL(11,8),
        keterangan TEXT,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);
    await pool.query('CREATE INDEX IF NOT EXISTS idx_trx_produksi_kelompok ON trx_produksi_hasil_tangkapan(kelompok_nelayan_id)');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_trx_produksi_tanggal ON trx_produksi_hasil_tangkapan(tanggal_produksi)');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_trx_produksi_komoditas ON trx_produksi_hasil_tangkapan(komoditas_id)');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_trx_produksi_kelompok_tanggal ON trx_produksi_hasil_tangkapan(kelompok_nelayan_id, tanggal_produksi)');
    console.log('   ✓ trx_produksi_hasil_tangkapan created');

    console.log('\n2. Creating trx_bantuan...');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS trx_bantuan (
        id SERIAL PRIMARY KEY,
        no_bantuan VARCHAR(50) NOT NULL UNIQUE,
        jenis_bantuan_id INTEGER NOT NULL REFERENCES mst_jenis_bantuan(id),
        kelompok_nelayan_id INTEGER NOT NULL REFERENCES mst_kelompok_nelayan(id),
        penyuluh_id INTEGER NOT NULL REFERENCES mst_penyuluh(id),
        tanggal_penyaluran DATE NOT NULL,
        jumlah DECIMAL(15,2) NOT NULL,
        satuan VARCHAR(50) NOT NULL,
        nilai_bantuan DECIMAL(15,2) NOT NULL,
        sumber_dana VARCHAR(255),
        tahun_anggaran INTEGER NOT NULL,
        status_penyaluran VARCHAR(50) NOT NULL DEFAULT 'Direncanakan',
        tanggal_selesai DATE,
        bukti_penyaluran_url VARCHAR(500),
        keterangan TEXT,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);
    await pool.query('CREATE INDEX IF NOT EXISTS idx_trx_bantuan_kelompok ON trx_bantuan(kelompok_nelayan_id)');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_trx_bantuan_tanggal ON trx_bantuan(tanggal_penyaluran)');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_trx_bantuan_status ON trx_bantuan(status_penyaluran)');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_trx_bantuan_tahun_status ON trx_bantuan(tahun_anggaran, status_penyaluran)');
    console.log('   ✓ trx_bantuan created');

    await pool.query('COMMIT');
    console.log('\n✅ Phase 8 completed\n');

    // Phase 9: Create Transaction Tables (Part 2)
    console.log('========================================');
    console.log('PHASE 9: CREATE TRANSACTION TABLES (PART 2)');
    console.log('========================================\n');

    await pool.query('BEGIN');

    console.log('1. Creating trx_pelatihan...');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS trx_pelatihan (
        id SERIAL PRIMARY KEY,
        no_pelatihan VARCHAR(50) NOT NULL UNIQUE,
        jenis_pelatihan_id INTEGER NOT NULL REFERENCES mst_jenis_pelatihan(id),
        nama_pelatihan VARCHAR(255) NOT NULL,
        penyelenggara VARCHAR(255) NOT NULL,
        penyuluh_id INTEGER REFERENCES mst_penyuluh(id),
        tanggal_mulai DATE NOT NULL,
        tanggal_selesai DATE NOT NULL,
        lokasi VARCHAR(255) NOT NULL,
        jumlah_peserta INTEGER NOT NULL DEFAULT 0,
        target_peserta INTEGER NOT NULL,
        peserta_kelompok TEXT,
        narasumber VARCHAR(255),
        biaya DECIMAL(15,2),
        sumber_dana VARCHAR(255),
        status_pelatihan VARCHAR(50) NOT NULL DEFAULT 'Direncanakan',
        hasil_evaluasi TEXT,
        dokumentasi_url VARCHAR(500),
        keterangan TEXT,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);
    await pool.query('CREATE INDEX IF NOT EXISTS idx_trx_pelatihan_tanggal ON trx_pelatihan(tanggal_mulai)');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_trx_pelatihan_status ON trx_pelatihan(status_pelatihan)');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_trx_pelatihan_tanggal_status ON trx_pelatihan(tanggal_mulai, status_pelatihan)');
    console.log('   ✓ trx_pelatihan created');

    console.log('\n2. Creating trx_sertifikasi...');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS trx_sertifikasi (
        id SERIAL PRIMARY KEY,
        no_sertifikat VARCHAR(50) NOT NULL UNIQUE,
        jenis_sertifikasi_id INTEGER NOT NULL REFERENCES mst_jenis_sertifikasi(id),
        kelompok_nelayan_id INTEGER NOT NULL REFERENCES mst_kelompok_nelayan(id),
        penyuluh_id INTEGER REFERENCES mst_penyuluh(id),
        tanggal_terbit DATE NOT NULL,
        tanggal_berlaku DATE NOT NULL,
        tanggal_kadaluarsa DATE NOT NULL,
        lembaga_penerbit VARCHAR(255) NOT NULL,
        status_sertifikat VARCHAR(50) NOT NULL DEFAULT 'Aktif',
        file_sertifikat_url VARCHAR(500),
        keterangan TEXT,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);
    await pool.query('CREATE INDEX IF NOT EXISTS idx_trx_sertifikasi_kelompok ON trx_sertifikasi(kelompok_nelayan_id)');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_trx_sertifikasi_kadaluarsa ON trx_sertifikasi(tanggal_kadaluarsa)');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_trx_sertifikasi_status ON trx_sertifikasi(status_sertifikat)');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_trx_sertifikasi_kelompok_status ON trx_sertifikasi(kelompok_nelayan_id, status_sertifikat)');
    console.log('   ✓ trx_sertifikasi created');

    await pool.query('COMMIT');
    console.log('\n✅ Phase 9 completed\n');

    // Final Verification
    console.log('========================================');
    console.log('FINAL VERIFICATION');
    console.log('========================================\n');

    const tables = await pool.query(`
      SELECT table_name FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `);

    console.log('📊 All tables in database:\n');
    for (const row of tables.rows) {
      console.log(`   - ${row.table_name}`);
    }

    console.log('\n🎉 Migration completed successfully!');
    console.log('\nNext steps:');
    console.log('1. Update schema files in src/db/schema/');
    console.log('2. Run: bun run drizzle-kit generate');
    console.log('3. Update repositories, handlers, routes, and types');
    console.log('4. Test all API endpoints');

  } catch (error: any) {
    console.error('\n❌ Migration failed:', error.message);
    console.error(error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

continueMigration();
