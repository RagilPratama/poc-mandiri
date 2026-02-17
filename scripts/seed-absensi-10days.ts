import { db } from '../src/db';
import { absensi } from '../src/db/schema/absensi';
import { pegawai } from '../src/db/schema/pegawai';

async function seedAbsensi10Days() {
  console.log('Starting absensi seeding for last 10 days...\n');

  try {
    // 1. Delete all existing absensi data
    console.log('1. Deleting all existing absensi data...');
    await db.delete(absensi);
    console.log('   ✓ All absensi data deleted\n');

    // 2. Get all pegawai
    console.log('2. Getting all pegawai...');
    const allPegawai = await db.select({ nip: pegawai.nip, nama: pegawai.nama }).from(pegawai);
    console.log(`   ✓ Found ${allPegawai.length} pegawai\n`);

    // 3. Generate data for last 10 days
    console.log('3. Generating absensi data for last 10 days...\n');
    
    const today = new Date();
    const absensiData = [];

    // Working hours scenarios (in hours)
    const scenarios = [
      { hours: 5.0, status: 'Pulang Sebelum Waktunya', overtime: '0.00' },      // 5 jam (tercepat)
      { hours: 6.5, status: 'Pulang Sebelum Waktunya', overtime: '0.00' },      // 6.5 jam
      { hours: 7.5, status: 'Pulang Sebelum Waktunya', overtime: '0.00' },      // 7.5 jam
      { hours: 8.0, status: 'Tepat Waktu', overtime: '0.00' },                  // 8 jam
      { hours: 8.15, status: 'Tepat Waktu', overtime: '0.00' },                 // 8 jam 9 menit
      { hours: 8.25, status: 'Tepat Waktu', overtime: '0.00' },                 // 8 jam 15 menit
      { hours: 8.5, status: 'Lembur', overtime: '0.25' },                       // Lembur 15 menit (0.25 jam)
      { hours: 9.0, status: 'Lembur', overtime: '0.75' },                       // Lembur 45 menit (0.75 jam)
      { hours: 9.5, status: 'Lembur', overtime: '1.25' },                       // Lembur 1 jam 15 menit
      { hours: 10.0, status: 'Lembur', overtime: '1.75' },                      // Lembur 1 jam 45 menit
      { hours: 10.5, status: 'Lembur', overtime: '2.25' },                      // Lembur 2 jam 15 menit
      { hours: 11.0, status: 'Lembur', overtime: '2.75' },                      // Lembur 2 jam 45 menit
      { hours: 11.25, status: 'Lembur', overtime: '3.00' },                     // Lembur 3 jam (terlama)
    ];

    // Koordinat lokasi (Jakarta area)
    const locations = [
      { lat: '-6.200000', lng: '106.816666' },   // Jakarta Pusat
      { lat: '-6.175110', lng: '106.865036' },   // Jakarta Timur
      { lat: '-6.260000', lng: '106.781666' },   // Jakarta Selatan
      { lat: '-6.138414', lng: '106.813308' },   // Jakarta Utara
      { lat: '-6.166667', lng: '106.766667' },   // Jakarta Barat
    ];

    for (let dayOffset = 9; dayOffset >= 0; dayOffset--) {
      const date = new Date(today);
      date.setDate(date.getDate() - dayOffset);
      const dateStr = date.toISOString().split('T')[0];

      for (const peg of allPegawai) {
        // Random scenario untuk setiap pegawai setiap hari
        const scenario = scenarios[Math.floor(Math.random() * scenarios.length)];
        
        // Random lokasi
        const ciLoc = locations[Math.floor(Math.random() * locations.length)];
        const coLoc = locations[Math.floor(Math.random() * locations.length)];

        // Check-in time: 08:00 + random 0-30 menit
        const checkinMinutes = Math.floor(Math.random() * 30);
        const checkin = new Date(date);
        checkin.setHours(8, checkinMinutes, 0, 0);

        // Check-out time: checkin + working hours
        const checkout = new Date(checkin);
        checkout.setHours(checkin.getHours() + Math.floor(scenario.hours));
        checkout.setMinutes(checkin.getMinutes() + Math.round((scenario.hours % 1) * 60));

        const workingHours = scenario.hours.toFixed(2);

        absensiData.push({
          date: dateStr,
          nip: peg.nip,
          checkin: checkin,
          ci_latitude: ciLoc.lat,
          ci_longitude: ciLoc.lng,
          checkout: checkout,
          co_latitude: coLoc.lat,
          co_longitude: coLoc.lng,
          working_hours: workingHours,
          status: scenario.status,
          total_overtime: scenario.overtime,
        });

        console.log(`   ✓ ${dateStr} - ${peg.nip} (${peg.nama}): ${workingHours}h - ${scenario.status}${parseFloat(scenario.overtime) > 0 ? ` (${scenario.overtime} jam)` : ''}`);
      }
    }

    // 4. Insert all data
    console.log(`\n4. Inserting ${absensiData.length} absensi records...`);
    
    for (const data of absensiData) {
      await db.insert(absensi).values(data);
    }

    console.log(`   ✓ Successfully inserted ${absensiData.length} records\n`);

    // 5. Summary
    console.log('=== SUMMARY ===');
    console.log(`Total pegawai: ${allPegawai.length}`);
    console.log(`Total days: 10`);
    console.log(`Total records: ${absensiData.length}`);
    console.log(`\nStatus distribution:`);
    
    const statusCount = absensiData.reduce((acc, item) => {
      acc[item.status] = (acc[item.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    Object.entries(statusCount).forEach(([status, count]) => {
      console.log(`  - ${status}: ${count} records`);
    });

    console.log(`\nWorking hours range:`);
    console.log(`  - Minimum: 5.00 jam (Pulang Sebelum Waktunya)`);
    console.log(`  - Maximum: 11.25 jam (Lembur 3 jam)`);
    console.log(`\nOvertime range:`);
    console.log(`  - Maximum: 3.00 jam`);

  } catch (error) {
    console.error('Error seeding absensi:', error);
    throw error;
  }
}

seedAbsensi10Days()
  .then(() => {
    console.log('\n✓ Seeding completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n✗ Seeding failed:', error);
    process.exit(1);
  });
