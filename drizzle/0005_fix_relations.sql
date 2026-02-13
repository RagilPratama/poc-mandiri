-- Fix 1: Change UPT from regencies_id to province_id
-- Step 1: Drop FK constraint
ALTER TABLE "unit_pelaksanaan_teknis" DROP CONSTRAINT "unit_pelaksanaan_teknis_regencies_id_regencies_id_fk";

-- Step 2: Update data - map regency_id to province_id
UPDATE unit_pelaksanaan_teknis upt
SET regencies_id = r.province_id
FROM regencies r
WHERE upt.regencies_id = r.id;

-- Step 3: Rename column
ALTER TABLE "unit_pelaksanaan_teknis" RENAME COLUMN "regencies_id" TO "province_id";

-- Step 4: Add new FK constraint
ALTER TABLE "unit_pelaksanaan_teknis" ADD CONSTRAINT "unit_pelaksanaan_teknis_province_id_provinces_id_fk" FOREIGN KEY ("province_id") REFERENCES "public"."provinces"("id") ON DELETE no action ON UPDATE no action;

-- Fix 2: Change kelompok_nelayan penyuluh_id from pegawai to penyuluh
-- Step 1: Drop FK constraint
ALTER TABLE "kelompok_nelayan" DROP CONSTRAINT "kelompok_nelayan_penyuluh_id_pegawai_id_fk";

-- Step 2: Update data - map pegawai_id to penyuluh_id
UPDATE kelompok_nelayan kn
SET penyuluh_id = p.id
FROM penyuluh p
WHERE kn.penyuluh_id = p.pegawai_id;

-- Step 3: Add new FK constraint
ALTER TABLE "kelompok_nelayan" ADD CONSTRAINT "kelompok_nelayan_penyuluh_id_penyuluh_id_fk" FOREIGN KEY ("penyuluh_id") REFERENCES "public"."penyuluh"("id") ON DELETE no action ON UPDATE no action;
