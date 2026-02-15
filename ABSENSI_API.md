# Absensi API Documentation

API untuk mengelola data absensi pegawai dengan fitur check-in, check-out, dan perhitungan jam kerja otomatis.

## Base URL
```
http://localhost:3000/absensi
```

## Features
- ✅ Check-in dengan lokasi GPS (latitude, longitude)
- ✅ Check-out dengan perhitungan jam kerja otomatis
- ✅ Validasi: tidak bisa check-in 2x di hari yang sama
- ✅ Validasi: tidak bisa check-out 2x
- ✅ Filter by NIP, date range
- ✅ Pagination support
- ✅ Join dengan data pegawai (nama)

## Endpoints

### 1. Check-in (Create Absensi)
**POST** `/absensi/checkin`

Create new attendance record with check-in time and location.

**Request Body:**
```json
{
  "date": "2026-02-15",
  "nip": "00001",
  "checkin": "2026-02-15T08:00:00Z",
  "latitude": "-6.200000",
  "longitude": "106.816666"
}
```

**Response Success (201):**
```json
{
  "success": true,
  "message": "Check-in berhasil",
  "data": {
    "id": 1,
    "date": "2026-02-15",
    "nip": "00001",
    "checkin": "2026-02-15T08:00:00.000Z",
    "checkout": null,
    "working_hours": null,
    "latitude": "-6.20000000",
    "longitude": "106.81666600",
    "created_at": "2026-02-15T08:36:50.003Z",
    "updated_at": "2026-02-15T08:36:50.003Z"
  }
}
```

**Response Error - Already Checked In (400):**
```json
{
  "success": false,
  "message": "Sudah melakukan check-in hari ini"
}
```

### 2. Check-out
**POST** `/absensi/:id/checkout`

Update attendance record with check-out time. Working hours will be calculated automatically.

**Request Body:**
```json
{
  "checkout": "2026-02-15T17:30:00Z",
  "latitude": "-6.200000",
  "longitude": "106.816666"
}
```

**Response Success (200):**
```json
{
  "success": true,
  "message": "Check-out berhasil",
  "data": {
    "id": 1,
    "date": "2026-02-15",
    "nip": "00001",
    "checkin": "2026-02-15T08:00:00.000Z",
    "checkout": "2026-02-15T17:30:00.000Z",
    "working_hours": "9.50",
    "latitude": "-6.20000000",
    "longitude": "106.81666600",
    "created_at": "2026-02-15T08:36:50.003Z",
    "updated_at": "2026-02-15T08:37:10.002Z"
  }
}
```

**Response Error - Already Checked Out (400):**
```json
{
  "success": false,
  "message": "Sudah melakukan check-out"
}
```

### 3. Get All Absensi
**GET** `/absensi`

Get all attendance records with pagination and filters.

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10, max: 100)
- `nip` (optional): Filter by employee NIP
- `date_from` (optional): Filter from date (YYYY-MM-DD)
- `date_to` (optional): Filter to date (YYYY-MM-DD)

**Example Requests:**
```bash
# Get all with pagination
GET /absensi?page=1&limit=10

# Filter by NIP
GET /absensi?nip=00001

# Filter by date range
GET /absensi?date_from=2026-02-10&date_to=2026-02-15

# Combine filters
GET /absensi?nip=00001&date_from=2026-02-10&date_to=2026-02-12
```

**Response Success (200):**
```json
{
  "success": true,
  "message": "Data absensi berhasil diambil",
  "data": [
    {
      "id": 1,
      "date": "2026-02-15",
      "nip": "00001",
      "nama": "Budi Santoso",
      "checkin": "2026-02-15T08:00:00.000Z",
      "checkout": "2026-02-15T17:30:00.000Z",
      "working_hours": "9.50",
      "latitude": "-6.20000000",
      "longitude": "106.81666600",
      "created_at": "2026-02-15T08:36:50.003Z",
      "updated_at": "2026-02-15T08:37:10.002Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 1,
    "totalPages": 1
  }
}
```

### 4. Get Absensi by ID
**GET** `/absensi/:id`

Get attendance record detail by ID.

**Response Success (200):**
```json
{
  "success": true,
  "message": "Data absensi berhasil diambil",
  "data": {
    "id": 1,
    "date": "2026-02-15",
    "nip": "00001",
    "nama": "Budi Santoso",
    "checkin": "2026-02-15T08:00:00.000Z",
    "checkout": "2026-02-15T17:30:00.000Z",
    "working_hours": "9.50",
    "latitude": "-6.20000000",
    "longitude": "106.81666600",
    "created_at": "2026-02-15T08:36:50.003Z",
    "updated_at": "2026-02-15T08:37:10.002Z"
  }
}
```

**Response Error - Not Found (404):**
```json
{
  "success": false,
  "message": "Data absensi tidak ditemukan"
}
```

### 5. Update Absensi
**PUT** `/absensi/:id`

Update attendance record (admin only).

**Request Body:**
```json
{
  "date": "2026-02-15",
  "checkin": "2026-02-15T08:00:00Z",
  "checkout": "2026-02-15T17:00:00Z",
  "latitude": "-6.200000",
  "longitude": "106.816666"
}
```

**Response Success (200):**
```json
{
  "success": true,
  "message": "Data absensi berhasil diupdate",
  "data": {
    "id": 1,
    "date": "2026-02-15",
    "nip": "00001",
    "checkin": "2026-02-15T08:00:00.000Z",
    "checkout": "2026-02-15T17:00:00.000Z",
    "working_hours": "9.00",
    "latitude": "-6.20000000",
    "longitude": "106.81666600",
    "created_at": "2026-02-15T08:36:50.003Z",
    "updated_at": "2026-02-15T08:40:00.000Z"
  }
}
```

### 6. Delete Absensi
**DELETE** `/absensi/:id`

Delete attendance record (admin only).

**Response Success (200):**
```json
{
  "success": true,
  "message": "Data absensi berhasil dihapus"
}
```

## Database Schema

```sql
CREATE TABLE "absensi" (
  "id" serial PRIMARY KEY,
  "date" date NOT NULL,
  "nip" varchar(50) NOT NULL,
  "checkin" timestamp NOT NULL,
  "checkout" timestamp,
  "working_hours" numeric(5, 2),
  "latitude" numeric(10, 8) NOT NULL,
  "longitude" numeric(11, 8) NOT NULL,
  "created_at" timestamp DEFAULT now(),
  "updated_at" timestamp DEFAULT now(),
  FOREIGN KEY ("nip") REFERENCES "pegawai"("nip")
);

-- Indexes for performance
CREATE INDEX "idx_absensi_nip" ON "absensi" ("nip");
CREATE INDEX "idx_absensi_date" ON "absensi" ("date");
CREATE INDEX "idx_absensi_nip_date" ON "absensi" ("nip", "date");
```

## Business Rules

1. **Check-in Rules:**
   - Pegawai hanya bisa check-in 1x per hari
   - Harus menyertakan lokasi GPS (latitude, longitude)
   - NIP harus valid (ada di tabel pegawai)

2. **Check-out Rules:**
   - Hanya bisa check-out jika sudah check-in
   - Tidak bisa check-out 2x
   - Working hours dihitung otomatis: `(checkout - checkin) dalam jam`

3. **Working Hours Calculation:**
   - Format: decimal dengan 2 digit (contoh: 9.50 = 9 jam 30 menit)
   - Dihitung otomatis saat check-out
   - Formula: `(checkout_time - checkin_time) / 3600000 milliseconds`

## Example Usage Flow

### Daily Attendance Flow
```bash
# 1. Employee checks in at 8:00 AM
curl -X POST http://localhost:3000/absensi/checkin \
  -H "Content-Type: application/json" \
  -d '{
    "date": "2026-02-15",
    "nip": "00001",
    "checkin": "2026-02-15T08:00:00Z",
    "latitude": "-6.200000",
    "longitude": "106.816666"
  }'

# 2. Employee checks out at 5:30 PM
curl -X POST http://localhost:3000/absensi/1/checkout \
  -H "Content-Type: application/json" \
  -d '{
    "checkout": "2026-02-15T17:30:00Z",
    "latitude": "-6.200000",
    "longitude": "106.816666"
  }'

# 3. View attendance history
curl "http://localhost:3000/absensi?nip=00001&date_from=2026-02-01&date_to=2026-02-28"
```

## Testing

Run seed script to populate test data:
```bash
bun run scripts/seed-absensi.ts
```

This will create 8 attendance records for testing purposes.

## Notes

- All timestamps are in ISO 8601 format (UTC)
- Latitude: -90 to 90 (8 decimal places)
- Longitude: -180 to 180 (8 decimal places)
- Working hours stored as decimal (precision 5, scale 2)
- Date format: YYYY-MM-DD
