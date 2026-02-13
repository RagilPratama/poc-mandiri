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
ALTER TABLE "kelompok_nelayan" ADD CONSTRAINT "kelompok_nelayan_upt_id_unit_pelaksanaan_teknis_id_fk" FOREIGN KEY ("upt_id") REFERENCES "public"."unit_pelaksanaan_teknis"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "kelompok_nelayan" ADD CONSTRAINT "kelompok_nelayan_province_id_provinces_id_fk" FOREIGN KEY ("province_id") REFERENCES "public"."provinces"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "kelompok_nelayan" ADD CONSTRAINT "kelompok_nelayan_penyuluh_id_pegawai_id_fk" FOREIGN KEY ("penyuluh_id") REFERENCES "public"."pegawai"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "kelompok_nelayan" ADD CONSTRAINT "kelompok_nelayan_gabungan_kelompok_id_kelompok_nelayan_id_fk" FOREIGN KEY ("gabungan_kelompok_id") REFERENCES "public"."kelompok_nelayan"("id") ON DELETE no action ON UPDATE no action;
