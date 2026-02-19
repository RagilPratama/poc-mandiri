import { db, pool } from '../src/db';
import { sql } from 'drizzle-orm';

interface TableCount {
  table_name: string;
  row_count: number;
}

interface MigrationPhaseResult {
  phase: string;
  success: boolean;
  error?: string;
  duration: number;
}

/**
 * Database Restructure Migration Script
 * 
 * This script performs a comprehensive database restructure:
 * 1. Renames 11 existing tables to follow new naming convention
 * 2. Adds new columns to 4 existing tables
 * 3. Creates 11 new tables for fisheries operations
 * 
 * CRITICAL: This script includes pre/post verification and rollback procedures
 */

class DatabaseRestructureMigration {
  private preMigrationCounts: Map<string, number> = new Map();
  private results: MigrationPhaseResult[] = [];

  /**
   * Phase 0: Pre-Migration Verification
   * Records current state for verification after migration
   */
  async preVerification(): Promise<boolean> {
    console.log('\n========================================');
    console.log('PHASE 0: PRE-MIGRATION VERIFICATION');
    console.log('========================================\n');

    const startTime = Date.now();

    try {
      // Record row counts for all existing tables
      console.log('📊 Recording row counts for all tables...\n');
      
      const tables = [
        'provinces', 'regencies', 'districts', 'villages',
        'unit_pelaksanaan_teknis', 'organisasi', 'roles',
        'pegawai', 'penyuluh', 'kelompok_nelayan', 'absensi'
      ];

      for (const table of tables) {
        const result = await pool.query(`SELECT COUNT(*) as count FROM ${table}`);
        const count = parseInt(result.rows[0].count);
        this.preMigrationCounts.set(table, count);
        console.log(`   ${table}: ${count} rows`);
      }

      // Verify critical data counts
      console.log('\n🔍 Verifying critical data...\n');
      
      const provincesCount = this.preMigrationCounts.get('provinces') || 0;
      const regenciesCount = this.preMigrationCounts.get('regencies') || 0;
      const districtsCount = this.preMigrationCounts.get('districts') || 0;
      const villagesCount = this.preMigrationCounts.get('villages') || 0;
      const pegawaiCount = this.preMigrationCounts.get('pegawai') || 0;

      console.log(`   ✓ Provinces: ${provincesCount} (expected: 34 for Indonesia)`);
      console.log(`   ✓ Regencies: ${regenciesCount} (expected: ~514)`);
      console.log(`   ✓ Districts: ${districtsCount} (expected: ~7000+)`);
      console.log(`   ✓ Villages: ${villagesCount} (expected: ~80000+)`);
      console.log(`   ✓ Pegawai: ${pegawaiCount}`);

      // Check for orphaned records
      console.log('\n🔍 Checking for orphaned records...\n');

      const orphanedRegencies = await pool.query(`
        SELECT COUNT(*) as count FROM regencies r 
        LEFT JOIN provinces p ON r.province_id = p.id 
        WHERE p.id IS NULL
      `);
      console.log(`   Orphaned regencies: ${orphanedRegencies.rows[0].count}`);

      const orphanedDistricts = await pool.query(`
        SELECT COUNT(*) as count FROM districts d 
        LEFT JOIN regencies r ON d.regency_id = r.id 
        WHERE r.id IS NULL
      `);
      console.log(`   Orphaned districts: ${orphanedDistricts.rows[0].count}`);

      const orphanedPegawai = await pool.query(`
        SELECT COUNT(*) as count FROM pegawai p 
        LEFT JOIN organisasi o ON p.organisasi_id = o.id 
        WHERE o.id IS NULL
      `);
      console.log(`   Orphaned pegawai: ${orphanedPegawai.rows[0].count}`);

      const duration = Date.now() - startTime;
      this.results.push({ phase: 'Pre-Verification', success: true, duration });

      console.log(`\n✅ Pre-verification completed in ${duration}ms\n`);
      return true;

    } catch (error: any) {
      const duration = Date.now() - startTime;
      this.results.push({ phase: 'Pre-Verification', success: false, error: error.message, duration });
      console.error('❌ Pre-verification failed:', error.message);
      return false;
    }
  }

  /**
   * Phase 1: Rename Master Wilayah Tables
   * Renames provinces, regencies, districts, villages
   */
  async phase1RenameWilayah(): Promise<boolean> {
    console.log('\n========================================');
    console.log('PHASE 1: RENAME MASTER WILAYAH TABLES');
    console.log('========================================\n');

    const startTime = Date.now();

    try {
      await pool.query('BEGIN');

      console.log('1. Renaming villages → mst_desa...');
      await pool.query('ALTER TABLE villages RENAME TO mst_desa');
      await pool.query('ALTER INDEX IF EXISTS idx_villages_district_id RENAME TO idx_mst_desa_district_id');
      await pool.query('ALTER INDEX IF EXISTS idx_villages_name_lower RENAME TO idx_mst_desa_name_lower');
      await pool.query('ALTER INDEX IF EXISTS idx_villages_district_name RENAME TO idx_mst_desa_district_name');
      console.log('   ✓ villages renamed to mst_desa');

      console.log('\n2. Renaming districts → mst_kecamatan...');
      await pool.query('ALTER TABLE districts RENAME TO mst_kecamatan');
      await pool.query('ALTER INDEX IF EXISTS idx_districts_regency_id RENAME TO idx_mst_kecamatan_regency_id');
      await pool.query('ALTER INDEX IF EXISTS idx_districts_name_lower RENAME TO idx_mst_kecamatan_name_lower');
      await pool.query('ALTER INDEX IF EXISTS idx_districts_regency_name RENAME TO idx_mst_kecamatan_regency_name');
      console.log('   ✓ districts renamed to mst_kecamatan');

      console.log('\n3. Renaming regencies → mst_kabupaten...');
      await pool.query('ALTER TABLE regencies RENAME TO mst_kabupaten');
      await pool.query('ALTER INDEX IF EXISTS idx_regencies_province_id RENAME TO idx_mst_kabupaten_province_id');
      await pool.query('ALTER INDEX IF EXISTS idx_regencies_name_lower RENAME TO idx_mst_kabupaten_name_lower');
      await pool.query('ALTER INDEX IF EXISTS idx_regencies_province_name RENAME TO idx_mst_kabupaten_province_name');
      console.log('   ✓ regencies renamed to mst_kabupaten');

      console.log('\n4. Renaming provinces → mst_provinsi...');
      await pool.query('ALTER TABLE provinces RENAME TO mst_provinsi');
      await pool.query('ALTER INDEX IF EXISTS idx_provinces_name_lower RENAME TO idx_mst_provinsi_name_lower');
      console.log('   ✓ provinces renamed to mst_provinsi');

      // Verify counts
      console.log('\n📊 Verifying row counts...');
      const counts = await pool.query(`
        SELECT 'mst_provinsi' as table_name, COUNT(*) as count FROM mst_provinsi
        UNION ALL SELECT 'mst_kabupaten', COUNT(*) FROM mst_kabupaten
        UNION ALL SELECT 'mst_kecamatan', COUNT(*) FROM mst_kecamatan
        UNION ALL SELECT 'mst_desa', COUNT(*) FROM mst_desa
      `);

      for (const row of counts.rows) {
        const oldTableName = row.table_name.replace('mst_', '').replace('kabupaten', 'regencies')
          .replace('kecamatan', 'districts').replace('desa', 'villages').replace('provinsi', 'provinces');
        const expectedCount = this.preMigrationCounts.get(oldTableName) || 0;
        const actualCount = parseInt(row.count);
        
        if (actualCount === expectedCount) {
          console.log(`   ✓ ${row.table_name}: ${actualCount} rows (matches)`);
        } else {
          throw new Error(`Row count mismatch for ${row.table_name}: expected ${expectedCount}, got ${actualCount}`);
        }
      }

      await pool.query('COMMIT');

      const duration = Date.now() - startTime;
      this.results.push({ phase: 'Phase 1: Rename Wilayah', success: true, duration });
      console.log(`\n✅ Phase 1 completed in ${duration}ms\n`);
      return true;

    } catch (error: any) {
      await pool.query('ROLLBACK');
      const duration = Date.now() - startTime;
      this.results.push({ phase: 'Phase 1: Rename Wilayah', success: false, error: error.message, duration });
      console.error('❌ Phase 1 failed:', error.message);
      console.log('   Transaction rolled back');
      return false;
    }
  }

  /**
   * Phase 2: Rename Organization & Staff Tables
   */
  async phase2RenameOrgStaff(): Promise<boolean> {
    console.log('\n========================================');
    console.log('PHASE 2: RENAME ORGANIZATION & STAFF TABLES');
    console.log('========================================\n');

    const startTime = Date.now();

    try {
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

      // Verify counts
      console.log('\n📊 Verifying row counts...');
      const counts = await pool.query(`
        SELECT 'mst_role' as table_name, COUNT(*) as count FROM mst_role
        UNION ALL SELECT 'mst_organisasi', COUNT(*) FROM mst_organisasi
        UNION ALL SELECT 'mst_upt', COUNT(*) FROM mst_upt
        UNION ALL SELECT 'mst_pegawai', COUNT(*) FROM mst_pegawai
        UNION ALL SELECT 'mst_penyuluh', COUNT(*) FROM mst_penyuluh
        UNION ALL SELECT 'mst_kelompok_nelayan', COUNT(*) FROM mst_kelompok_nelayan
      `);

      for (const row of counts.rows) {
        let oldTableName = row.table_name.replace('mst_', '');
        if (oldTableName === 'upt') oldTableName = 'unit_pelaksanaan_teknis';
        if (oldTableName === 'role') oldTableName = 'roles';
        const expectedCount = this.preMigrationCounts.get(oldTableName) || 0;
        const actualCount = parseInt(row.count);
        
        if (actualCount === expectedCount) {
          console.log(`   ✓ ${row.table_name}: ${actualCount} rows (matches)`);
        } else {
          throw new Error(`Row count mismatch for ${row.table_name}: expected ${expectedCount}, got ${actualCount}`);
        }
      }

      await pool.query('COMMIT');

      const duration = Date.now() - startTime;
      this.results.push({ phase: 'Phase 2: Rename Org & Staff', success: true, duration });
      console.log(`\n✅ Phase 2 completed in ${duration}ms\n`);
      return true;

    } catch (error: any) {
      await pool.query('ROLLBACK');
      const duration = Date.now() - startTime;
      this.results.push({ phase: 'Phase 2: Rename Org & Staff', success: false, error: error.message, duration });
      console.error('❌ Phase 2 failed:', error.message);
      console.log('   Transaction rolled back');
      return false;
    }
  }

  /**
   * Phase 3: Rename Transaction Tables
   */
  async phase3RenameTransactions(): Promise<boolean> {
    console.log('\n========================================');
    console.log('PHASE 3: RENAME TRANSACTION TABLES');
    console.log('========================================\n');

    const startTime = Date.now();

    try {
      await pool.query('BEGIN');

      console.log('1. Renaming absensi → trx_absensi...');
      await pool.query('ALTER TABLE absensi RENAME TO trx_absensi');
      console.log('   ✓ absensi renamed to trx_absensi');

      // Verify count
      console.log('\n📊 Verifying row count...');
      const result = await pool.query('SELECT COUNT(*) as count FROM trx_absensi');
      const expectedCount = this.preMigrationCounts.get('absensi') || 0;
      const actualCount = parseInt(result.rows[0].count);
      
      if (actualCount === expectedCount) {
        console.log(`   ✓ trx_absensi: ${actualCount} rows (matches)`);
      } else {
        throw new Error(`Row count mismatch for trx_absensi: expected ${expectedCount}, got ${actualCount}`);
      }

      await pool.query('COMMIT');

      const duration = Date.now() - startTime;
      this.results.push({ phase: 'Phase 3: Rename Transactions', success: true, duration });
      console.log(`\n✅ Phase 3 completed in ${duration}ms\n`);
      return true;

    } catch (error: any) {
      await pool.query('ROLLBACK');
      const duration = Date.now() - startTime;
      this.results.push({ phase: 'Phase 3: Rename Transactions', success: false, error: error.message, duration });
      console.error('❌ Phase 3 failed:', error.message);
      console.log('   Transaction rolled back');
      return false;
    }
  }

  /**
   * Phase 4: Add New Columns to Existing Tables
   */
  async phase4AddColumns(): Promise<boolean> {
    console.log('\n========================================');
    console.log('PHASE 4: ADD NEW COLUMNS TO EXISTING TABLES');
    console.log('========================================\n');

    const startTime = Date.now();

    try {
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

      // Verify columns added
      console.log('\n📊 Verifying columns added...');
      const pegawaiCols = await pool.query(`
        SELECT column_name FROM information_schema.columns 
        WHERE table_name = 'mst_pegawai' 
          AND column_name IN ('no_hp', 'alamat', 'foto_url', 'tanggal_lahir', 'jenis_kelamin', 'pendidikan_terakhir', 'tanggal_bergabung')
      `);
      console.log(`   ✓ mst_pegawai: ${pegawaiCols.rows.length}/7 columns verified`);

      await pool.query('COMMIT');

      const duration = Date.now() - startTime;
      this.results.push({ phase: 'Phase 4: Add Columns', success: true, duration });
      console.log(`\n✅ Phase 4 completed in ${duration}ms\n`);
      return true;

    } catch (error: any) {
      await pool.query('ROLLBACK');
      const duration = Date.now() - startTime;
      this.results.push({ phase: 'Phase 4: Add Columns', success: false, error: error.message, duration });
      console.error('❌ Phase 4 failed:', error.message);
      console.log('   Transaction rolled back');
      return false;
    }
  }

  /**
   * Phase 5: Create New Master Tables (Part 1)
   */
  async phase5CreateMasterTables1(): Promise<boolean> {
    console.log('\n========================================');
    console.log('PHASE 5: CREATE NEW MASTER TABLES (PART 1)');
    console.log('========================================\n');

    const startTime = Date.now();

    try {
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

      const duration = Date.now() - startTime;
      this.results.push({ phase: 'Phase 5: Create Master Tables 1', success: true, duration });
      console.log(`\n✅ Phase 5 completed in ${duration}ms\n`);
      return true;

    } catch (error: any) {
      await pool.query('ROLLBACK');
      const duration = Date.now() - startTime;
      this.results.push({ phase: 'Phase 5: Create Master Tables 1', success: false, error: error.message, duration });
      console.error('❌ Phase 5 failed:', error.message);
      console.log('   Transaction rolled back');
      return false;
    }
  }

  /**
   * Phase 6: Create New Master Tables (Part 2)
   */
  async phase6CreateMasterTables2(): Promise<boolean> {
    console.log('\n========================================');
    console.log('PHASE 6: CREATE NEW MASTER TABLES (PART 2)');
    console.log('========================================\n');

    const startTime = Date.now();

    try {
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

      const duration = Date.now() - startTime;
      this.results.push({ phase: 'Phase 6: Create Master Tables 2', success: true, duration });
      console.log(`\n✅ Phase 6 completed in ${duration}ms\n`);
      return true;

    } catch (error: any) {
      await pool.query('ROLLBACK');
      const duration = Date.now() - startTime;
      this.results.push({ phase: 'Phase 6: Create Master Tables 2', success: false, error: error.message, duration });
      console.error('❌ Phase 6 failed:', error.message);
      console.log('   Transaction rolled back');
      return false;
    }
  }

  /**
   * Phase 7: Add Foreign Key for jenis_usaha_id
   */
  async phase7AddForeignKey(): Promise<boolean> {
    console.log('\n========================================');
    console.log('PHASE 7: ADD FOREIGN KEY FOR JENIS_USAHA_ID');
    console.log('========================================\n');

    const startTime = Date.now();

    try {
      await pool.query('BEGIN');

      console.log('Adding foreign key constraint to mst_kelompok_nelayan...');
      await pool.query(`
        ALTER TABLE mst_kelompok_nelayan
          ADD CONSTRAINT IF NOT EXISTS fk_kelompok_nelayan_jenis_usaha
          FOREIGN KEY (jenis_usaha_id) REFERENCES mst_jenis_usaha(id)
      `);
      console.log('   ✓ Foreign key constraint added');

      await pool.query('COMMIT');

      const duration = Date.now() - startTime;
      this.results.push({ phase: 'Phase 7: Add Foreign Key', success: true, duration });
      console.log(`\n✅ Phase 7 completed in ${duration}ms\n`);
      return true;

    } catch (error: any) {
      await pool.query('ROLLBACK');
      const duration = Date.now() - startTime;
      this.results.push({ phase: 'Phase 7: Add Foreign Key', success: false, error: error.message, duration });
      console.error('❌ Phase 7 failed:', error.message);
      console.log('   Transaction rolled back');
      return false;
    }
  }

  /**
   * Phase 8: Create New Transaction Tables
   */
  async phase8CreateTransactionTables(): Promise<boolean> {
    console.log('\n========================================');
    console.log('PHASE 8: CREATE NEW TRANSACTION TABLES');
    console.log('========================================\n');

    const startTime = Date.now();

    try {
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

      const duration = Date.now() - startTime;
      this.results.push({ phase: 'Phase 8: Create Transaction Tables (1/2)', success: true, duration });
      console.log(`\n✅ Phase 8 (Part 1) completed in ${duration}ms\n`);
      return true;

    } catch (error: any) {
      await pool.query('ROLLBACK');
      const duration = Date.now() - startTime;
      this.results.push({ phase: 'Phase 8: Create Transaction Tables (1/2)', success: false, error: error.message, duration });
      console.error('❌ Phase 8 (Part 1) failed:', error.message);
      console.log('   Transaction rolled back');
      return false;
    }
  }

  /**
   * Phase 9: Create Remaining Transaction Tables
   */
  async phase9CreateRemainingTransactionTables(): Promise<boolean> {
    console.log('\n========================================');
    console.log('PHASE 9: CREATE REMAINING TRANSACTION TABLES');
    console.log('========================================\n');

    const startTime = Date.now();

    try {
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

      const duration = Date.now() - startTime;
      this.results.push({ phase: 'Phase 9: Create Transaction Tables (2/2)', success: true, duration });
      console.log(`\n✅ Phase 9 (Part 2) completed in ${duration}ms\n`);
      return true;

    } catch (error: any) {
      await pool.query('ROLLBACK');
      const duration = Date.now() - startTime;
      this.results.push({ phase: 'Phase 9: Create Transaction Tables (2/2)', success: false, error: error.message, duration });
      console.error('❌ Phase 9 (Part 2) failed:', error.message);
      console.log('   Transaction rolled back');
      return false;
    }
  }

  /**
   * Post-Migration Verification
   */
  async postVerification(): Promise<boolean> {
    console.log('\n========================================');
    console.log('POST-MIGRATION VERIFICATION');
    console.log('========================================\n');

    const startTime = Date.now();

    try {
      console.log('📊 Verifying all renamed tables...\n');

      const renamedTables = [
        { old: 'provinces', new: 'mst_provinsi' },
        { old: 'regencies', new: 'mst_kabupaten' },
        { old: 'districts', new: 'mst_kecamatan' },
        { old: 'villages', new: 'mst_desa' },
        { old: 'unit_pelaksanaan_teknis', new: 'mst_upt' },
        { old: 'organisasi', new: 'mst_organisasi' },
        { old: 'roles', new: 'mst_role' },
        { old: 'pegawai', new: 'mst_pegawai' },
        { old: 'penyuluh', new: 'mst_penyuluh' },
        { old: 'kelompok_nelayan', new: 'mst_kelompok_nelayan' },
        { old: 'absensi', new: 'trx_absensi' }
      ];

      let allMatch = true;
      for (const { old, new: newName } of renamedTables) {
        const result = await pool.query(`SELECT COUNT(*) as count FROM ${newName}`);
        const actualCount = parseInt(result.rows[0].count);
        const expectedCount = this.preMigrationCounts.get(old) || 0;

        if (actualCount === expectedCount) {
          console.log(`   ✓ ${newName}: ${actualCount} rows (matches ${old})`);
        } else {
          console.log(`   ✗ ${newName}: ${actualCount} rows (expected ${expectedCount} from ${old})`);
          allMatch = false;
        }
      }

      console.log('\n🔍 Verifying new tables created...\n');
      const newTables = [
        'mst_jenis_usaha', 'mst_komoditas', 'mst_alat_tangkap', 'mst_kapal',
        'mst_jenis_bantuan', 'mst_jenis_pelatihan', 'mst_jenis_sertifikasi',
        'trx_produksi_hasil_tangkapan', 'trx_bantuan', 'trx_pelatihan', 'trx_sertifikasi'
      ];

      for (const table of newTables) {
        const result = await pool.query(`
          SELECT EXISTS (
            SELECT FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_name = '${table}'
          )
        `);
        if (result.rows[0].exists) {
          console.log(`   ✓ ${table} exists`);
        } else {
          console.log(`   ✗ ${table} does not exist`);
          allMatch = false;
        }
      }

      console.log('\n🔍 Verifying new columns added...\n');
      const pegawaiCols = await pool.query(`
        SELECT column_name FROM information_schema.columns 
        WHERE table_name = 'mst_pegawai' 
          AND column_name IN ('no_hp', 'alamat', 'foto_url', 'tanggal_lahir', 'jenis_kelamin', 'pendidikan_terakhir', 'tanggal_bergabung')
      `);
      console.log(`   ✓ mst_pegawai: ${pegawaiCols.rows.length}/7 new columns`);

      console.log('\n🔍 Checking for orphaned records...\n');
      const orphanedKabupaten = await pool.query(`
        SELECT COUNT(*) as count FROM mst_kabupaten k 
        LEFT JOIN mst_provinsi p ON k.province_id = p.id 
        WHERE p.id IS NULL
      `);
      console.log(`   Orphaned kabupaten: ${orphanedKabupaten.rows[0].count}`);

      const duration = Date.now() - startTime;
      this.results.push({ phase: 'Post-Verification', success: allMatch, duration });

      if (allMatch) {
        console.log(`\n✅ Post-verification completed successfully in ${duration}ms\n`);
      } else {
        console.log(`\n⚠️  Post-verification completed with warnings in ${duration}ms\n`);
      }

      return allMatch;

    } catch (error: any) {
      const duration = Date.now() - startTime;
      this.results.push({ phase: 'Post-Verification', success: false, error: error.message, duration });
      console.error('❌ Post-verification failed:', error.message);
      return false;
    }
  }

  /**
   * Print Migration Summary
   */
  printSummary() {
    console.log('\n========================================');
    console.log('MIGRATION SUMMARY');
    console.log('========================================\n');

    let totalDuration = 0;
    let successCount = 0;
    let failureCount = 0;

    for (const result of this.results) {
      totalDuration += result.duration;
      if (result.success) {
        successCount++;
        console.log(`✅ ${result.phase}: ${result.duration}ms`);
      } else {
        failureCount++;
        console.log(`❌ ${result.phase}: ${result.error}`);
      }
    }

    console.log(`\nTotal phases: ${this.results.length}`);
    console.log(`Successful: ${successCount}`);
    console.log(`Failed: ${failureCount}`);
    console.log(`Total duration: ${totalDuration}ms (${(totalDuration / 1000).toFixed(2)}s)`);

    if (failureCount === 0) {
      console.log('\n🎉 Migration completed successfully!');
      console.log('\nNext steps:');
      console.log('1. Update schema files in src/db/schema/');
      console.log('2. Run: bun run drizzle-kit generate');
      console.log('3. Update repositories, handlers, routes, and types');
      console.log('4. Test all API endpoints');
    } else {
      console.log('\n⚠️  Migration completed with errors!');
      console.log('Please review the errors above and fix before proceeding.');
    }
  }

  /**
   * Run all migration phases
   */
  async run() {
    console.log('\n╔════════════════════════════════════════╗');
    console.log('║  DATABASE RESTRUCTURE MIGRATION       ║');
    console.log('║  CRITICAL: Data Preservation Priority ║');
    console.log('╚════════════════════════════════════════╝\n');

    console.log('⚠️  WARNING: This will modify your database structure!');
    console.log('   Make sure you have a backup before proceeding.\n');

    try {
      // Phase 0: Pre-verification
      if (!await this.preVerification()) {
        throw new Error('Pre-verification failed');
      }

      // Phase 1: Rename master wilayah tables
      if (!await this.phase1RenameWilayah()) {
        throw new Error('Phase 1 failed');
      }

      // Phase 2: Rename organization & staff tables
      if (!await this.phase2RenameOrgStaff()) {
        throw new Error('Phase 2 failed');
      }

      // Phase 3: Rename transaction tables
      if (!await this.phase3RenameTransactions()) {
        throw new Error('Phase 3 failed');
      }

      // Phase 4: Add new columns
      if (!await this.phase4AddColumns()) {
        throw new Error('Phase 4 failed');
      }

      // Phase 5: Create new master tables (part 1)
      if (!await this.phase5CreateMasterTables1()) {
        throw new Error('Phase 5 failed');
      }

      // Phase 6: Create new master tables (part 2)
      if (!await this.phase6CreateMasterTables2()) {
        throw new Error('Phase 6 failed');
      }

      // Phase 7: Add foreign key
      if (!await this.phase7AddForeignKey()) {
        throw new Error('Phase 7 failed');
      }

      // Phase 8: Create transaction tables (part 1)
      if (!await this.phase8CreateTransactionTables()) {
        throw new Error('Phase 8 failed');
      }

      // Phase 9: Create transaction tables (part 2)
      if (!await this.phase9CreateRemainingTransactionTables()) {
        throw new Error('Phase 9 failed');
      }

      // Post-verification
      await this.postVerification();

      // Print summary
      this.printSummary();

    } catch (error: any) {
      console.error('\n❌ Migration aborted:', error.message);
      this.printSummary();
      process.exit(1);
    } finally {
      await pool.end();
    }
  }
}

// Run migration
const migration = new DatabaseRestructureMigration();
migration.run()
  .then(() => {
    console.log('\n✅ Migration script completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Migration script failed:', error);
    process.exit(1);
  });
