-- Change total_overtime from integer (minutes) to decimal (hours)
ALTER TABLE "absensi" ALTER COLUMN "total_overtime" TYPE numeric(5, 2) USING (total_overtime::numeric / 60);
ALTER TABLE "absensi" ALTER COLUMN "total_overtime" SET DEFAULT 0;
