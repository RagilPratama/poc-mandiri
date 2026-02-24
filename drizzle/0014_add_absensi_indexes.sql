-- Add indexes to optimize absensi queries

-- Index for date range queries (date_from, date_to filters)
CREATE INDEX IF NOT EXISTS "idx_trx_absensi_date" ON "trx_absensi" ("date" DESC);

-- Index for NIP lookups (search by NIP)
CREATE INDEX IF NOT EXISTS "idx_trx_absensi_nip" ON "trx_absensi" ("nip");

-- Composite index for date + nip (check if already checked in)
CREATE INDEX IF NOT EXISTS "idx_trx_absensi_date_nip" ON "trx_absensi" ("date", "nip");

-- Index for checkin timestamp (orderBy checkin)
CREATE INDEX IF NOT EXISTS "idx_trx_absensi_checkin" ON "trx_absensi" ("checkin" DESC);

-- Composite index for common queries (date + checkin for sorting)
CREATE INDEX IF NOT EXISTS "idx_trx_absensi_date_checkin" ON "trx_absensi" ("date" DESC, "checkin" DESC);

-- Index for status queries
CREATE INDEX IF NOT EXISTS "idx_trx_absensi_status" ON "trx_absensi" ("status");
