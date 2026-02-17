-- Rename existing columns to check-in specific
ALTER TABLE "absensi" RENAME COLUMN "latitude" TO "ci_latitude";
ALTER TABLE "absensi" RENAME COLUMN "longitude" TO "ci_longitude";

-- Add check-out coordinates
ALTER TABLE "absensi" ADD COLUMN "co_latitude" numeric(10, 8);
ALTER TABLE "absensi" ADD COLUMN "co_longitude" numeric(11, 8);

-- Update indexes
DROP INDEX IF EXISTS "idx_absensi_nip";
DROP INDEX IF EXISTS "idx_absensi_date";
DROP INDEX IF EXISTS "idx_absensi_nip_date";

CREATE INDEX IF NOT EXISTS "idx_absensi_nip" ON "absensi" ("nip");
CREATE INDEX IF NOT EXISTS "idx_absensi_date" ON "absensi" ("date");
CREATE INDEX IF NOT EXISTS "idx_absensi_nip_date" ON "absensi" ("nip", "date");
