CREATE TABLE "mst_provinsi" (
	"id" integer PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"alt_name" text,
	"latitude" numeric,
	"longitude" numeric
);
--> statement-breakpoint
CREATE TABLE "mst_kabupaten" (
	"id" bigint PRIMARY KEY NOT NULL,
	"province_id" bigint NOT NULL,
	"name" text NOT NULL,
	"alt_name" text DEFAULT '' NOT NULL,
	"latitude" numeric DEFAULT '0' NOT NULL,
	"longitude" numeric DEFAULT '0' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "mst_kecamatan" (
	"id" bigint PRIMARY KEY NOT NULL,
	"regency_id" bigint NOT NULL,
	"name" text NOT NULL,
	"alt_name" text DEFAULT '' NOT NULL,
	"latitude" numeric DEFAULT '0' NOT NULL,
	"longitude" numeric DEFAULT '0' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "mst_desa" (
	"id" bigint PRIMARY KEY NOT NULL,
	"district_id" bigint NOT NULL,
	"name" text NOT NULL,
	"alt_name" text DEFAULT '' NOT NULL,
	"latitude" double precision DEFAULT 0 NOT NULL,
	"longitude" double precision DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "mst_upt" (
	"id" serial PRIMARY KEY NOT NULL,
	"nama_organisasi" varchar(255) NOT NULL,
	"pimpinan" varchar(255) NOT NULL,
	"province_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "mst_role" (
	"id" serial PRIMARY KEY NOT NULL,
	"level_role" varchar(100) NOT NULL,
	"nama_role" varchar(255) NOT NULL,
	"keterangan" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "mst_organisasi" (
	"id" serial PRIMARY KEY NOT NULL,
	"level_organisasi" varchar(100) NOT NULL,
	"kode_organisasi" varchar(50) NOT NULL,
	"nama_organisasi" varchar(255) NOT NULL,
	"keterangan" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "mst_pegawai" (
	"id" serial PRIMARY KEY NOT NULL,
	"nip" varchar(50) NOT NULL,
	"nama" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"jabatan" varchar(255) NOT NULL,
	"organisasi_id" integer NOT NULL,
	"role_id" integer NOT NULL,
	"status_aktif" boolean DEFAULT true NOT NULL,
	"last_login" timestamp,
	"no_hp" varchar(20),
	"alamat" text,
	"foto_url" varchar(500),
	"tanggal_lahir" date,
	"jenis_kelamin" varchar(1),
	"pendidikan_terakhir" varchar(100),
	"tanggal_bergabung" date,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "mst_pegawai_nip_unique" UNIQUE("nip"),
	CONSTRAINT "mst_pegawai_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "mst_penyuluh" (
	"id" serial PRIMARY KEY NOT NULL,
	"pegawai_id" integer NOT NULL,
	"upt_id" integer NOT NULL,
	"province_id" integer NOT NULL,
	"jumlah_kelompok" integer DEFAULT 0 NOT NULL,
	"program_prioritas" varchar(255),
	"status_aktif" boolean DEFAULT true NOT NULL,
	"wilayah_binaan" text,
	"spesialisasi" varchar(255),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "mst_kelompok_nelayan" (
	"id" serial PRIMARY KEY NOT NULL,
	"nib_kelompok" varchar(50) NOT NULL,
	"no_registrasi" varchar(50) NOT NULL,
	"nama_kelompok" varchar(255) NOT NULL,
	"nik_ketua" varchar(50) NOT NULL,
	"nama_ketua" varchar(255) NOT NULL,
	"upt_id" integer NOT NULL,
	"province_id" integer NOT NULL,
	"penyuluh_id" integer NOT NULL,
	"gabungan_kelompok_id" integer,
	"jumlah_anggota" integer DEFAULT 1 NOT NULL,
	"jenis_usaha_id" integer,
	"alamat" text,
	"no_hp_ketua" varchar(20),
	"tahun_berdiri" integer,
	"status_kelompok" varchar(50),
	"luas_lahan" numeric(10, 2),
	"koordinat_latitude" numeric(10, 8),
	"koordinat_longitude" numeric(11, 8),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "mst_kelompok_nelayan_nib_kelompok_unique" UNIQUE("nib_kelompok"),
	CONSTRAINT "mst_kelompok_nelayan_no_registrasi_unique" UNIQUE("no_registrasi")
);
--> statement-breakpoint
CREATE TABLE "trx_absensi" (
	"id" serial PRIMARY KEY NOT NULL,
	"date" date NOT NULL,
	"nip" varchar(50) NOT NULL,
	"checkin" timestamp NOT NULL,
	"ci_latitude" numeric(10, 8) NOT NULL,
	"ci_longitude" numeric(11, 8) NOT NULL,
	"checkin_photo_url" varchar(500),
	"checkin_photo_id" varchar(255),
	"checkout" timestamp,
	"co_latitude" numeric(10, 8),
	"co_longitude" numeric(11, 8),
	"working_hours" numeric(5, 2),
	"status" varchar(50),
	"total_overtime" numeric(5, 2) DEFAULT '0',
	"keterangan" text,
	"foto_checkout_url" varchar(500),
	"foto_checkout_id" varchar(255),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "mst_jenis_usaha" (
	"id" serial PRIMARY KEY NOT NULL,
	"kode_jenis_usaha" varchar(20) NOT NULL,
	"nama_jenis_usaha" varchar(255) NOT NULL,
	"kategori" varchar(100) NOT NULL,
	"keterangan" text,
	"status_aktif" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "mst_jenis_usaha_kode_jenis_usaha_unique" UNIQUE("kode_jenis_usaha")
);
--> statement-breakpoint
CREATE TABLE "mst_komoditas" (
	"id" serial PRIMARY KEY NOT NULL,
	"kode_komoditas" varchar(20) NOT NULL,
	"nama_komoditas" varchar(255) NOT NULL,
	"nama_ilmiah" varchar(255),
	"kategori" varchar(100) NOT NULL,
	"satuan" varchar(50) NOT NULL,
	"harga_pasar_rata" numeric(15, 2),
	"keterangan" text,
	"status_aktif" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "mst_komoditas_kode_komoditas_unique" UNIQUE("kode_komoditas")
);
--> statement-breakpoint
CREATE TABLE "mst_alat_tangkap" (
	"id" serial PRIMARY KEY NOT NULL,
	"kode_alat_tangkap" varchar(20) NOT NULL,
	"nama_alat_tangkap" varchar(255) NOT NULL,
	"jenis" varchar(100) NOT NULL,
	"target_komoditas" text,
	"keterangan" text,
	"status_aktif" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "mst_alat_tangkap_kode_alat_tangkap_unique" UNIQUE("kode_alat_tangkap")
);
--> statement-breakpoint
CREATE TABLE "mst_kapal" (
	"id" serial PRIMARY KEY NOT NULL,
	"kelompok_nelayan_id" integer NOT NULL,
	"no_registrasi_kapal" varchar(50) NOT NULL,
	"nama_kapal" varchar(255) NOT NULL,
	"jenis_kapal" varchar(100) NOT NULL,
	"ukuran_gt" numeric(10, 2),
	"ukuran_panjang" numeric(10, 2),
	"ukuran_lebar" numeric(10, 2),
	"mesin_pk" numeric(10, 2),
	"tahun_pembuatan" integer,
	"pelabuhan_pangkalan" varchar(255),
	"status_kapal" varchar(50) DEFAULT 'Aktif' NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "mst_kapal_no_registrasi_kapal_unique" UNIQUE("no_registrasi_kapal")
);
--> statement-breakpoint
CREATE TABLE "mst_jenis_bantuan" (
	"id" serial PRIMARY KEY NOT NULL,
	"kode_jenis_bantuan" varchar(20) NOT NULL,
	"nama_jenis_bantuan" varchar(255) NOT NULL,
	"kategori" varchar(100) NOT NULL,
	"satuan" varchar(50),
	"nilai_estimasi" numeric(15, 2),
	"keterangan" text,
	"status_aktif" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "mst_jenis_bantuan_kode_jenis_bantuan_unique" UNIQUE("kode_jenis_bantuan")
);
--> statement-breakpoint
CREATE TABLE "mst_jenis_pelatihan" (
	"id" serial PRIMARY KEY NOT NULL,
	"kode_jenis_pelatihan" varchar(20) NOT NULL,
	"nama_jenis_pelatihan" varchar(255) NOT NULL,
	"kategori" varchar(100) NOT NULL,
	"durasi_hari" integer,
	"target_peserta" varchar(100),
	"keterangan" text,
	"status_aktif" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "mst_jenis_pelatihan_kode_jenis_pelatihan_unique" UNIQUE("kode_jenis_pelatihan")
);
--> statement-breakpoint
CREATE TABLE "mst_jenis_sertifikasi" (
	"id" serial PRIMARY KEY NOT NULL,
	"kode_jenis_sertifikasi" varchar(20) NOT NULL,
	"nama_jenis_sertifikasi" varchar(255) NOT NULL,
	"kategori" varchar(100) NOT NULL,
	"lembaga_penerbit" varchar(255) NOT NULL,
	"masa_berlaku_tahun" integer,
	"persyaratan" text,
	"keterangan" text,
	"status_aktif" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "mst_jenis_sertifikasi_kode_jenis_sertifikasi_unique" UNIQUE("kode_jenis_sertifikasi")
);
--> statement-breakpoint
CREATE TABLE "trx_produksi_hasil_tangkapan" (
	"id" serial PRIMARY KEY NOT NULL,
	"kelompok_nelayan_id" integer NOT NULL,
	"kapal_id" integer,
	"tanggal_produksi" date NOT NULL,
	"komoditas_id" integer NOT NULL,
	"alat_tangkap_id" integer,
	"jumlah_produksi" numeric(15, 2) NOT NULL,
	"satuan" varchar(50) NOT NULL,
	"harga_jual" numeric(15, 2),
	"total_nilai" numeric(15, 2),
	"lokasi_penangkapan" varchar(255),
	"koordinat_latitude" numeric(10, 8),
	"koordinat_longitude" numeric(11, 8),
	"keterangan" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "trx_bantuan" (
	"id" serial PRIMARY KEY NOT NULL,
	"no_bantuan" varchar(50) NOT NULL,
	"jenis_bantuan_id" integer NOT NULL,
	"kelompok_nelayan_id" integer NOT NULL,
	"penyuluh_id" integer NOT NULL,
	"tanggal_penyaluran" date NOT NULL,
	"jumlah" numeric(15, 2) NOT NULL,
	"satuan" varchar(50) NOT NULL,
	"nilai_bantuan" numeric(15, 2) NOT NULL,
	"sumber_dana" varchar(255),
	"tahun_anggaran" integer NOT NULL,
	"status_penyaluran" varchar(50) DEFAULT 'Direncanakan' NOT NULL,
	"tanggal_selesai" date,
	"bukti_penyaluran_url" varchar(500),
	"keterangan" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "trx_bantuan_no_bantuan_unique" UNIQUE("no_bantuan")
);
--> statement-breakpoint
CREATE TABLE "trx_pelatihan" (
	"id" serial PRIMARY KEY NOT NULL,
	"no_pelatihan" varchar(50) NOT NULL,
	"jenis_pelatihan_id" integer NOT NULL,
	"nama_pelatihan" varchar(255) NOT NULL,
	"penyelenggara" varchar(255) NOT NULL,
	"penyuluh_id" integer,
	"tanggal_mulai" date NOT NULL,
	"tanggal_selesai" date NOT NULL,
	"lokasi" varchar(255) NOT NULL,
	"jumlah_peserta" integer DEFAULT 0 NOT NULL,
	"target_peserta" integer NOT NULL,
	"peserta_kelompok" text,
	"narasumber" varchar(255),
	"biaya" numeric(15, 2),
	"sumber_dana" varchar(255),
	"status_pelatihan" varchar(50) DEFAULT 'Direncanakan' NOT NULL,
	"hasil_evaluasi" text,
	"dokumentasi_url" varchar(500),
	"keterangan" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "trx_pelatihan_no_pelatihan_unique" UNIQUE("no_pelatihan")
);
--> statement-breakpoint
CREATE TABLE "trx_sertifikasi" (
	"id" serial PRIMARY KEY NOT NULL,
	"no_sertifikat" varchar(50) NOT NULL,
	"jenis_sertifikasi_id" integer NOT NULL,
	"kelompok_nelayan_id" integer NOT NULL,
	"penyuluh_id" integer,
	"tanggal_terbit" date NOT NULL,
	"tanggal_berlaku" date NOT NULL,
	"tanggal_kadaluarsa" date NOT NULL,
	"lembaga_penerbit" varchar(255) NOT NULL,
	"status_sertifikat" varchar(50) DEFAULT 'Aktif' NOT NULL,
	"file_sertifikat_url" varchar(500),
	"keterangan" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "trx_sertifikasi_no_sertifikat_unique" UNIQUE("no_sertifikat")
);
--> statement-breakpoint
ALTER TABLE "mst_kabupaten" ADD CONSTRAINT "mst_kabupaten_province_id_mst_provinsi_id_fk" FOREIGN KEY ("province_id") REFERENCES "public"."mst_provinsi"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "mst_kecamatan" ADD CONSTRAINT "mst_kecamatan_regency_id_mst_kabupaten_id_fk" FOREIGN KEY ("regency_id") REFERENCES "public"."mst_kabupaten"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "mst_desa" ADD CONSTRAINT "mst_desa_district_id_mst_kecamatan_id_fk" FOREIGN KEY ("district_id") REFERENCES "public"."mst_kecamatan"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "mst_upt" ADD CONSTRAINT "mst_upt_province_id_mst_provinsi_id_fk" FOREIGN KEY ("province_id") REFERENCES "public"."mst_provinsi"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mst_pegawai" ADD CONSTRAINT "mst_pegawai_organisasi_id_mst_organisasi_id_fk" FOREIGN KEY ("organisasi_id") REFERENCES "public"."mst_organisasi"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mst_pegawai" ADD CONSTRAINT "mst_pegawai_role_id_mst_role_id_fk" FOREIGN KEY ("role_id") REFERENCES "public"."mst_role"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mst_penyuluh" ADD CONSTRAINT "mst_penyuluh_pegawai_id_mst_pegawai_id_fk" FOREIGN KEY ("pegawai_id") REFERENCES "public"."mst_pegawai"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mst_penyuluh" ADD CONSTRAINT "mst_penyuluh_upt_id_mst_upt_id_fk" FOREIGN KEY ("upt_id") REFERENCES "public"."mst_upt"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mst_penyuluh" ADD CONSTRAINT "mst_penyuluh_province_id_mst_provinsi_id_fk" FOREIGN KEY ("province_id") REFERENCES "public"."mst_provinsi"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mst_kelompok_nelayan" ADD CONSTRAINT "mst_kelompok_nelayan_upt_id_mst_upt_id_fk" FOREIGN KEY ("upt_id") REFERENCES "public"."mst_upt"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mst_kelompok_nelayan" ADD CONSTRAINT "mst_kelompok_nelayan_province_id_mst_provinsi_id_fk" FOREIGN KEY ("province_id") REFERENCES "public"."mst_provinsi"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mst_kelompok_nelayan" ADD CONSTRAINT "mst_kelompok_nelayan_penyuluh_id_mst_penyuluh_id_fk" FOREIGN KEY ("penyuluh_id") REFERENCES "public"."mst_penyuluh"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mst_kelompok_nelayan" ADD CONSTRAINT "mst_kelompok_nelayan_gabungan_kelompok_id_mst_kelompok_nelayan_id_fk" FOREIGN KEY ("gabungan_kelompok_id") REFERENCES "public"."mst_kelompok_nelayan"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mst_kelompok_nelayan" ADD CONSTRAINT "mst_kelompok_nelayan_jenis_usaha_id_mst_jenis_usaha_id_fk" FOREIGN KEY ("jenis_usaha_id") REFERENCES "public"."mst_jenis_usaha"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "trx_absensi" ADD CONSTRAINT "trx_absensi_nip_mst_pegawai_nip_fk" FOREIGN KEY ("nip") REFERENCES "public"."mst_pegawai"("nip") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mst_kapal" ADD CONSTRAINT "mst_kapal_kelompok_nelayan_id_mst_kelompok_nelayan_id_fk" FOREIGN KEY ("kelompok_nelayan_id") REFERENCES "public"."mst_kelompok_nelayan"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "trx_produksi_hasil_tangkapan" ADD CONSTRAINT "trx_produksi_hasil_tangkapan_kelompok_nelayan_id_mst_kelompok_nelayan_id_fk" FOREIGN KEY ("kelompok_nelayan_id") REFERENCES "public"."mst_kelompok_nelayan"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "trx_produksi_hasil_tangkapan" ADD CONSTRAINT "trx_produksi_hasil_tangkapan_kapal_id_mst_kapal_id_fk" FOREIGN KEY ("kapal_id") REFERENCES "public"."mst_kapal"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "trx_produksi_hasil_tangkapan" ADD CONSTRAINT "trx_produksi_hasil_tangkapan_komoditas_id_mst_komoditas_id_fk" FOREIGN KEY ("komoditas_id") REFERENCES "public"."mst_komoditas"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "trx_produksi_hasil_tangkapan" ADD CONSTRAINT "trx_produksi_hasil_tangkapan_alat_tangkap_id_mst_alat_tangkap_id_fk" FOREIGN KEY ("alat_tangkap_id") REFERENCES "public"."mst_alat_tangkap"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "trx_bantuan" ADD CONSTRAINT "trx_bantuan_jenis_bantuan_id_mst_jenis_bantuan_id_fk" FOREIGN KEY ("jenis_bantuan_id") REFERENCES "public"."mst_jenis_bantuan"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "trx_bantuan" ADD CONSTRAINT "trx_bantuan_kelompok_nelayan_id_mst_kelompok_nelayan_id_fk" FOREIGN KEY ("kelompok_nelayan_id") REFERENCES "public"."mst_kelompok_nelayan"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "trx_bantuan" ADD CONSTRAINT "trx_bantuan_penyuluh_id_mst_penyuluh_id_fk" FOREIGN KEY ("penyuluh_id") REFERENCES "public"."mst_penyuluh"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "trx_pelatihan" ADD CONSTRAINT "trx_pelatihan_jenis_pelatihan_id_mst_jenis_pelatihan_id_fk" FOREIGN KEY ("jenis_pelatihan_id") REFERENCES "public"."mst_jenis_pelatihan"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "trx_pelatihan" ADD CONSTRAINT "trx_pelatihan_penyuluh_id_mst_penyuluh_id_fk" FOREIGN KEY ("penyuluh_id") REFERENCES "public"."mst_penyuluh"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "trx_sertifikasi" ADD CONSTRAINT "trx_sertifikasi_jenis_sertifikasi_id_mst_jenis_sertifikasi_id_fk" FOREIGN KEY ("jenis_sertifikasi_id") REFERENCES "public"."mst_jenis_sertifikasi"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "trx_sertifikasi" ADD CONSTRAINT "trx_sertifikasi_kelompok_nelayan_id_mst_kelompok_nelayan_id_fk" FOREIGN KEY ("kelompok_nelayan_id") REFERENCES "public"."mst_kelompok_nelayan"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "trx_sertifikasi" ADD CONSTRAINT "trx_sertifikasi_penyuluh_id_mst_penyuluh_id_fk" FOREIGN KEY ("penyuluh_id") REFERENCES "public"."mst_penyuluh"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_mst_provinsi_name_lower" ON "mst_provinsi" USING btree ("name");--> statement-breakpoint
CREATE INDEX "idx_mst_kabupaten_province_id" ON "mst_kabupaten" USING btree ("province_id");--> statement-breakpoint
CREATE INDEX "idx_mst_kabupaten_name_lower" ON "mst_kabupaten" USING btree ("name");--> statement-breakpoint
CREATE INDEX "idx_mst_kabupaten_province_name" ON "mst_kabupaten" USING btree ("province_id","name");--> statement-breakpoint
CREATE INDEX "idx_mst_kecamatan_regency_id" ON "mst_kecamatan" USING btree ("regency_id");--> statement-breakpoint
CREATE INDEX "idx_mst_kecamatan_name_lower" ON "mst_kecamatan" USING btree ("name");--> statement-breakpoint
CREATE INDEX "idx_mst_kecamatan_regency_name" ON "mst_kecamatan" USING btree ("regency_id","name");--> statement-breakpoint
CREATE INDEX "idx_mst_desa_district_id" ON "mst_desa" USING btree ("district_id");--> statement-breakpoint
CREATE INDEX "idx_mst_desa_name_lower" ON "mst_desa" USING btree ("name");--> statement-breakpoint
CREATE INDEX "idx_mst_desa_district_name" ON "mst_desa" USING btree ("district_id","name");--> statement-breakpoint
CREATE INDEX "idx_mst_jenis_usaha_kategori" ON "mst_jenis_usaha" USING btree ("kategori");--> statement-breakpoint
CREATE INDEX "idx_mst_komoditas_kategori" ON "mst_komoditas" USING btree ("kategori");--> statement-breakpoint
CREATE INDEX "idx_mst_komoditas_nama" ON "mst_komoditas" USING btree ("nama_komoditas");--> statement-breakpoint
CREATE INDEX "idx_mst_alat_tangkap_jenis" ON "mst_alat_tangkap" USING btree ("jenis");--> statement-breakpoint
CREATE INDEX "idx_mst_kapal_kelompok" ON "mst_kapal" USING btree ("kelompok_nelayan_id");--> statement-breakpoint
CREATE INDEX "idx_mst_kapal_status" ON "mst_kapal" USING btree ("status_kapal");--> statement-breakpoint
CREATE INDEX "idx_mst_jenis_bantuan_kategori" ON "mst_jenis_bantuan" USING btree ("kategori");--> statement-breakpoint
CREATE INDEX "idx_mst_jenis_pelatihan_kategori" ON "mst_jenis_pelatihan" USING btree ("kategori");--> statement-breakpoint
CREATE INDEX "idx_mst_jenis_sertifikasi_kategori" ON "mst_jenis_sertifikasi" USING btree ("kategori");--> statement-breakpoint
CREATE INDEX "idx_trx_produksi_kelompok" ON "trx_produksi_hasil_tangkapan" USING btree ("kelompok_nelayan_id");--> statement-breakpoint
CREATE INDEX "idx_trx_produksi_tanggal" ON "trx_produksi_hasil_tangkapan" USING btree ("tanggal_produksi");--> statement-breakpoint
CREATE INDEX "idx_trx_produksi_komoditas" ON "trx_produksi_hasil_tangkapan" USING btree ("komoditas_id");--> statement-breakpoint
CREATE INDEX "idx_trx_produksi_kelompok_tanggal" ON "trx_produksi_hasil_tangkapan" USING btree ("kelompok_nelayan_id","tanggal_produksi");--> statement-breakpoint
CREATE INDEX "idx_trx_bantuan_kelompok" ON "trx_bantuan" USING btree ("kelompok_nelayan_id");--> statement-breakpoint
CREATE INDEX "idx_trx_bantuan_tanggal" ON "trx_bantuan" USING btree ("tanggal_penyaluran");--> statement-breakpoint
CREATE INDEX "idx_trx_bantuan_status" ON "trx_bantuan" USING btree ("status_penyaluran");--> statement-breakpoint
CREATE INDEX "idx_trx_bantuan_tahun_status" ON "trx_bantuan" USING btree ("tahun_anggaran","status_penyaluran");--> statement-breakpoint
CREATE INDEX "idx_trx_pelatihan_tanggal" ON "trx_pelatihan" USING btree ("tanggal_mulai");--> statement-breakpoint
CREATE INDEX "idx_trx_pelatihan_status" ON "trx_pelatihan" USING btree ("status_pelatihan");--> statement-breakpoint
CREATE INDEX "idx_trx_pelatihan_tanggal_status" ON "trx_pelatihan" USING btree ("tanggal_mulai","status_pelatihan");--> statement-breakpoint
CREATE INDEX "idx_trx_sertifikasi_kelompok" ON "trx_sertifikasi" USING btree ("kelompok_nelayan_id");--> statement-breakpoint
CREATE INDEX "idx_trx_sertifikasi_kadaluarsa" ON "trx_sertifikasi" USING btree ("tanggal_kadaluarsa");--> statement-breakpoint
CREATE INDEX "idx_trx_sertifikasi_status" ON "trx_sertifikasi" USING btree ("status_sertifikat");--> statement-breakpoint
CREATE INDEX "idx_trx_sertifikasi_kelompok_status" ON "trx_sertifikasi" USING btree ("kelompok_nelayan_id","status_sertifikat");