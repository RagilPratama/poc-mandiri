-- Create mst_iku table (new)
CREATE TABLE "mst_iku" (
	"id" serial PRIMARY KEY NOT NULL,
	"kode_iku" varchar(50) NOT NULL,
	"nama_iku" varchar(255) NOT NULL,
	"deskripsi" text,
	"tahun" integer NOT NULL,
	"target" numeric(15, 2),
	"satuan" varchar(50),
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "mst_iku_kode_iku_unique" UNIQUE("kode_iku")
);
--> statement-breakpoint
-- Create mst_iki table (new, FK to mst_iku)
CREATE TABLE "mst_iki" (
	"id" serial PRIMARY KEY NOT NULL,
	"iku_id" integer NOT NULL,
	"kode_iki" varchar(50) NOT NULL,
	"nama_iki" varchar(255) NOT NULL,
	"deskripsi" text,
	"target" numeric(15, 2),
	"satuan" varchar(50),
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "mst_iki_kode_iki_unique" UNIQUE("kode_iki")
);
--> statement-breakpoint
ALTER TABLE "mst_iki" ADD CONSTRAINT "mst_iki_iku_id_mst_iku_id_fk" FOREIGN KEY ("iku_id") REFERENCES "public"."mst_iku"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
CREATE INDEX "idx_mst_iku_tahun" ON "mst_iku" USING btree ("tahun");
--> statement-breakpoint
CREATE INDEX "idx_mst_iku_is_active" ON "mst_iku" USING btree ("is_active");
--> statement-breakpoint
CREATE INDEX "idx_mst_iki_iku_id" ON "mst_iki" USING btree ("iku_id");
--> statement-breakpoint
CREATE INDEX "idx_mst_iki_is_active" ON "mst_iki" USING btree ("is_active");
--> statement-breakpoint

-- Handle trx_kegiatan_harian: buat baru atau migrasi kolom iki -> iki_id
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'trx_kegiatan_harian'
  ) THEN
    -- Tabel belum ada, buat baru dengan iki_id
    CREATE TABLE "trx_kegiatan_harian" (
      "id" serial PRIMARY KEY NOT NULL,
      "pegawai_id" integer NOT NULL,
      "kelompok_nelayan_id" integer,
      "tanggal" date NOT NULL,
      "lokasi_kegiatan" varchar(255),
      "iki_id" integer,
      "rencana_kerja" text,
      "detail_keterangan" text,
      "foto_kegiatan" json,
      "is_active" boolean DEFAULT true NOT NULL,
      "created_at" timestamp DEFAULT now(),
      "updated_at" timestamp DEFAULT now()
    );
    ALTER TABLE "trx_kegiatan_harian" ADD CONSTRAINT "trx_kegiatan_harian_pegawai_id_mst_pegawai_id_fk" FOREIGN KEY ("pegawai_id") REFERENCES "public"."mst_pegawai"("id") ON DELETE no action ON UPDATE no action;
    ALTER TABLE "trx_kegiatan_harian" ADD CONSTRAINT "trx_kegiatan_harian_kelompok_nelayan_id_mst_kelompok_nelayan_id_fk" FOREIGN KEY ("kelompok_nelayan_id") REFERENCES "public"."mst_kelompok_nelayan"("id") ON DELETE no action ON UPDATE no action;
    ALTER TABLE "trx_kegiatan_harian" ADD CONSTRAINT "trx_kegiatan_harian_iki_id_mst_iki_id_fk" FOREIGN KEY ("iki_id") REFERENCES "public"."mst_iki"("id") ON DELETE no action ON UPDATE no action;
    CREATE INDEX "idx_trx_kegiatan_harian_pegawai_id" ON "trx_kegiatan_harian" USING btree ("pegawai_id");
    CREATE INDEX "idx_trx_kegiatan_harian_kelompok_id" ON "trx_kegiatan_harian" USING btree ("kelompok_nelayan_id");
    CREATE INDEX "idx_trx_kegiatan_harian_tanggal" ON "trx_kegiatan_harian" USING btree ("tanggal");
  ELSE
    -- Tabel sudah ada, migrasi kolom iki -> iki_id
    IF EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_name = 'trx_kegiatan_harian' AND column_name = 'iki'
    ) THEN
      ALTER TABLE "trx_kegiatan_harian" DROP COLUMN "iki";
    END IF;
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_name = 'trx_kegiatan_harian' AND column_name = 'iki_id'
    ) THEN
      ALTER TABLE "trx_kegiatan_harian" ADD COLUMN "iki_id" integer;
      ALTER TABLE "trx_kegiatan_harian" ADD CONSTRAINT "trx_kegiatan_harian_iki_id_mst_iki_id_fk" FOREIGN KEY ("iki_id") REFERENCES "public"."mst_iki"("id") ON DELETE no action ON UPDATE no action;
    END IF;
  END IF;
END $$;
--> statement-breakpoint

-- Handle trx_kegiatan_prioritas: buat baru atau migrasi kolom iki -> iki_id
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'trx_kegiatan_prioritas'
  ) THEN
    -- Tabel belum ada, buat baru dengan iki_id
    CREATE TABLE "trx_kegiatan_prioritas" (
      "id" serial PRIMARY KEY NOT NULL,
      "pegawai_id" integer NOT NULL,
      "kelompok_nelayan_id" integer,
      "tanggal" date NOT NULL,
      "lokasi_kegiatan" varchar(255),
      "iki_id" integer,
      "rencana_kerja" text,
      "detail_keterangan" text,
      "foto_kegiatan" json,
      "is_active" boolean DEFAULT true NOT NULL,
      "created_at" timestamp DEFAULT now(),
      "updated_at" timestamp DEFAULT now()
    );
    ALTER TABLE "trx_kegiatan_prioritas" ADD CONSTRAINT "trx_kegiatan_prioritas_pegawai_id_mst_pegawai_id_fk" FOREIGN KEY ("pegawai_id") REFERENCES "public"."mst_pegawai"("id") ON DELETE no action ON UPDATE no action;
    ALTER TABLE "trx_kegiatan_prioritas" ADD CONSTRAINT "trx_kegiatan_prioritas_kelompok_nelayan_id_mst_kelompok_nelayan_id_fk" FOREIGN KEY ("kelompok_nelayan_id") REFERENCES "public"."mst_kelompok_nelayan"("id") ON DELETE no action ON UPDATE no action;
    ALTER TABLE "trx_kegiatan_prioritas" ADD CONSTRAINT "trx_kegiatan_prioritas_iki_id_mst_iki_id_fk" FOREIGN KEY ("iki_id") REFERENCES "public"."mst_iki"("id") ON DELETE no action ON UPDATE no action;
    CREATE INDEX "idx_trx_kegiatan_prioritas_pegawai_id" ON "trx_kegiatan_prioritas" USING btree ("pegawai_id");
    CREATE INDEX "idx_trx_kegiatan_prioritas_kelompok_id" ON "trx_kegiatan_prioritas" USING btree ("kelompok_nelayan_id");
    CREATE INDEX "idx_trx_kegiatan_prioritas_tanggal" ON "trx_kegiatan_prioritas" USING btree ("tanggal");
  ELSE
    -- Tabel sudah ada, migrasi kolom iki -> iki_id
    IF EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_name = 'trx_kegiatan_prioritas' AND column_name = 'iki'
    ) THEN
      ALTER TABLE "trx_kegiatan_prioritas" DROP COLUMN "iki";
    END IF;
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_name = 'trx_kegiatan_prioritas' AND column_name = 'iki_id'
    ) THEN
      ALTER TABLE "trx_kegiatan_prioritas" ADD COLUMN "iki_id" integer;
      ALTER TABLE "trx_kegiatan_prioritas" ADD CONSTRAINT "trx_kegiatan_prioritas_iki_id_mst_iki_id_fk" FOREIGN KEY ("iki_id") REFERENCES "public"."mst_iki"("id") ON DELETE no action ON UPDATE no action;
    END IF;
  END IF;
END $$;
