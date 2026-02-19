-- Remove foto checkout columns from trx_absensi
ALTER TABLE "trx_absensi" DROP COLUMN IF EXISTS "foto_checkout_url";
ALTER TABLE "trx_absensi" DROP COLUMN IF EXISTS "foto_checkout_id";
