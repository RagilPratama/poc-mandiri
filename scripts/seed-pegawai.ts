import { db } from '../src/db';
import { pegawai } from '../src/db/schema/pegawai';
import { organisasi } from '../src/db/schema/organisasi';
import { roles } from '../src/db/schema/roles';

// Dummy data pegawai
const dummyPegawai = [
  {
    nip: '00001',
    nama: 'Budi Santoso',
    email: 'budi.santoso@kkp.go.id',
    jabatan: 'Kepala Seksi Perencanaan',
    status_aktif: true,
  },
  {
    nip: '00002',
    nama: 'Siti Nurhaliza',
    email: 'siti.nurhaliza@kkp.go.id',
    jabatan: 'Staf Administrasi',
    status_aktif: true,
  },
  {
    nip: '00003',
    nama: 'Ahmad Dahlan',
    email: 'ahmad.dahlan@kkp.go.id',
    jabatan: 'Analis Data',
    status_aktif: false,
  },
  {
    nip: '00004',
    nama: 'Dewi Lestari',
    email: 'dewi.lestari@kkp.go.id',
    jabatan: 'Kepala Bidang Operasional',
    status_aktif: true,
  },
  {
    nip: '00005',
    nama: 'Rudi Hartono',
    email: 'rudi.hartono@kkp.go.id',
    jabatan: 'Supervisor Lapangan',
    status_aktif: true,
  },
  {
    nip: '00006',
    nama: 'Maya Sari',
    email: 'maya.sari@kkp.go.id',
    jabatan: 'Staf Keuangan',
    status_aktif: true,
  },
  {
    nip: '00007',
    nama: 'Eko Prasetyo',
    email: 'eko.prasetyo@kkp.go.id',
    jabatan: 'Teknisi IT',
    status_aktif: false,
  },
  {
    nip: '00008',
    nama: 'Rina Wijaya',
    email: 'rina.wijaya@kkp.go.id',
    jabatan: 'Kepala Sub Bagian Umum',
    status_aktif: true,
  },
  {
    nip: '00009',
    nama: 'Agus Setiawan',
    email: 'agus.setiawan@kkp.go.id',
    jabatan: 'Analis Kebijakan',
    status_aktif: false,
  },
  {
    nip: '00010',
    nama: 'Fitri Handayani',
    email: 'fitri.handayani@kkp.go.id',
    jabatan: 'Staf Humas',
    status_aktif: true,
  },
];

async function seedPegawai() {
  try {
    console.log('🌱 Starting pegawai seeding...');

    // Get all organisasi and roles
    const allOrganisasi = await db.select().from(organisasi);
    const allRoles = await db.select().from(roles);

    if (allOrganisasi.length === 0) {
      console.error('❌ No organisasi found. Please seed organisasi first.');
      process.exit(1);
    }

    if (allRoles.length === 0) {
      console.error('❌ No roles found. Please seed roles first.');
      process.exit(1);
    }

    console.log(`✅ Found ${allOrganisasi.length} organisasi`);
    console.log(`✅ Found ${allRoles.length} roles`);

    // Check if pegawai already exists
    const existingPegawai = await db.select().from(pegawai).limit(1);
    if (existingPegawai.length > 0) {
      console.log('⚠️  Pegawai data already exists. Skipping...');
      process.exit(0);
    }

    // Insert dummy pegawai
    let inserted = 0;
    for (let i = 0; i < dummyPegawai.length; i++) {
      const data = dummyPegawai[i];
      
      // Distribute pegawai across organisasi and roles
      const organisasiId = allOrganisasi[i % allOrganisasi.length].id;
      const roleId = allRoles[i % allRoles.length].id;

      await db.insert(pegawai).values({
        ...data,
        organisasi_id: organisasiId,
        role_id: roleId,
        last_login: data.status_aktif ? new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000) : null,
      });

      inserted++;
      console.log(`✅ Inserted: ${data.nama} (${data.nip}) - Organisasi ID: ${organisasiId}, Role ID: ${roleId}`);
    }

    console.log(`\n🎉 Successfully seeded ${inserted} pegawai!`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding pegawai:', error);
    process.exit(1);
  }
}

seedPegawai();
