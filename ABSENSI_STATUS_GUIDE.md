# Panduan Status Absensi & Overtime

## Status Absensi

Sistem absensi memiliki 4 status yang dihitung otomatis saat check-out:

### 1. Masih Berjalan
**Kondisi:** Pegawai sudah check-in tapi belum check-out

**Karakteristik:**
- `checkout`: null
- `working_hours`: null
- `status`: "Masih Berjalan"
- `total_overtime`: 0

**Contoh:**
```json
{
  "id": 1,
  "checkin": "2026-02-17T08:00:00Z",
  "checkout": null,
  "working_hours": null,
  "status": "Masih Berjalan",
  "total_overtime": 0
}
```

### 2. Pulang Sebelum Waktunya
**Kondisi:** Working hours < 8 jam

**Karakteristik:**
- Pegawai pulang sebelum 8 jam kerja
- `status`: "Pulang Sebelum Waktunya"
- `total_overtime`: 0

**Contoh:**
```json
{
  "checkin": "2026-02-17T08:00:00Z",
  "checkout": "2026-02-17T15:30:00Z",
  "working_hours": "7.50",
  "status": "Pulang Sebelum Waktunya",
  "total_overtime": 0
}
```

### 3. Tepat Waktu
**Kondisi:** Working hours >= 8 jam DAN <= 8.25 jam (8 jam 15 menit)

**Karakteristik:**
- Pegawai bekerja sesuai jam kerja normal
- `status`: "Tepat Waktu"
- `total_overtime`: 0

**Contoh:**
```json
{
  "checkin": "2026-02-17T08:00:00Z",
  "checkout": "2026-02-17T16:10:00Z",
  "working_hours": "8.17",
  "status": "Tepat Waktu",
  "total_overtime": 0
}
```

### 4. Lembur
**Kondisi:** Working hours > 8.25 jam

**Karakteristik:**
- Pegawai bekerja lebih dari 8 jam 15 menit
- `status`: "Lembur"
- `total_overtime`: dihitung dalam menit

**Contoh:**
```json
{
  "checkin": "2026-02-17T08:00:00Z",
  "checkout": "2026-02-17T18:00:00Z",
  "working_hours": "10.00",
  "status": "Lembur",
  "total_overtime": 105
}
```

## Perhitungan Overtime

### Formula
```
total_overtime (menit) = (working_hours - 8.25) × 60
```

### Contoh Perhitungan

| Working Hours | Overtime Hours | Total Overtime (menit) | Keterangan |
|--------------|----------------|------------------------|------------|
| 7.50 | 0 | 0 | Pulang Sebelum Waktunya |
| 8.00 | 0 | 0 | Tepat Waktu |
| 8.25 | 0 | 0 | Tepat Waktu (batas atas) |
| 8.50 | 0.25 | 15 | Lembur 15 menit |
| 9.00 | 0.75 | 45 | Lembur 45 menit |
| 9.50 | 1.25 | 75 | Lembur 1 jam 15 menit |
| 10.00 | 1.75 | 105 | Lembur 1 jam 45 menit |
| 11.00 | 2.75 | 165 | Lembur 2 jam 45 menit |

### Konversi Menit ke Jam:Menit

```javascript
function formatOvertime(minutes) {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours} jam ${mins} menit`;
}

// Contoh:
formatOvertime(105); // "1 jam 45 menit"
formatOvertime(165); // "2 jam 45 menit"
```

## Koordinat Check-in & Check-out

Setiap absensi menyimpan koordinat GPS terpisah untuk check-in dan check-out:

### Check-in Coordinates
- `ci_latitude`: Latitude lokasi check-in
- `ci_longitude`: Longitude lokasi check-in

### Check-out Coordinates
- `co_latitude`: Latitude lokasi check-out
- `co_longitude`: Longitude lokasi check-out

### Contoh Penggunaan
```json
{
  "ci_latitude": "-6.200000",
  "ci_longitude": "106.816666",
  "co_latitude": "-6.175110",
  "co_longitude": "106.865036"
}
```

Ini berguna untuk:
- Tracking lokasi pegawai saat masuk dan pulang
- Validasi apakah pegawai berada di lokasi yang benar
- Analisis pola pergerakan pegawai

## API Endpoints

### Check-in
```bash
POST /absensi/checkin
{
  "date": "2026-02-17",
  "nip": "00001",
  "checkin": "2026-02-17T08:00:00Z",
  "ci_latitude": "-6.200000",
  "ci_longitude": "106.816666"
}
```

**Response:**
- Status: "Masih Berjalan"
- Total overtime: 0

### Check-out
```bash
POST /absensi/{id}/checkout
{
  "checkout": "2026-02-17T18:00:00Z",
  "co_latitude": "-6.175110",
  "co_longitude": "106.865036"
}
```

**Response:**
- Status: Otomatis dihitung berdasarkan working hours
- Total overtime: Otomatis dihitung jika lembur

### Get Absensi
```bash
GET /absensi/{id}
GET /absensi?nip=00001&date_from=2026-02-01&date_to=2026-02-28
```

**Response includes:**
- `status`: Status absensi
- `total_overtime`: Total overtime dalam menit
- `ci_latitude`, `ci_longitude`: Koordinat check-in
- `co_latitude`, `co_longitude`: Koordinat check-out

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
   - Format: integer (menit)
   - Batas normal: 8.25 jam (8 jam 15 menit)

## Query Examples

### Filter by Status
```sql
SELECT * FROM absensi WHERE status = 'Lembur';
SELECT * FROM absensi WHERE status = 'Pulang Sebelum Waktunya';
```

### Total Overtime per Pegawai
```sql
SELECT 
  nip,
  SUM(total_overtime) as total_overtime_minutes,
  COUNT(*) as total_lembur_days
FROM absensi 
WHERE status = 'Lembur'
  AND date >= '2026-02-01' 
  AND date <= '2026-02-28'
GROUP BY nip;
```

### Pegawai dengan Overtime Terbanyak
```sql
SELECT 
  a.nip,
  p.nama,
  SUM(a.total_overtime) as total_overtime_minutes
FROM absensi a
JOIN pegawai p ON a.nip = p.nip
WHERE a.status = 'Lembur'
GROUP BY a.nip, p.nama
ORDER BY total_overtime_minutes DESC
LIMIT 10;
```
