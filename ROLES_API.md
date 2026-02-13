# Roles CRUD API

API untuk mengelola data Role dengan pagination dan search.

## Database Schema

```sql
CREATE TABLE roles (
  id serial PRIMARY KEY NOT NULL,
  level_role varchar(100) NOT NULL,
  nama_role varchar(255) NOT NULL,
  keterangan text,
  created_at timestamp DEFAULT NOW(),
  updated_at timestamp DEFAULT NOW()
);
```

## Endpoints

Base URL: `/api/master/roles`

### 1. Get All Roles (Paginated)

```
GET /api/master/roles?page=1&limit=10&search=admin
```

**Query Parameters:**
- `page` (optional): Nomor halaman, default = 1
- `limit` (optional): Jumlah data per halaman, default = 10
- `search` (optional): Search by nama role

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "level_role": "Kantor Pusat",
      "nama_role": "Kantor Pusat",
      "keterangan": "KP123"
    },
    {
      "id": 5,
      "level_role": "UPT",
      "nama_role": "Unit Pelaksanaan Teknis",
      "keterangan": "UPT Wilayah A"
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

### 2. Get Role by ID

```
GET /api/master/roles/:id
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "level_role": "Kantor Pusat",
    "nama_role": "Kantor Pusat",
    "keterangan": "KP123"
  }
}
```

### 3. Create Role

```
POST /api/master/roles
Content-Type: application/json

{
  "level_role": "UPT",
  "nama_role": "Unit Pelaksanaan Teknis",
  "keterangan": "UPT Wilayah B"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 11,
    "level_role": "UPT",
    "nama_role": "Unit Pelaksanaan Teknis",
    "keterangan": "UPT Wilayah B",
    "created_at": "2026-02-13T09:51:49.009Z",
    "updated_at": "2026-02-13T09:51:49.009Z"
  },
  "message": "Role created successfully"
}
```

### 4. Update Role

```
PUT /api/master/roles/:id
Content-Type: application/json

{
  "level_role": "Lainnya",
  "nama_role": "Administrator",
  "keterangan": "Admin System"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 11,
    "level_role": "Lainnya",
    "nama_role": "Administrator",
    "keterangan": "Admin System",
    "created_at": "2026-02-13T09:51:49.009Z",
    "updated_at": "2026-02-13T10:00:00.000Z"
  },
  "message": "Role updated successfully"
}
```

### 5. Delete Role

```
DELETE /api/master/roles/:id
```

**Response:**
```json
{
  "success": true,
  "message": "Role deleted successfully"
}
```

## Data Dummy yang Sudah Diisi

Berdasarkan gambar UI, sudah diisi 10 data dummy:

| ID | Level Role | Nama Role | Keterangan |
|----|------------|-----------|------------|
| 1-4 | Kantor Pusat | Kantor Pusat | KP123 |
| 5-8 | UPT | Unit Pelaksanaan Teknis | UPT Wilayah A |
| 9-10 | Lainnya | Super Admin | UPT001 |

## Level Role Options

Berdasarkan data yang ada:
- `Kantor Pusat` - Untuk role kantor pusat
- `UPT` - Untuk Unit Pelaksanaan Teknis
- `Lainnya` - Untuk role lainnya seperti Super Admin

## Testing

### Start Server
```bash
bun run dev
```

### Test Endpoints

```bash
# Get all roles
curl "http://localhost:3000/api/master/roles?page=1&limit=10"

# Search roles
curl "http://localhost:3000/api/master/roles?search=admin"

# Get role by ID
curl "http://localhost:3000/api/master/roles/1"

# Create role
curl -X POST "http://localhost:3000/api/master/roles" \
  -H "Content-Type: application/json" \
  -d '{
    "level_role": "UPT",
    "nama_role": "Unit Pelaksanaan Teknis",
    "keterangan": "UPT Wilayah C"
  }'

# Update role
curl -X PUT "http://localhost:3000/api/master/roles/11" \
  -H "Content-Type: application/json" \
  -d '{
    "keterangan": "UPT Wilayah C Updated"
  }'

# Delete role
curl -X DELETE "http://localhost:3000/api/master/roles/11"
```

### Swagger Documentation

Akses: `http://localhost:3000/swagger`

Cari section "Roles" untuk test semua endpoint dengan UI yang user-friendly.

## Files Created

- `src/db/schema/roles.ts` - Database schema
- `src/types/role.ts` - TypeScript types
- `src/repositories/role.repository.ts` - Database operations
- `src/handlers/role.handler.ts` - Request handlers
- `src/routes/role.route.ts` - API routes

## Features

✅ Full CRUD operations
✅ Pagination support
✅ Search by nama role
✅ Input validation
✅ Error handling
✅ Swagger documentation
✅ TypeScript type safety
✅ 10 dummy data sesuai UI
