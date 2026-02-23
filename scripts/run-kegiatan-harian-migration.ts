import { db } from '../src/db';
import { sql } from 'drizzle-orm';

async function runMigration() {
  try {
    console.log('Creating trx_kegiatan_harian table...');
    
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS "trx_kegiatan_harian" (
        "id" serial PRIMARY KEY NOT NULL,
        "pegawai_id" integer NOT NULL,
        "kelompok_nelayan_id" integer,
        "tanggal" date NOT NULL,
        "lokasi_kegiatan" varchar(255),
        "iki" varchar(255),
        "rencana_kerja" text,
        "detail_keterangan" text,
        "foto_kegiatan" json,
        "is_active" boolean DEFAULT true NOT NULL,
        "created_at" timestamp DEFAULT now(),
        "updated_at" timestamp DEFAULT now()
      )
    `);

    console.log('Adding foreign keys...');
    await db.execute(sql`
      ALTER TABLE "trx_kegiatan_harian" 
      ADD CONSTRAINT "trx_kegiatan_harian_pegawai_id_mst_pegawai_id_fk" 
      FOREIGN KEY ("pegawai_id") REFERENCES "mst_pegawai"("id") 
      ON DELETE no action ON UPDATE no action
    `);

    await db.execute(sql`
      ALTER TABLE "trx_kegiatan_harian" 
      ADD CONSTRAINT "trx_kegiatan_harian_kelompok_nelayan_id_mst_kelompok_nelayan_id_fk" 
      FOREIGN KEY ("kelompok_nelayan_id") REFERENCES "mst_kelompok_nelayan"("id") 
      ON DELETE no action ON UPDATE no action
    `);

    console.log('Creating indexes...');
    await db.execute(sql`CREATE INDEX IF NOT EXISTS "idx_trx_kegiatan_harian_pegawai_id" ON "trx_kegiatan_harian" ("pegawai_id")`);
    await db.execute(sql`CREATE INDEX IF NOT EXISTS "idx_trx_kegiatan_harian_kelompok_id" ON "trx_kegiatan_harian" ("kelompok_nelayan_id")`);
    await db.execute(sql`CREATE INDEX IF NOT EXISTS "idx_trx_kegiatan_harian_tanggal" ON "trx_kegiatan_harian" ("tanggal")`);

    console.log('Creating trx_kegiatan_prioritas table...');
    
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS "trx_kegiatan_prioritas" (
        "id" serial PRIMARY KEY NOT NULL,
        "pegawai_id" integer NOT NULL,
        "kelompok_nelayan_id" integer,
        "tanggal" date NOT NULL,
        "lokasi_kegiatan" varchar(255),
        "iki" varchar(255),
        "rencana_kerja" text,
        "detail_keterangan" text,
        "foto_kegiatan" json,
        "is_active" boolean DEFAULT true NOT NULL,
        "created_at" timestamp DEFAULT now(),
        "updated_at" timestamp DEFAULT now()
      )
    `);

    console.log('Adding foreign keys for prioritas...');
    await db.execute(sql`
      ALTER TABLE "trx_kegiatan_prioritas" 
      ADD CONSTRAINT "trx_kegiatan_prioritas_pegawai_id_mst_pegawai_id_fk" 
      FOREIGN KEY ("pegawai_id") REFERENCES "mst_pegawai"("id") 
      ON DELETE no action ON UPDATE no action
    `);

    await db.execute(sql`
      ALTER TABLE "trx_kegiatan_prioritas" 
      ADD CONSTRAINT "trx_kegiatan_prioritas_kelompok_nelayan_id_mst_kelompok_nelayan_id_fk" 
      FOREIGN KEY ("kelompok_nelayan_id") REFERENCES "mst_kelompok_nelayan"("id") 
      ON DELETE no action ON UPDATE no action
    `);

    console.log('Creating indexes for prioritas...');
    await db.execute(sql`CREATE INDEX IF NOT EXISTS "idx_trx_kegiatan_prioritas_pegawai_id" ON "trx_kegiatan_prioritas" ("pegawai_id")`);
    await db.execute(sql`CREATE INDEX IF NOT EXISTS "idx_trx_kegiatan_prioritas_kelompok_id" ON "trx_kegiatan_prioritas" ("kelompok_nelayan_id")`);
    await db.execute(sql`CREATE INDEX IF NOT EXISTS "idx_trx_kegiatan_prioritas_tanggal" ON "trx_kegiatan_prioritas" ("tanggal")`);

    console.log('✅ Migration completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

runMigration();
