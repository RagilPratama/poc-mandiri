# API Absensi - Dokumentasi

## Overview
API untuk mengelola data absensi pegawai dengan fitur check-in, check-out, tracking GPS, dan perhitungan otomatis jam kerja, status, dan lembur.

## Endpoints

### 1. Get All Absensi
```
GET /absensi
```

**Query Parameters:**
- `page`: Nomor halaman (default: 1)
- `limit`: Jumlah data per halaman (default: 10, max: 100)
- `nip`: Filter berdasarkan NIP pegawai
- `date_from`: Filter dari tanggal (YYYY-MM-DD)
- `date_to`: Filter sampai tanggal (YYYY-MM-DD)

**Contoh Request:**
```bash
curl 'http://localhost:3000/absensi?page=1&limit=10'
curl 'http://localhost:3000/absensi?nip=00001'
curl 'http://localhost:3000/absensi?date_from=2026-02-10&date_to=2026-02-15'
```

### 2. Get Absensi by ID
```
GET /absensi/:id
```

**Contoh Request:**
```bash
curl 'http://localhost:3000/absensi/1'
```

### 3. Check-in
```
POST /absensi/checkin
```

**Request Body:**
```json
{
  "date": "2026-02-17",
  "nip": "00001",
  "checkin": "2026-02-17T08:00:00Z",
  "ci_latitude": "-6.200000",
  "ci_longitude": "106.816666"
}
```

**Contoh Request:**
```bash
curl -X POST 'http://localhost:3000/absensi/checkin' \
  -H 'Content-Type: application/json' \
  -d '{
    "date": "2026-02-17",
    "nip": "00001",
    "checkin": "2026-02-17T08:00:00Z",
    "ci_latitude": "-6.200000",
    "ci_longitude": "106.816666"
  }'
```

**Catatan:**
- Pegawai hanya bisa check-in 1x per hari
- Status otomatis: "Masih Berjalan"

### 4. Check-out
```
POST /absensi/:id/checkout
```

**Request Body:**
```json
{
  "checkout": "2026-02-17T17:30:00Z",
  "co_latitude": "-6.200000",
  "co_longitude": "106.816666"
}
```

**Contoh Request:**
```bash
curl -X POST 'http://localhost:3000/absensi/1/checkout' \
  -H 'Content-Type: application/json' \
  -d '{
    "checkout": "2026-02-17T17:30:00Z",
    "co_latitude": "-6.200000",
    "co_longitude": "106.816666"
  }'
```

**Perhitungan Otomatis:**
- Working hours: (checkout - checkin) dalam jam
- Status: Berdasarkan working hours
- Total overtime: Jika status = Lembur

### 5. Update Absensi
```
PUT /absensi/:id
```

**Request Body:**
```json
{
  "date": "2026-02-17",
  "checkin": "2026-02-17T08:00:00Z",
  "ci_latitude": "-6.200000",
  "ci_longitude": "106.816666"
}
```

### 6. Delete Absensi by ID
```
DELETE /absensi/:id
```

**Contoh Request:**
```bash
curl -X DELETE 'http://localhost:3000/absensi/1'
```

### 7. Delete Absensi by Date
```
DELETE /absensi/by-date
```

**Request Body:**
```json
{
  "date": "2026-02-17"
}
```

**Contoh Request:**
```bash
curl -X DELETE 'http://localhost:3000/absensi/by-date' \
  -H 'Content-Type: application/json' \
  -d '{"date": "2026-02-17"}'
```

**Catatan:**
- Menghapus SEMUA absensi pada tanggal yang ditentukan
- Berguna untuk menghapus data yang salah input

## Status Absensi

### 1. Masih Berjalan
- Kondisi: Sudah check-in, belum check-out
- Working hours: null
- Total overtime: 0

### 2. Pulang Sebelum Waktunya
- Kondisi: Working hours < 8 jam
- Total overtime: 0

### 3. Tepat Waktu
- Kondisi: Working hours 8 - 8.25 jam
- Total overtime: 0

### 4. Lembur
- Kondisi: Working hours > 8.25 jam
- Total overtime: (working_hours - 8.25) jam

## Koordinat GPS

Setiap absensi menyimpan koordinat GPS terpisah:

**Check-in:**
- `ci_latitude`: Latitude lokasi check-in
- `ci_longitude`: Longitude lokasi check-in

**Check-out:**
- `co_latitude`: Latitude lokasi check-out
- `co_longitude`: Longitude lokasi check-out

**Contoh Koordinat Jakarta:**
- Jakarta Pusat: -6.200000, 106.816666
- Jakarta Timur: -6.175110, 106.865036
- Jakarta Selatan: -6.260000, 106.781666
- Jakarta Utara: -6.138414, 106.813308
- Jakarta Barat: -6.166667, 106.766667

## Dummy Data

Database telah diisi dengan 100 record dummy data:
- 10 pegawai
- 10 hari terakhir (2026-02-08 sampai 2026-02-17)
- Berbagai status:
  - Lembur: 61 records
  - Tepat Waktu: 20 records
  - Pulang Sebelum Waktunya: 19 records
- Working hours: 5.00 jam (minimum) sampai 11.25 jam (maximum)
- Overtime: 0 sampai 3.00 jam

## Response Format

**Success Response:**
```json
{
  "success": true,
  "message": "Data absensi berhasil diambil",
  "data": {
    "id": 1,
    "date": "2026-02-17",
    "nip": "00001",
    "nama": "Budi Santoso",
    "checkin": "2026-02-17T08:00:00.000Z",
    "ci_latitude": "-6.20000000",
    "ci_longitude": "106.81666600",
    "checkout": "2026-02-17T17:30:00.000Z",
    "co_latitude": "-6.20000000",
    "co_longitude": "106.81666600",
    "working_hours": "9.50",
    "status": "Lembur",
    "total_overtime": "1.25",
    "created_at": "2026-02-17T08:00:00.000Z",
    "updated_at": "2026-02-17T17:30:00.000Z"
  },
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10
  }
}
```

**Error Response:**
```json
{
  "success": false,
  "error": "Validation Error",
  "message": "Pegawai sudah check-in hari ini"
}
```

## Business Rules

1. **Check-in:**
   - Hanya bisa 1x per hari per pegawai
   - Status otomatis: "Masih Berjalan"
   - Wajib menyertakan koordinat GPS

2. **Check-out:**
   - Hanya bisa jika sudah check-in
   - Tidak bisa check-out 2x
   - Status dan overtime dihitung otomatis
   - Wajib menyertakan koordinat GPS

3. **Status:**
   - Dihitung otomatis saat check-out
   - Tidak bisa diubah manual
   - Berdasarkan working hours

4. **Overtime:**
   - Hanya dihitung jika status = "Lembur"
   - Format: decimal (jam)
   - Batas normal: 8.25 jam (8 jam 15 menit)

## Testing

Untuk testing API, gunakan:
- Swagger UI: http://localhost:3000/swagger
- Bruno/Postman: Import swagger.json
- cURL: Lihat contoh di atas

## Database Schema

```sql
CREATE TABLE absensi (
  id SERIAL PRIMARY KEY,
  date DATE NOT NULL,
  nip VARCHAR(50) NOT NULL REFERENCES pegawai(nip),
  checkin TIMESTAMP NOT NULL,
  ci_latitude DECIMAL(10, 8) NOT NULL,
  ci_longitude DECIMAL(11, 8) NOT NULL,
  checkout TIMESTAMP,
  co_latitude DECIMAL(10, 8),
  co_longitude DECIMAL(11, 8),
  working_hours DECIMAL(5, 2),
  status VARCHAR(50),
  total_overtime DECIMAL(5, 2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```
