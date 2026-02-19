CREATE TABLE "trx_log_aktivitas" (
	"id" serial PRIMARY KEY NOT NULL,
	"pegawai_id" integer,
	"user_id" varchar(255),
	"username" varchar(255),
	"email" varchar(255),
	"aktivitas" varchar(255) NOT NULL,
	"modul" varchar(100) NOT NULL,
	"deskripsi" text NOT NULL,
	"method" varchar(10),
	"endpoint" varchar(500),
	"ip_address" varchar(50),
	"user_agent" text,
	"data_lama" jsonb,
	"data_baru" jsonb,
	"status" varchar(20) DEFAULT 'SUCCESS' NOT NULL,
	"error_message" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "trx_log_aktivitas" ADD CONSTRAINT "trx_log_aktivitas_pegawai_id_mst_pegawai_id_fk" FOREIGN KEY ("pegawai_id") REFERENCES "public"."mst_pegawai"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_trx_log_aktivitas_pegawai" ON "trx_log_aktivitas" USING btree ("pegawai_id");--> statement-breakpoint
CREATE INDEX "idx_trx_log_aktivitas_user" ON "trx_log_aktivitas" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_trx_log_aktivitas_modul" ON "trx_log_aktivitas" USING btree ("modul");--> statement-breakpoint
CREATE INDEX "idx_trx_log_aktivitas_aktivitas" ON "trx_log_aktivitas" USING btree ("aktivitas");--> statement-breakpoint
CREATE INDEX "idx_trx_log_aktivitas_created" ON "trx_log_aktivitas" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "idx_trx_log_aktivitas_modul_aktivitas" ON "trx_log_aktivitas" USING btree ("modul","aktivitas");