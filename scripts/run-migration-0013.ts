import { Pool } from 'pg';
import { readFileSync } from 'fs';
import { join } from 'path';

// Try to load .env file if it exists
try {
  const envPath = join(__dirname, '../.env');
  const envContent = readFileSync(envPath, 'utf-8');
  envContent.split('\n').forEach(line => {
    const match = line.match(/^([^=:#]+)=(.*)$/);
    if (match) {
      const key = match[1].trim();
      const value = match[2].trim();
      if (!process.env[key]) {
        process.env[key] = value;
      }
    }
  });
} catch (e) {
  // .env file not found, skip
}

// Read DATABASE_URL from environment
const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.error('❌ DATABASE_URL not found in environment variables');
  console.log('Please set DATABASE_URL in your environment or .env file');
  process.exit(1);
}

// Create pool connection
const pool = new Pool({
  connectionString: databaseUrl,
});

async function runMigration() {
  const client = await pool.connect();
  
  try {
    console.log('🔄 Starting migration: 0013_add_kelompok_nelayan_fields.sql');
    
    // Read migration file
    const migrationSQL = readFileSync(
      join(__dirname, '../drizzle/0013_add_kelompok_nelayan_fields.sql'),
      'utf-8'
    );
    
    // Begin transaction
    await client.query('BEGIN');
    
    // Execute migration
    await client.query(migrationSQL);
    
    // Commit transaction
    await client.query('COMMIT');
    
    console.log('✅ Migration completed successfully!');
    console.log('');
    console.log('📋 Changes applied:');
    console.log('  ✓ Dropped unused columns (tahun_berdiri, status_kelompok, etc.)');
    console.log('  ✓ Added jenis_kelamin_ketua');
    console.log('  ✓ Added no_hp_penyuluh');
    console.log('  ✓ Added status_penyuluh');
    console.log('  ✓ Added kelas_kelompok');
    console.log('  ✓ Added tanggal_pembentukan_kelompok');
    console.log('  ✓ Added tanggal_peningkatan_kelas_kelompok');
    console.log('  ✓ Added tanggal_pembentukan_gapokan');
    console.log('  ✓ Added profil_kelompok_photo_url');
    console.log('  ✓ Added profil_kelompok_photo_id');
    
  } catch (error) {
    // Rollback on error
    await client.query('ROLLBACK');
    console.error('❌ Migration failed!');
    console.error('Error:', error);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

// Run migration
runMigration();
