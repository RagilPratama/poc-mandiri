CREATE TABLE "unit_pelaksanaan_teknis" (
	"id" serial PRIMARY KEY NOT NULL,
	"nama_organisasi" varchar(255) NOT NULL,
	"pimpinan" varchar(255) NOT NULL,
	"regencies_id" integer NOT NULL
);
--> statement-breakpoint
ALTER TABLE "unit_pelaksanaan_teknis" ADD CONSTRAINT "unit_pelaksanaan_teknis_regencies_id_regencies_id_fk" FOREIGN KEY ("regencies_id") REFERENCES "public"."regencies"("id") ON DELETE no action ON UPDATE no action;