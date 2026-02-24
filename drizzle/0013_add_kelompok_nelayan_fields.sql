-- Add new date columns to mst_kelompok_nelayan
-- Remove unused columns and add date fields to match form

-- Drop columns that are not in the form (if they exist)
ALTER TABLE IF EXISTS "mst_kelompok_nelayan" 
DROP COLUMN IF EXISTS "tahun_berdiri",
DROP COLUMN IF EXISTS "status_kelompok",
DROP COLUMN IF EXISTS "luas_lahan",
DROP COLUMN IF EXISTS "koordinat_latitude",
DROP COLUMN IF EXISTS "koordinat_longitude",
DROP COLUMN IF EXISTS "gabungan_kelompok_id";

-- Add new columns if they don't exist
ALTER TABLE "mst_kelompok_nelayan" 
ADD COLUMN IF NOT EXISTS "jenis_kelamin_ketua" varchar(20),
ADD COLUMN IF NOT EXISTS "no_hp_penyuluh" varchar(20),
ADD COLUMN IF NOT EXISTS "status_penyuluh" varchar(50),
ADD COLUMN IF NOT EXISTS "kelas_kelompok" varchar(50),
ADD COLUMN IF NOT EXISTS "tanggal_pembentukan_kelompok" date,
ADD COLUMN IF NOT EXISTS "tanggal_peningkatan_kelas_kelompok" date,
ADD COLUMN IF NOT EXISTS "tanggal_pembentukan_gapokan" date,
ADD COLUMN IF NOT EXISTS "profil_kelompok_photo_url" varchar(500),
ADD COLUMN IF NOT EXISTS "profil_kelompok_photo_id" varchar(100);


