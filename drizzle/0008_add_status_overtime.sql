-- Add status and total_overtime columns
ALTER TABLE "absensi" ADD COLUMN "status" varchar(50);
ALTER TABLE "absensi" ADD COLUMN "total_overtime" integer DEFAULT 0;

-- Update existing records to set default status
UPDATE "absensi" 
SET "status" = CASE 
  WHEN "checkout" IS NULL THEN 'Masih Berjalan'
  WHEN "working_hours"::numeric < 8 THEN 'Pulang Sebelum Waktunya'
  WHEN "working_hours"::numeric >= 8 AND "working_hours"::numeric <= 8.25 THEN 'Tepat Waktu'
  WHEN "working_hours"::numeric > 8.25 THEN 'Lembur'
  ELSE 'Masih Berjalan'
END
WHERE "status" IS NULL;

-- Update overtime for existing lembur records
UPDATE "absensi"
SET "total_overtime" = ROUND(("working_hours"::numeric - 8.25) * 60)::integer
WHERE "status" = 'Lembur' AND "working_hours"::numeric > 8.25;
