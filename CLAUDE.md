# CLAUDE.md — POC Mandiri

## Tech Stack
- **Runtime**: Bun (>=1.0.0)
- **Framework**: Elysia.js
- **Database**: PostgreSQL via `pg` Pool + Drizzle ORM
- **Cache**: Redis (`redis` package)
- **Auth**: Clerk (`@clerk/backend`)
- **File Storage**: ImageKit
- **API Docs**: Swagger (`@elysiajs/swagger`)

## Perintah Penting
```bash
bun run dev           # dev server dengan watch mode
bun run start         # production server
bun run db:generate   # generate migrasi Drizzle dari schema
bun run db:migrate    # jalankan migrasi ke database
bun run db:studio     # buka Drizzle Studio (GUI database)

bun run seed:pegawai
bun run seed:kelompok-nelayan
bun run seed:penyuluh
```

## Struktur Project
```
src/
├── config/           # clerk.ts, env.ts
├── constants/        # cache.ts (CACHE_KEYS, CACHE_TTL)
├── db/
│   ├── index.ts      # pg Pool + Drizzle instance (export: db, pool)
│   └── schema/       # semua schema Drizzle
│       ├── mst_*.ts  # master data
│       └── trx_*.ts  # transaksi
├── handlers/         # request logic (plain object, bukan class)
├── middlewares/      # authMiddleware, optionalAuthMiddleware
├── repositories/     # query DB (class)
├── routes/           # definisi endpoint + validasi schema
│   └── index.ts      # re-export semua routes
├── types/            # TypeBox schema + Static types (belum semua entitas punya)
├── utils/
│   ├── activity-logger.ts  # logActivity, logActivitySimple
│   ├── cache-warmer.ts     # warmup Redis saat startup
│   ├── imagekit.ts         # upload file ke ImageKit
│   ├── logger.ts           # formatSqlQuery, dumpQuery, dumpResult
│   └── response.ts         # successResponse, successResponseWithPagination
├── redis.ts          # koneksi Redis (connectRedis, disconnectRedis)
└── index.ts          # entry point, register semua routes, global error handler
```

## Arsitektur Layered
```
routes/ → handlers/ → repositories/ → db/index.ts
```
- **routes**: definisi endpoint, validasi input (TypeBox schema), tag Swagger
- **handlers**: business logic, memanggil repository, format response, logging aktivitas
- **repositories**: query Drizzle, class-based, menerima typed params
- **db/index.ts**: export `db` (Drizzle instance) dan `pool` (pg Pool)

## Konvensi Kode

### Penamaan File
- Kebab-case dengan suffix: `pegawai.handler.ts`, `pegawai.route.ts`, `pegawai.repository.ts`
- Schema DB: prefix `mst_` untuk master data, `trx_` untuk transaksi

### Types (src/types/)
Gunakan TypeBox (`@sinclair/typebox`), export Schema dan Static type:
```ts
export const CreatePegawaiSchema = Type.Object({ ... });
export type CreatePegawaiType = Static<typeof CreatePegawaiSchema>;
```
Tidak semua entitas punya type file — beberapa entitas simple mendefinisikan validasi langsung di route dengan `t` dari Elysia.

### Response Format
Selalu gunakan helper dari `src/utils/response.ts`:
```ts
successResponse('Pesan sukses', data)
successResponseWithPagination('Pesan sukses', data, pagination)
```
Format response: `{ responseCode: "2000000", responseMessage: "Success", message, data?, pagination? }`

### Handler Pattern
Handler adalah plain object (bukan class), langsung dipakai di route:
```ts
export const pegawaiHandler = {
  async getAll({ query }: Context<{ query: PegawaiQueryType }>) { ... },
  async create({ body, headers, request, path }: Context<{ body: CreatePegawaiType }>) { ... },
};
```

### Repository Pattern
Repository adalah class:
```ts
export class PegawaiRepository {
  async findAll(query: PegawaiQueryType) { ... }
  async findById(id: number) { ... }
  async create(data: CreatePegawaiType) { ... }
}
const pegawaiRepo = new PegawaiRepository(); // instantiate di handler
```

### Activity Logging
Setiap mutasi (CREATE/UPDATE/DELETE) harus log aktivitas:
```ts
import { logActivitySimple } from '../utils/activity-logger';

await logActivitySimple({
  context: { headers, request, path },
  aktivitas: 'CREATE', // 'CREATE' | 'UPDATE' | 'DELETE' | 'LOGIN' | 'LOGOUT' | 'VIEW'
  modul: 'PEGAWAI',
  deskripsi: 'Deskripsi aksi...',
  data_baru: result,   // untuk CREATE/UPDATE
  data_lama: existing, // untuk UPDATE/DELETE
});
```
Log juga saat error dengan `status: 'ERROR'` dan `error_message`.

### Cache Keys
Gunakan konstanta dari `src/constants/cache.ts`:
```ts
CACHE_KEYS.PROVINCES.ALL
CACHE_KEYS.PROVINCES.BY_ID(id)
CACHE_TTL.DEFAULT // 86400 (24 jam)
CACHE_TTL.SHORT   // 3600 (1 jam)
CACHE_TTL.LONG    // 604800 (7 hari)
```
Cache hanya dipakai untuk data wilayah (provinsi, kabupaten, kecamatan, desa).

### Auth Middleware
```ts
import { authMiddleware } from '../middlewares/auth.middleware';
// Pasang di route yang butuh autentikasi
new Elysia({ prefix: '/endpoint' }).use(authMiddleware).get(...)
```
User tersedia di context sebagai `ctx.user` setelah middleware dipasang.

## Environment Variables
```
PORT=
DATABASE_URL=
REDIS_HOST=
REDIS_PORT=
REDIS_PASSWORD=
REDIS_URL=
CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
IMAGEKIT_PUBLIC_KEY=
IMAGEKIT_PRIVATE_KEY=
IMAGEKIT_URL_ENDPOINT=
```

## Hal yang Perlu Diperhatikan
- **CORS**: saat ini `origin: true` (allow all) — hanya cocok untuk development
- **Dependency**: `"elysia": "latest"` di package.json belum di-pin ke versi spesifik
- **Naming bahasa**: sebagian route masih pakai nama Inggris (province, district, regency, village), sisanya Indonesia — belum konsisten
- **Types folder**: belum semua entitas punya type file (misalnya bantuan, kapal, komoditas)
- **redis.ts**: masih di root `src/`, belum dipindah ke `src/config/`
- **Pool size**: max 3 koneksi — pertimbangkan naikkan jika load tinggi
- **Graceful shutdown**: SIGTERM/SIGINT handler ada di `src/index.ts`, jangan tambah lagi di file lain
