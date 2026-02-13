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
ALTER TABLE "penyuluh" ADD CONSTRAINT "penyuluh_pegawai_id_pegawai_id_fk" FOREIGN KEY ("pegawai_id") REFERENCES "public"."pegawai"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "penyuluh" ADD CONSTRAINT "penyuluh_upt_id_unit_pelaksanaan_teknis_id_fk" FOREIGN KEY ("upt_id") REFERENCES "public"."unit_pelaksanaan_teknis"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "penyuluh" ADD CONSTRAINT "penyuluh_province_id_provinces_id_fk" FOREIGN KEY ("province_id") REFERENCES "public"."provinces"("id") ON DELETE no action ON UPDATE no action;
