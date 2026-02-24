import { db } from '../src/db';
import { mstPegawai, mstOrganisasi, mstRole } from '../src/db/schema';
import { eq } from 'drizzle-orm';

export async function seedPegawai() {
  console.log('📝 Seeding mst_pegawai...');
  const existing = await db.select().from(mstPegawai).limit(1);
  if (existing.length > 0) {
    console.log('⏭️  Skipped - mst_pegawai already has data\n');
    return;
  }

  const allOrganisasi = await db.select().from(mstOrganisasi);
  const allRole = await db.select().from(mstRole);

  if (allOrganisasi.length === 0) throw new Error('mst_organisasi kosong. Jalankan seed-role-organisasi terlebih dahulu.');
  if (allRole.length === 0) throw new Error('mst_role kosong. Jalankan seed-role-organisasi terlebih dahulu.');

  // Buat map kode_organisasi → id dan nama_role → id untuk kemudahan lookup
  const orgByKode = new Map(allOrganisasi.map((o) => [o.kode_organisasi, o.id]));
  const roleByNama = new Map(allRole.map((r) => [r.nama_role, r.id]));

  const orgDinas     = orgByKode.get('DKP-SULSEL')!;
  const orgTangkap   = orgByKode.get('BID-TANGKAP')!;
  const orgBudidaya  = orgByKode.get('BID-BUDIDAYA')!;
  const orgOlahan    = orgByKode.get('BID-OLAHAN')!;
  const orgSekret    = orgByKode.get('SEKRET-DKP')!;
  const orgUpt1      = orgByKode.get('UPT-WIL1')!;
  const orgUpt2      = orgByKode.get('UPT-WIL2')!;
  const orgUpt3      = orgByKode.get('UPT-WIL3')!;
  const orgUpt4      = orgByKode.get('UPT-WIL4')!;
  const orgUpt5      = orgByKode.get('UPT-WIL5')!;

  const roleKadis    = roleByNama.get('Kepala Dinas')!;
  const roleKabid    = roleByNama.get('Kepala Bidang')!;
  const roleKaUpt    = roleByNama.get('Kepala UPT')!;
  const roleMadya    = roleByNama.get('Penyuluh Perikanan Ahli Madya')!;
  const roleMuda     = roleByNama.get('Penyuluh Perikanan Ahli Muda')!;
  const rolePertama  = roleByNama.get('Penyuluh Perikanan Ahli Pertama')!;
  const roleTerampil = roleByNama.get('Penyuluh Perikanan Terampil')!;
  const roleAdmin    = roleByNama.get('Staf Administrasi')!;

  const data = [
    // ── Pimpinan ────────────────────────────────────────────────────────────
    {
      nip: '197501121998031001',
      nama: 'Andi Baso Mappaselling, S.Pi., M.Si.',
      email: 'andi.baso@dkp.sulsel.go.id',
      jabatan: 'Kepala Dinas Kelautan dan Perikanan',
      organisasi_id: orgDinas,
      role_id: roleKadis,
      jenis_kelamin: 'L',
      tanggal_lahir: '1975-01-12',
      pendidikan_terakhir: 'S2 Ilmu Perikanan',
      no_hp: '081234567801',
      alamat: 'Jl. Pettarani No. 48, Makassar',
      tanggal_bergabung: '1998-03-01',
      status_aktif: true,
    },
    {
      nip: '197908152003122001',
      nama: 'Nurhidayah Syam, S.Pi., M.M.',
      email: 'nurhidayah.syam@dkp.sulsel.go.id',
      jabatan: 'Kepala Bidang Perikanan Tangkap',
      organisasi_id: orgTangkap,
      role_id: roleKabid,
      jenis_kelamin: 'P',
      tanggal_lahir: '1979-08-15',
      pendidikan_terakhir: 'S2 Manajemen',
      no_hp: '081234567802',
      alamat: 'Jl. Rappocini Raya No. 12, Makassar',
      tanggal_bergabung: '2003-12-01',
      status_aktif: true,
    },
    {
      nip: '198104202004041002',
      nama: 'Mappaselling Dg. Nassa, S.Pi.',
      email: 'mappaselling.nassa@dkp.sulsel.go.id',
      jabatan: 'Kepala Bidang Perikanan Budidaya',
      organisasi_id: orgBudidaya,
      role_id: roleKabid,
      jenis_kelamin: 'L',
      tanggal_lahir: '1981-04-20',
      pendidikan_terakhir: 'S1 Budidaya Perairan',
      no_hp: '081234567803',
      alamat: 'Jl. Sultan Alauddin No. 77, Makassar',
      tanggal_bergabung: '2004-04-01',
      status_aktif: true,
    },
    // ── Kepala UPT ──────────────────────────────────────────────────────────
    {
      nip: '198203202006031003',
      nama: 'Haerullah Rahman, S.Pi., M.Si.',
      email: 'haerullah.rahman@dkp.sulsel.go.id',
      jabatan: 'Kepala UPT Wilayah I Makassar',
      organisasi_id: orgUpt1,
      role_id: roleKaUpt,
      jenis_kelamin: 'L',
      tanggal_lahir: '1982-03-20',
      pendidikan_terakhir: 'S2 Ilmu Kelautan',
      no_hp: '081234567804',
      alamat: 'Jl. Penghibur No. 23, Makassar',
      tanggal_bergabung: '2006-03-01',
      status_aktif: true,
    },
    {
      nip: '198305112007031004',
      nama: 'Darmawan Latif, S.Pi.',
      email: 'darmawan.latif@dkp.sulsel.go.id',
      jabatan: 'Kepala UPT Wilayah II Bone',
      organisasi_id: orgUpt2,
      role_id: roleKaUpt,
      jenis_kelamin: 'L',
      tanggal_lahir: '1983-05-11',
      pendidikan_terakhir: 'S1 Ilmu Perikanan',
      no_hp: '081234567805',
      alamat: 'Jl. Jend. Sudirman No. 5, Watampone',
      tanggal_bergabung: '2007-03-01',
      status_aktif: true,
    },
    // ── Penyuluh Ahli Madya ─────────────────────────────────────────────────
    {
      nip: '198506142007032002',
      nama: 'Sitti Rahmawati, S.Pi., M.Pi.',
      email: 'sitti.rahmawati@dkp.sulsel.go.id',
      jabatan: 'Penyuluh Perikanan Ahli Madya',
      organisasi_id: orgUpt1,
      role_id: roleMadya,
      jenis_kelamin: 'P',
      tanggal_lahir: '1985-06-14',
      pendidikan_terakhir: 'S2 Penyuluhan Perikanan',
      no_hp: '081234567806',
      alamat: 'Jl. Hertasning Baru No. 9, Makassar',
      tanggal_bergabung: '2007-03-01',
      status_aktif: true,
    },
    // ── Penyuluh Ahli Muda ──────────────────────────────────────────────────
    {
      nip: '198802272010031007',
      nama: 'Jumadi Mappeasse, S.St.Pi.',
      email: 'jumadi.mappeasse@dkp.sulsel.go.id',
      jabatan: 'Penyuluh Perikanan Ahli Muda',
      organisasi_id: orgUpt2,
      role_id: roleMuda,
      jenis_kelamin: 'L',
      tanggal_lahir: '1988-02-27',
      pendidikan_terakhir: 'D4 Penyuluhan Perikanan',
      no_hp: '081234567807',
      alamat: 'Jl. Pemuda No. 34, Watampone',
      tanggal_bergabung: '2010-03-01',
      status_aktif: true,
    },
    {
      nip: '199011252011031006',
      nama: 'Ruslan Hasanuddin, S.Pi., M.M.',
      email: 'ruslan.hasanuddin@dkp.sulsel.go.id',
      jabatan: 'Penyuluh Perikanan Ahli Muda',
      organisasi_id: orgUpt3,
      role_id: roleMuda,
      jenis_kelamin: 'L',
      tanggal_lahir: '1990-11-25',
      pendidikan_terakhir: 'S2 Manajemen Agribisnis',
      no_hp: '081234567808',
      alamat: 'Jl. Raya Pangkep No. 18, Pangkajene',
      tanggal_bergabung: '2011-03-01',
      status_aktif: true,
    },
    // ── Penyuluh Ahli Pertama ───────────────────────────────────────────────
    {
      nip: '199104082013032008',
      nama: 'Nurjannah Basri, S.Pi.',
      email: 'nurjannah.basri@dkp.sulsel.go.id',
      jabatan: 'Penyuluh Perikanan Ahli Pertama',
      organisasi_id: orgUpt4,
      role_id: rolePertama,
      jenis_kelamin: 'P',
      tanggal_lahir: '1991-04-08',
      pendidikan_terakhir: 'S1 Ilmu Perikanan',
      no_hp: '081234567809',
      alamat: 'Jl. Soekarno-Hatta No. 7, Barru',
      tanggal_bergabung: '2013-03-01',
      status_aktif: true,
    },
    {
      nip: '199205132014032007',
      nama: 'Fatmawati Said, S.Pi.',
      email: 'fatmawati.said@dkp.sulsel.go.id',
      jabatan: 'Penyuluh Perikanan Ahli Pertama',
      organisasi_id: orgUpt5,
      role_id: rolePertama,
      jenis_kelamin: 'P',
      tanggal_lahir: '1992-05-13',
      pendidikan_terakhir: 'S1 Budidaya Perairan',
      no_hp: '081234567810',
      alamat: 'Jl. Merdeka No. 22, Sinjai',
      tanggal_bergabung: '2014-03-01',
      status_aktif: true,
    },
    // ── Penyuluh Terampil ───────────────────────────────────────────────────
    {
      nip: '199307192015032003',
      nama: 'Syahriani Dg. Naba, A.Md.Pi.',
      email: 'syahriani.naba@dkp.sulsel.go.id',
      jabatan: 'Penyuluh Perikanan Terampil',
      organisasi_id: orgUpt2,
      role_id: roleTerampil,
      jenis_kelamin: 'P',
      tanggal_lahir: '1993-07-19',
      pendidikan_terakhir: 'D3 Teknologi Penangkapan Ikan',
      no_hp: '081234567811',
      alamat: 'Jl. Mangga No. 3, Watampone',
      tanggal_bergabung: '2015-03-01',
      status_aktif: true,
    },
    {
      nip: '199412062016031009',
      nama: 'Amirullah Tahir, A.Md.Pi.',
      email: 'amirullah.tahir@dkp.sulsel.go.id',
      jabatan: 'Penyuluh Perikanan Terampil',
      organisasi_id: orgUpt5,
      role_id: roleTerampil,
      jenis_kelamin: 'L',
      tanggal_lahir: '1994-12-06',
      pendidikan_terakhir: 'D3 Budidaya Perikanan',
      no_hp: '081234567812',
      alamat: 'Jl. Arung Palakka No. 14, Sinjai',
      tanggal_bergabung: '2016-03-01',
      status_aktif: true,
    },
    // ── Staf Administrasi ───────────────────────────────────────────────────
    {
      nip: '199608172018032004',
      nama: 'Wahyuni Kamaruddin, S.Adm.',
      email: 'wahyuni.kamaruddin@dkp.sulsel.go.id',
      jabatan: 'Staf Administrasi Umum',
      organisasi_id: orgSekret,
      role_id: roleAdmin,
      jenis_kelamin: 'P',
      tanggal_lahir: '1996-08-17',
      pendidikan_terakhir: 'S1 Administrasi Publik',
      no_hp: '081234567813',
      alamat: 'Jl. A. P. Pettarani No. 36, Makassar',
      tanggal_bergabung: '2018-03-01',
      status_aktif: true,
    },
    {
      nip: '199705242019031010',
      nama: 'Syafruddin Dg. Tiro, A.Md.',
      email: 'syafruddin.tiro@dkp.sulsel.go.id',
      jabatan: 'Staf Administrasi Keuangan',
      organisasi_id: orgSekret,
      role_id: roleAdmin,
      jenis_kelamin: 'L',
      tanggal_lahir: '1997-05-24',
      pendidikan_terakhir: 'D3 Akuntansi',
      no_hp: '081234567814',
      alamat: 'Jl. Cakalang No. 7, Makassar',
      tanggal_bergabung: '2019-03-01',
      status_aktif: true,
    },
  ];

  const result = await db.insert(mstPegawai).values(data).returning();
  console.log(`✅ Seeded ${result.length} pegawai\n`);
}

async function main() {
  try {
    console.log('🌱 Seeding mst_pegawai...\n');
    await seedPegawai();
    console.log('🎉 Selesai!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

if (import.meta.main) main();
