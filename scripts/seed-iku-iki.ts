import { db } from '../src/db';
import { mstIku, mstIki } from '../src/db/schema';
import { sql } from 'drizzle-orm';

async function seedIkuIki() {
  try {
    console.log('🚀 Starting IKU and IKI seeding...');

    // Drop existing tables if they exist
    await db.execute(sql`DROP TABLE IF EXISTS mst_iki CASCADE;`);
    await db.execute(sql`DROP TABLE IF EXISTS mst_iku CASCADE;`);

    console.log('✅ Dropped existing tables');

    // Create tables
    await db.execute(sql`
      CREATE TABLE mst_iku (
        id SERIAL PRIMARY KEY,
        tahun INTEGER NOT NULL,
        level VARCHAR(100) NOT NULL,
        satuan VARCHAR(100),
        target VARCHAR(100),
        deskripsi TEXT,
        is_active BOOLEAN NOT NULL DEFAULT true,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);

    await db.execute(sql`
      CREATE TABLE mst_iki (
        id SERIAL PRIMARY KEY,
        kategori_iki VARCHAR(50) NOT NULL,
        detail_iki TEXT NOT NULL,
        is_active BOOLEAN NOT NULL DEFAULT true,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);

    console.log('✅ Tables created successfully');

    await db.execute(sql`
      CREATE INDEX idx_mst_iki_kategori ON mst_iki(kategori_iki);
    `);

    // Seed IKU data
    const ikuData = [
      {
        tahun: 2024,
        level: 'Level 1',
        satuan: 'Persen',
        target: '85',
        deskripsi: 'Indikator Kinerja Utama Level 1 untuk tahun 2024',
      },
      {
        tahun: 2024,
        level: 'Level 2',
        satuan: 'Persen',
        target: '90',
        deskripsi: 'Indikator Kinerja Utama Level 2 untuk tahun 2024',
      },
      {
        tahun: 2025,
        level: 'Level 1',
        satuan: 'Persen',
        target: '88',
        deskripsi: 'Indikator Kinerja Utama Level 1 untuk tahun 2025',
      },
    ];

    for (const iku of ikuData) {
      await db.insert(mstIku).values(iku);
    }

    console.log(`✅ Seeded ${ikuData.length} IKU records`);

    // Seed IKI data
    const ikiData = [
      {
        kategori_iki: 'IKI 1',
        detail_iki: 'Pelaksanaan penyuluhan perikanan kepada kelompok nelayan',
      },
      {
        kategori_iki: 'IKI 2',
        detail_iki: 'Monitoring dan evaluasi kegiatan kelompok nelayan',
      },
      {
        kategori_iki: 'IKI 3',
        detail_iki: 'Pendampingan teknis budidaya perikanan',
      },
      {
        kategori_iki: 'IKI 4',
        detail_iki: 'Pelatihan dan sertifikasi nelayan',
      },
      {
        kategori_iki: 'IKI 5',
        detail_iki: 'Pengembangan usaha perikanan berkelanjutan',
      },
    ];

    for (const iki of ikiData) {
      await db.insert(mstIki).values(iki);
    }

    console.log(`✅ Seeded ${ikiData.length} IKI records`);

    // Update kegiatan tables to add iki_id column if not exists
    await db.execute(sql`
      DO $$ 
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_name = 'trx_kegiatan_harian' AND column_name = 'iki_id'
        ) THEN
          ALTER TABLE trx_kegiatan_harian ADD COLUMN iki_id INTEGER REFERENCES mst_iki(id);
        END IF;
      END $$;
    `);

    await db.execute(sql`
      DO $$ 
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_name = 'trx_kegiatan_prioritas' AND column_name = 'iki_id'
        ) THEN
          ALTER TABLE trx_kegiatan_prioritas ADD COLUMN iki_id INTEGER REFERENCES mst_iki(id);
        END IF;
      END $$;
    `);

    // Drop old iki column if exists
    await db.execute(sql`
      DO $$ 
      BEGIN
        IF EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_name = 'trx_kegiatan_harian' AND column_name = 'iki' AND data_type = 'character varying'
        ) THEN
          ALTER TABLE trx_kegiatan_harian DROP COLUMN iki;
        END IF;
      END $$;
    `);

    await db.execute(sql`
      DO $$ 
      BEGIN
        IF EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_name = 'trx_kegiatan_prioritas' AND column_name = 'iki' AND data_type = 'character varying'
        ) THEN
          ALTER TABLE trx_kegiatan_prioritas DROP COLUMN iki;
        END IF;
      END $$;
    `);

    console.log('✅ Updated kegiatan tables with iki_id foreign key');

    console.log('🎉 IKU and IKI seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding IKU and IKI:', error);
    process.exit(1);
  }
}

seedIkuIki();
