# Organisasi CRUD API

API untuk mengelola data Organisasi dengan pagination dan search.

## Database Schema

```sql
CREATE TABLE organisasi (
  id serial PRIMARY KEY NOT NULL,
  level_organisasi varchar(100) NOT NULL,
  kode_organisasi varchar(50) NOT NULL,
  nama_organisasi varchar(255) NOT NULL,
  keterangan text,
  created_at timestamp DEFAULT NOW(),
  updated_at timestamp DEFAULT NOW()
);
```

## Endpoints

Base URL: `/api/master/organisasi`

### 1. Get All Organisasi (Paginated)

```
GET /api/master/organisasi?page=1&limit=10&search=pusat
```

**Query Parameters:**
- `page` (optional): Nomor halaman, default = 1
- `limit` (optional): Jumlah data per halaman, default = 10
- `search` (optional): Search by nama, kode, or level organisasi

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "level_organisasi": "Kantor Pusat",
      "kode_organisasi": "KP123",
      "nama_organisasi": "Kantor Pusat 123",
      "keterangan": "KP123"
    },
    {
      "id": 6,
      "level_organisasi": "Unit Pelaksanaan Teknis",
      "kode_organisasi": "UPT001",
      "nama_organisasi": "UPT Wilayah A",
      "keterangan": "UPT001"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 10,
    "totalPages": 1
  }
}
```

### 2. Get Organisasi by ID

```
GET /api/master/organisasi/:id
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "level_organisasi": "Kantor Pusat",
    "kode_organisasi": "KP123",
    "nama_organisasi": "Kantor Pusat 123",
    "keterangan": "KP123"
  }
}
```

### 3. Create Organisasi

```
POST /api/master/organisasi
Content-Type: application/json

{
  "level_organisasi": "Unit Pelaksanaan Teknis",
  "kode_organisasi": "UPT002",
  "nama_organisasi": "UPT Wilayah B",
  "keterangan": "UPT Wilayah B - Jakarta"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 11,
    "level_organisasi": "Unit Pelaksanaan Teknis",
    "kode_organisasi": "UPT002",
    "nama_organisasi": "UPT Wilayah B",
    "keterangan": "UPT Wilayah B - Jakarta",
    "created_at": "2026-02-13T10:01:39.798Z",
    "updated_at": "2026-02-13T10:01:39.798Z"
  },
  "message": "Organisasi created successfully"
}
```

### 4. Update Organisasi

```
PUT /api/master/organisasi/:id
Content-Type: application/json

{
  "nama_organisasi": "UPT Wilayah B Updated",
  "keterangan": "UPT Wilayah B - Jakarta Selatan"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 11,
    "level_organisasi": "Unit Pelaksanaan Teknis",
    "kode_organisasi": "UPT002",
    "nama_organisasi": "UPT Wilayah B Updated",
    "keterangan": "UPT Wilayah B - Jakarta Selatan",
    "created_at": "2026-02-13T10:01:39.798Z",
    "updated_at": "2026-02-13T10:05:00.000Z"
  },
  "message": "Organisasi updated successfully"
}
```

### 5. Delete Organisasi

```
DELETE /api/master/organisasi/:id
```

**Response:**
```json
{
  "success": true,
  "message": "Organisasi deleted successfully"
}
```

## Data Dummy yang Sudah Diisi

Berdasarkan gambar UI, sudah diisi 10 data dummy:

| ID | Level Organisasi | Kode | Nama Organisasi | Keterangan |
|----|------------------|------|-----------------|------------|
| 1-4 | Kantor Pusat | KP123 | Kantor Pusat 123 | KP123 |
| 5 | Kantor Pusat | UPT001 | UPT Wilayah A | UPT001 |
| 6-10 | Unit Pelaksanaan Teknis | UPT001 | UPT Wilayah A | UPT001 |

## Level Organisasi Options

Berdasarkan data yang ada:
- `Kantor Pusat` - Untuk organisasi kantor pusat
- `Unit Pelaksanaan Teknis` - Untuk UPT di berbagai wilayah

## Search Feature

Search akan mencari di 3 kolom:
- `nama_organisasi` - Nama organisasi
- `kode_organisasi` - Kode organisasi
- `level_organisasi` - Level organisasi

Contoh:
```bash
# Search "pusat" - akan cari di semua kolom
curl "http://localhost:3000/api/master/organisasi?search=pusat"

# Search "UPT" - akan cari di semua kolom
curl "http://localhost:3000/api/master/organisasi?search=UPT"

# Search "KP123" - akan cari di semua kolom
curl "http://localhost:3000/api/master/organisasi?search=KP123"
```

## Testing

### Start Server
```bash
bun run dev
```

### Test Endpoints

```bash
# Get all organisasi
curl "http://localhost:3000/api/master/organisasi?page=1&limit=10"

# Search organisasi
curl "http://localhost:3000/api/master/organisasi?search=wilayah"

# Get organisasi by ID
curl "http://localhost:3000/api/master/organisasi/1"

# Create organisasi
curl -X POST "http://localhost:3000/api/master/organisasi" \
  -H "Content-Type: application/json" \
  -d '{
    "level_organisasi": "Unit Pelaksanaan Teknis",
    "kode_organisasi": "UPT003",
    "nama_organisasi": "UPT Wilayah C",
    "keterangan": "UPT Wilayah C - Bandung"
  }'

# Update organisasi
curl -X PUT "http://localhost:3000/api/master/organisasi/11" \
  -H "Content-Type: application/json" \
  -d '{
    "keterangan": "UPT Wilayah C - Bandung Updated"
  }'

# Delete organisasi
curl -X DELETE "http://localhost:3000/api/master/organisasi/11"
```

### Swagger Documentation

Akses: `http://localhost:3000/swagger`

Cari section "Organisasi" untuk test semua endpoint dengan UI yang user-friendly.

## Files Created

- `src/db/schema/organisasi.ts` - Database schema
- `src/types/organisasi.ts` - TypeScript types
- `src/repositories/organisasi.repository.ts` - Database operations
- `src/handlers/organisasi.handler.ts` - Request handlers
- `src/routes/organisasi.route.ts` - API routes

## Features

✅ Full CRUD operations
✅ Pagination support
✅ Multi-column search (nama, kode, level)
✅ Input validation
✅ Error handling
✅ Swagger documentation
✅ TypeScript type safety
✅ 10 dummy data sesuai UI

## Integration dengan UI

Halaman ini digunakan untuk mengatur informasi rekening terdiri dari organisasi. Data organisasi ini kemungkinan akan digunakan sebagai referensi untuk:
- Mapping user ke organisasi
- Filtering data berdasarkan organisasi
- Hierarchy organisasi (Kantor Pusat → UPT)
