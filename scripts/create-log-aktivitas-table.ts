import { pool } from '../src/db';

async function createLogAktivitasTable() {
  const client = await pool.connect();
  
  try {
    console.log('🔨 Creating trx_log_aktivitas table...');
    
    // Check if table already exists
    const checkTable = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'trx_log_aktivitas'
      );
    `);
    
    if (checkTable.rows[0].exists) {
      console.log('⏭️  Table trx_log_aktivitas already exists');
      return;
    }
    
    // Create table
    await client.query(`
      CREATE TABLE "trx_log_aktivitas" (
        "id" serial PRIMARY KEY NOT NULL,
        "pegawai_id" integer,
        "user_id" varchar(255),
        "username" varchar(255),
        "email" varchar(255),
        "aktivitas" varchar(255) NOT NULL,
        "modul" varchar(100) NOT NULL,
        "deskripsi" text NOT NULL,
        "method" varchar(10),
        "endpoint" varchar(500),
        "ip_address" varchar(50),
        "user_agent" text,
        "data_lama" jsonb,
        "data_baru" jsonb,
        "status" varchar(20) DEFAULT 'SUCCESS' NOT NULL,
        "error_message" text,
        "created_at" timestamp DEFAULT now()
      );
    `);
    
    console.log('✅ Table created');
    
    // Add foreign key
    await client.query(`
      ALTER TABLE "trx_log_aktivitas" 
      ADD CONSTRAINT "trx_log_aktivitas_pegawai_id_mst_pegawai_id_fk" 
      FOREIGN KEY ("pegawai_id") REFERENCES "public"."mst_pegawai"("id") 
      ON DELETE no action ON UPDATE no action;
    `);
    
    console.log('✅ Foreign key added');
    
    // Create indexes
    await client.query(`CREATE INDEX "idx_trx_log_aktivitas_pegawai" ON "trx_log_aktivitas" USING btree ("pegawai_id");`);
    await client.query(`CREATE INDEX "idx_trx_log_aktivitas_user" ON "trx_log_aktivitas" USING btree ("user_id");`);
    await client.query(`CREATE INDEX "idx_trx_log_aktivitas_modul" ON "trx_log_aktivitas" USING btree ("modul");`);
    await client.query(`CREATE INDEX "idx_trx_log_aktivitas_aktivitas" ON "trx_log_aktivitas" USING btree ("aktivitas");`);
    await client.query(`CREATE INDEX "idx_trx_log_aktivitas_created" ON "trx_log_aktivitas" USING btree ("created_at");`);
    await client.query(`CREATE INDEX "idx_trx_log_aktivitas_modul_aktivitas" ON "trx_log_aktivitas" USING btree ("modul","aktivitas");`);
    
    console.log('✅ Indexes created');
    console.log('🎉 trx_log_aktivitas table created successfully!');
    
  } catch (error) {
    console.error('❌ Error creating table:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

createLogAktivitasTable();
