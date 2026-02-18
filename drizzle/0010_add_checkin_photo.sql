-- Add checkin photo columns to absensi table
ALTER TABLE "absensi" ADD COLUMN "checkin_photo_url" varchar(500);
ALTER TABLE "absensi" ADD COLUMN "checkin_photo_id" varchar(255);
