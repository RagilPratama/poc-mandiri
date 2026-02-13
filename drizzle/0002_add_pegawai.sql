CREATE TABLE "pegawai" (
	"id" serial PRIMARY KEY NOT NULL,
	"nip" varchar(50) NOT NULL,
	"nama" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"jabatan" varchar(255) NOT NULL,
	"organisasi_id" integer NOT NULL,
	"role_id" integer NOT NULL,
	"status_aktif" boolean DEFAULT true NOT NULL,
	"last_login" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "pegawai_nip_unique" UNIQUE("nip"),
	CONSTRAINT "pegawai_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "pegawai" ADD CONSTRAINT "pegawai_organisasi_id_organisasi_id_fk" FOREIGN KEY ("organisasi_id") REFERENCES "public"."organisasi"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "pegawai" ADD CONSTRAINT "pegawai_role_id_roles_id_fk" FOREIGN KEY ("role_id") REFERENCES "public"."roles"("id") ON DELETE no action ON UPDATE no action;
