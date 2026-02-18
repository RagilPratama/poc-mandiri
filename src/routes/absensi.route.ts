import { Elysia, t } from 'elysia';
import { absensiHandler } from '../handlers/absensi.handler';
import {
  CreateAbsensiSchema,
  CheckoutAbsensiSchema,
  UpdateAbsensiSchema,
  AbsensiQuerySchema,
} from '../types/absensi';

export const absensiRoute = new Elysia({ prefix: '/absensi' })
  .get('/', absensiHandler.getAll, {
    query: AbsensiQuerySchema,
    detail: {
      tags: ['Absensi'],
      summary: 'Get all absensi',
      description: `Menampilkan semua data absensi dengan pagination dan filter.

**Query Parameters:**
- \`page\`: Nomor halaman (default: 1)
- \`limit\`: Jumlah data per halaman (default: 10, max: 100)
- \`date_from\`: Filter dari tanggal (YYYY-MM-DD)
- \`date_to\`: Filter sampai tanggal (YYYY-MM-DD)
- \`search\`: Cari berdasarkan nama atau NIP (LIKE search, case-insensitive)

**Contoh Request:**
\`\`\`
GET /absensi?page=1&limit=10
GET /absensi?search=budi
GET /absensi?search=00001
GET /absensi?date_from=2026-02-10&date_to=2026-02-15
GET /absensi?search=siti&date_from=2026-02-10
\`\`\``,
    },
  })
  .get('/:id', absensiHandler.getById, {
    params: t.Object({
      id: t.String()
    }),
    detail: {
      tags: ['Absensi'],
      summary: 'Get absensi by ID',
      description: 'Menampilkan detail data absensi berdasarkan ID',
    },
  })
  .post('/checkin', absensiHandler.checkin, {
    body: CreateAbsensiSchema,
    type: 'multipart/form-data',
    detail: {
      tags: ['Absensi'],
      summary: 'Check-in dengan foto',
      description: `Membuat record absensi baru (check-in) dengan lokasi GPS dan foto selfie.

**Request Body (multipart/form-data):**
- \`date\`: Tanggal absensi (YYYY-MM-DD)
- \`nip\`: NIP pegawai
- \`checkin\`: Waktu check-in (ISO 8601 timestamp)
- \`ci_latitude\`: Latitude lokasi check-in
- \`ci_longitude\`: Longitude lokasi check-in
- \`checkin_photo\`: File foto selfie (JPG/PNG, max 5MB)

**Contoh Request (cURL):**
\`\`\`bash
curl -X POST 'http://localhost:3000/absensi/checkin' \\
  -F 'date=2026-02-19' \\
  -F 'nip=01928001' \\
  -F 'checkin=2026-02-19T08:00:00Z' \\
  -F 'ci_latitude=-6.200000' \\
  -F 'ci_longitude=106.816666' \\
  -F 'checkin_photo=@/path/to/photo.jpg'
\`\`\`

**Catatan:**
- Pegawai hanya bisa check-in 1x per hari
- Foto wajib diupload (JPG/PNG, max 5MB)
- Foto akan disimpan di ImageKit
- Format checkin: ISO 8601 timestamp (contoh: 2026-02-19T08:00:00Z)
- NIP harus terdaftar di tabel pegawai`,
    },
  })
  .post('/:id/checkout', absensiHandler.checkout, {
    params: t.Object({
      id: t.String()
    }),
    body: CheckoutAbsensiSchema,
    detail: {
      tags: ['Absensi'],
      summary: 'Check-out',
      description: `Update record absensi dengan waktu check-out. Jam kerja akan dihitung otomatis.

**Contoh Request Body:**
\`\`\`json
{
  "checkout": "2026-02-15T17:30:00Z",
  "co_latitude": "-6.200000",
  "co_longitude": "106.816666"
}
\`\`\`

**Catatan:**
- Hanya bisa check-out jika sudah check-in
- Tidak bisa check-out 2x
- Jam kerja dihitung otomatis: (checkout - checkin) dalam jam
- Format checkout: ISO 8601 timestamp (contoh: 2026-02-15T17:30:00Z)
- co_latitude & co_longitude: Lokasi GPS saat check-out
- Format jam kerja: desimal (9.50 = 9 jam 30 menit)

**Status Otomatis:**
- **Masih Berjalan**: Sudah check-in, belum check-out
- **Pulang Sebelum Waktunya**: Working hours < 8 jam
- **Tepat Waktu**: Working hours 8 - 8.25 jam
- **Lembur**: Working hours > 8.25 jam

**Total Overtime:**
- Dihitung otomatis jika status = Lembur
- Format: menit (integer)
- Rumus: (working_hours - 8.25) × 60
- Contoh: 10 jam kerja = (10 - 8.25) × 60 = 105 menit

**Contoh Response:**
\`\`\`json
{
  "success": true,
  "message": "Check-out berhasil",
  "data": {
    "id": 1,
    "working_hours": "10.00",
    "status": "Lembur",
    "total_overtime": 105,
    ...
  }
}
\`\`\``,
    },
  })
  .put('/:id', absensiHandler.update, {
    params: t.Object({
      id: t.String()
    }),
    body: UpdateAbsensiSchema,
    detail: {
      tags: ['Absensi'],
      summary: 'Update absensi',
      description: 'Update data absensi berdasarkan ID (admin only)',
    },
  })
  .delete('/:id', absensiHandler.delete, {
    params: t.Object({
      id: t.String()
    }),
    detail: {
      tags: ['Absensi'],
      summary: 'Delete absensi by ID',
      description: 'Hapus data absensi berdasarkan ID (admin only)',
    },
  })
  .delete('/by-date', absensiHandler.deleteByDate, {
    body: t.Object({
      date: t.String({ format: 'date', description: 'Tanggal absensi (YYYY-MM-DD)' }),
    }),
    detail: {
      tags: ['Absensi'],
      summary: 'Delete absensi by date',
      description: `Hapus semua data absensi pada tanggal tertentu (admin only).

**Contoh Request Body:**
\`\`\`json
{
  "date": "2026-02-15"
}
\`\`\`

**Catatan:**
- Menghapus SEMUA absensi pada tanggal yang ditentukan
- Berguna untuk menghapus data absensi yang salah input di hari tertentu
- Hanya admin yang bisa menggunakan endpoint ini
- Akan mengembalikan jumlah data yang dihapus`,
    },
  });
