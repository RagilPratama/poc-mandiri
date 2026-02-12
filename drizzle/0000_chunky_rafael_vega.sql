CREATE TABLE "districts" (
	"id" bigint PRIMARY KEY NOT NULL,
	"regency_id" bigint NOT NULL,
	"name" text NOT NULL,
	"alt_name" text DEFAULT '' NOT NULL,
	"latitude" numeric DEFAULT '0' NOT NULL,
	"longitude" numeric DEFAULT '0' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "provinces" (
	"id" integer PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"alt_name" text,
	"latitude" numeric,
	"longitude" numeric
);
--> statement-breakpoint
CREATE TABLE "regencies" (
	"id" bigint PRIMARY KEY NOT NULL,
	"province_id" bigint NOT NULL,
	"name" text NOT NULL,
	"alt_name" text DEFAULT '' NOT NULL,
	"latitude" numeric DEFAULT '0' NOT NULL,
	"longitude" numeric DEFAULT '0' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "villages" (
	"id" bigint PRIMARY KEY NOT NULL,
	"district_id" bigint NOT NULL,
	"name" text NOT NULL,
	"alt_name" text DEFAULT '' NOT NULL,
	"latitude" double precision DEFAULT 0 NOT NULL,
	"longitude" double precision DEFAULT 0 NOT NULL
);
--> statement-breakpoint
ALTER TABLE "districts" ADD CONSTRAINT "districts_regency_id_regencies_id_fk" FOREIGN KEY ("regency_id") REFERENCES "public"."regencies"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "regencies" ADD CONSTRAINT "regencies_province_id_provinces_id_fk" FOREIGN KEY ("province_id") REFERENCES "public"."provinces"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "villages" ADD CONSTRAINT "villages_district_id_districts_id_fk" FOREIGN KEY ("district_id") REFERENCES "public"."districts"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
CREATE INDEX "idx_districts_regency_id" ON "districts" USING btree ("regency_id");--> statement-breakpoint
CREATE INDEX "idx_districts_name_lower" ON "districts" USING btree ("name");--> statement-breakpoint
CREATE INDEX "idx_districts_regency_name" ON "districts" USING btree ("regency_id","name");--> statement-breakpoint
CREATE INDEX "idx_provinces_name_lower" ON "provinces" USING btree ("name");--> statement-breakpoint
CREATE INDEX "idx_regencies_province_id" ON "regencies" USING btree ("province_id");--> statement-breakpoint
CREATE INDEX "idx_regencies_name_lower" ON "regencies" USING btree ("name");--> statement-breakpoint
CREATE INDEX "idx_regencies_province_name" ON "regencies" USING btree ("province_id","name");--> statement-breakpoint
CREATE INDEX "idx_villages_district_id" ON "villages" USING btree ("district_id");--> statement-breakpoint
CREATE INDEX "idx_villages_name_lower" ON "villages" USING btree ("name");--> statement-breakpoint
CREATE INDEX "idx_villages_district_name" ON "villages" USING btree ("district_id","name");