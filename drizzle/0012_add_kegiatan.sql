-- Create trx_kegiatan table
CREATE TABLE IF NOT EXISTS "trx_kegiatan" (
	"id" serial PRIMARY KEY NOT NULL,
	"pegawai_id" integer NOT NULL,
	"tanggal" date NOT NULL,
	"judul_kegiatan" varchar(255) NOT NULL,
	"deskripsi" text,
	"kategori" varchar(100) NOT NULL,
	"status" varchar(50) DEFAULT 'Belum Selesai' NOT NULL,
	"prioritas" varchar(50),
	"lokasi" varchar(255),
	"catatan" text,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);

-- Add foreign key
ALTER TABLE "trx_kegiatan" ADD CONSTRAINT "trx_kegiatan_pegawai_id_mst_pegawai_id_fk" FOREIGN KEY ("pegawai_id") REFERENCES "mst_pegawai"("id") ON DELETE no action ON UPDATE no action;

-- Create indexes
CREATE INDEX IF NOT EXISTS "idx_trx_kegiatan_pegawai_id" ON "trx_kegiatan" ("pegawai_id");
CREATE INDEX IF NOT EXISTS "idx_trx_kegiatan_tanggal" ON "trx_kegiatan" ("tanggal");
CREATE INDEX IF NOT EXISTS "idx_trx_kegiatan_kategori" ON "trx_kegiatan" ("kategori");
CREATE INDEX IF NOT EXISTS "idx_trx_kegiatan_status" ON "trx_kegiatan" ("status");
