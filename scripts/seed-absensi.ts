import { db } from '../src/db';
import { absensi } from '../src/db/schema/absensi';

async function seedAbsensi() {
  console.log('Seeding absensi data...\n');

  const absensiData = [
    {
      date: '2026-02-10',
      nip: '00001',
      checkin: new Date('2026-02-10T08:00:00Z'),
      checkout: new Date('2026-02-10T17:00:00Z'),
      working_hours: '9.00',
      latitude: '-6.200000',
      longitude: '106.816666',
    },
    {
      date: '2026-02-11',
      nip: '00001',
      checkin: new Date('2026-02-11T07:55:00Z'),
      checkout: new Date('2026-02-11T17:10:00Z'),
      working_hours: '9.25',
      latitude: '-6.200000',
      longitude: '106.816666',
    },
    {
      date: '2026-02-12',
      nip: '00001',
      checkin: new Date('2026-02-12T08:05:00Z'),
      checkout: new Date('2026-02-12T16:50:00Z'),
      working_hours: '8.75',
      latitude: '-6.200000',
      longitude: '106.816666',
    },
    {
      date: '2026-02-10',
      nip: '00002',
      checkin: new Date('2026-02-10T07:45:00Z'),
      checkout: new Date('2026-02-10T16:30:00Z'),
      working_hours: '8.75',
      latitude: '-6.175110',
      longitude: '106.865036',
    },
    {
      date: '2026-02-11',
      nip: '00002',
      checkin: new Date('2026-02-11T07:50:00Z'),
      checkout: new Date('2026-02-11T16:45:00Z'),
      working_hours: '8.92',
      latitude: '-6.175110',
      longitude: '106.865036',
    },
    {
      date: '2026-02-10',
      nip: '00004',
      checkin: new Date('2026-02-10T08:10:00Z'),
      checkout: new Date('2026-02-10T17:15:00Z'),
      working_hours: '9.08',
      latitude: '-6.914744',
      longitude: '107.609810',
    },
    {
      date: '2026-02-11',
      nip: '00004',
      checkin: new Date('2026-02-11T08:00:00Z'),
      checkout: new Date('2026-02-11T17:00:00Z'),
      working_hours: '9.00',
      latitude: '-6.914744',
      longitude: '107.609810',
    },
    {
      date: '2026-02-12',
      nip: '00004',
      checkin: new Date('2026-02-12T07:58:00Z'),
      checkout: new Date('2026-02-12T17:05:00Z'),
      working_hours: '9.12',
      latitude: '-6.914744',
      longitude: '107.609810',
    },
  ];

  try {
    for (const data of absensiData) {
      const result = await db.insert(absensi).values(data).returning();
      console.log(`✓ Created absensi: ${data.nip} - ${data.date} (${data.working_hours} hours)`);
    }

    console.log(`\n✓ Successfully seeded ${absensiData.length} absensi records`);
  } catch (error) {
    console.error('Error seeding absensi:', error);
    throw error;
  }
}

seedAbsensi()
  .then(() => {
    console.log('\nDone!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Seeding failed:', error);
    process.exit(1);
  });
