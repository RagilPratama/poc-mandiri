-- Rollback: Revert kelompok_nelayan penyuluh FK
ALTER TABLE "kelompok_nelayan" DROP CONSTRAINT IF EXISTS "kelompok_nelayan_penyuluh_id_penyuluh_id_fk";
ALTER TABLE "kelompok_nelayan" ADD CONSTRAINT "kelompok_nelayan_penyuluh_id_pegawai_id_fk" FOREIGN KEY ("penyuluh_id") REFERENCES "public"."pegawai"("id") ON DELETE no action ON UPDATE no action;

-- Rollback: Revert UPT province to regencies
ALTER TABLE "unit_pelaksanaan_teknis" DROP CONSTRAINT IF EXISTS "unit_pelaksanaan_teknis_province_id_provinces_id_fk";
ALTER TABLE "unit_pelaksanaan_teknis" RENAME COLUMN "province_id" TO "regencies_id";
ALTER TABLE "unit_pelaksanaan_teknis" ADD CONSTRAINT "unit_pelaksanaan_teknis_regencies_id_regencies_id_fk" FOREIGN KEY ("regencies_id") REFERENCES "public"."regencies"("id") ON DELETE no action ON UPDATE no action;
