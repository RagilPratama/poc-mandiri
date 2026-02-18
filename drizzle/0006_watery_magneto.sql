CREATE TABLE "absensi" (
	"id" serial PRIMARY KEY NOT NULL,
	"date" date NOT NULL,
	"nip" varchar(50) NOT NULL,
	"checkin" timestamp NOT NULL,
	"ci_latitude" numeric(10, 8) NOT NULL,
	"ci_longitude" numeric(11, 8) NOT NULL,
	"checkin_photo_url" varchar(500),
	"checkin_photo_id" varchar(255),
	"checkout" timestamp,
	"co_latitude" numeric(10, 8),
	"co_longitude" numeric(11, 8),
	"working_hours" numeric(5, 2),
	"status" varchar(50),
	"total_overtime" numeric(5, 2) DEFAULT '0',
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "roles" (
	"id" serial PRIMARY KEY NOT NULL,
	"level_role" varchar(100) NOT NULL,
	"nama_role" varchar(255) NOT NULL,
	"keterangan" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "organisasi" (
	"id" serial PRIMARY KEY NOT NULL,
	"level_organisasi" varchar(100) NOT NULL,
	"kode_organisasi" varchar(50) NOT NULL,
	"nama_organisasi" varchar(255) NOT NULL,
	"keterangan" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "pegawai" (
	"id" serial PRIMARY KEY NOT NULL,
	"nip" varchar(50) NOT NULL,
	"nama" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"jabatan" varchar(255) NOT NULL,
	"organisasi_id" integer NOT NULL,
	"role_id" integer NOT NULL,
	"status_aktif" boolean DEFAULT true NOT NULL,
	"last_login" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "pegawai_nip_unique" UNIQUE("nip"),
	CONSTRAINT "pegawai_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "kelompok_nelayan" (
	"id" serial PRIMARY KEY NOT NULL,
	"nib_kelompok" varchar(50) NOT NULL,
	"no_registrasi" varchar(50) NOT NULL,
	"nama_kelompok" varchar(255) NOT NULL,
	"nik_ketua" varchar(50) NOT NULL,
	"nama_ketua" varchar(255) NOT NULL,
	"upt_id" integer NOT NULL,
	"province_id" integer NOT NULL,
	"penyuluh_id" integer NOT NULL,
	"gabungan_kelompok_id" integer,
	"jumlah_anggota" integer DEFAULT 1 NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "kelompok_nelayan_nib_kelompok_unique" UNIQUE("nib_kelompok"),
	CONSTRAINT "kelompok_nelayan_no_registrasi_unique" UNIQUE("no_registrasi")
);
--> statement-breakpoint
CREATE TABLE "penyuluh" (
	"id" serial PRIMARY KEY NOT NULL,
	"pegawai_id" integer NOT NULL,
	"upt_id" integer NOT NULL,
	"province_id" integer NOT NULL,
	"jumlah_kelompok" integer DEFAULT 0 NOT NULL,
	"program_prioritas" varchar(255),
	"status_aktif" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "unit_pelaksanaan_teknis" DROP CONSTRAINT "unit_pelaksanaan_teknis_regencies_id_regencies_id_fk";
--> statement-breakpoint
ALTER TABLE "unit_pelaksanaan_teknis" ADD COLUMN "province_id" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "absensi" ADD CONSTRAINT "absensi_nip_pegawai_nip_fk" FOREIGN KEY ("nip") REFERENCES "public"."pegawai"("nip") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pegawai" ADD CONSTRAINT "pegawai_organisasi_id_organisasi_id_fk" FOREIGN KEY ("organisasi_id") REFERENCES "public"."organisasi"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pegawai" ADD CONSTRAINT "pegawai_role_id_roles_id_fk" FOREIGN KEY ("role_id") REFERENCES "public"."roles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "kelompok_nelayan" ADD CONSTRAINT "kelompok_nelayan_upt_id_unit_pelaksanaan_teknis_id_fk" FOREIGN KEY ("upt_id") REFERENCES "public"."unit_pelaksanaan_teknis"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "kelompok_nelayan" ADD CONSTRAINT "kelompok_nelayan_province_id_provinces_id_fk" FOREIGN KEY ("province_id") REFERENCES "public"."provinces"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "kelompok_nelayan" ADD CONSTRAINT "kelompok_nelayan_penyuluh_id_penyuluh_id_fk" FOREIGN KEY ("penyuluh_id") REFERENCES "public"."penyuluh"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "kelompok_nelayan" ADD CONSTRAINT "kelompok_nelayan_gabungan_kelompok_id_kelompok_nelayan_id_fk" FOREIGN KEY ("gabungan_kelompok_id") REFERENCES "public"."kelompok_nelayan"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "penyuluh" ADD CONSTRAINT "penyuluh_pegawai_id_pegawai_id_fk" FOREIGN KEY ("pegawai_id") REFERENCES "public"."pegawai"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "penyuluh" ADD CONSTRAINT "penyuluh_upt_id_unit_pelaksanaan_teknis_id_fk" FOREIGN KEY ("upt_id") REFERENCES "public"."unit_pelaksanaan_teknis"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "penyuluh" ADD CONSTRAINT "penyuluh_province_id_provinces_id_fk" FOREIGN KEY ("province_id") REFERENCES "public"."provinces"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "unit_pelaksanaan_teknis" ADD CONSTRAINT "unit_pelaksanaan_teknis_province_id_provinces_id_fk" FOREIGN KEY ("province_id") REFERENCES "public"."provinces"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "unit_pelaksanaan_teknis" DROP COLUMN "regencies_id";