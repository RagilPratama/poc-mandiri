-- Create absensi table
CREATE TABLE IF NOT EXISTS "absensi" (
	"id" serial PRIMARY KEY NOT NULL,
	"date" date NOT NULL,
	"nip" varchar(50) NOT NULL,
	"checkin" timestamp NOT NULL,
	"checkout" timestamp,
	"working_hours" numeric(5, 2),
	"latitude" numeric(10, 8) NOT NULL,
	"longitude" numeric(11, 8) NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);

-- Add foreign key constraint
ALTER TABLE "absensi" ADD CONSTRAINT "absensi_nip_pegawai_nip_fk" FOREIGN KEY ("nip") REFERENCES "public"."pegawai"("nip") ON DELETE no action ON UPDATE no action;

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS "idx_absensi_nip" ON "absensi" ("nip");
CREATE INDEX IF NOT EXISTS "idx_absensi_date" ON "absensi" ("date");
CREATE INDEX IF NOT EXISTS "idx_absensi_nip_date" ON "absensi" ("nip", "date");
