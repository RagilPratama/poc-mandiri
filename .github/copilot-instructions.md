# Copilot Instructions for POC Mandiri

This is a **Bun-based backend API** for fisheries data management, built with Elysia.js. It uses PostgreSQL for persistence, Redis for caching, Clerk for authentication, and ImageKit for file storage.

## Build, Test & Run

### Development & Testing
```bash
bun run dev           # Start dev server with watch mode (port 3000)
bun test              # Run test suite
bun run start         # Start production server
```

### Database Management
```bash
bun run db:generate   # Generate Drizzle migrations from schema changes
bun run db:migrate    # Apply pending migrations to database
bun run db:studio     # Open Drizzle Studio (GUI for browsing database)
```

### Seeding
```bash
bun run seed:pegawai              # Seed employee data
bun run seed:kelompok-nelayan     # Seed fishermen groups
bun run seed:penyuluh             # Seed extension officers
bun run seed:iku-iki              # Seed performance indicators
```

**Note:** No build step is needed—Bun runs TypeScript directly.

## Architecture

### Layered Pattern
```
routes → handlers → repositories → db/index.ts
```

**routes/** (e.g., `pegawai.route.ts`)
- Defines REST endpoints
- Validates input using TypeBox schemas (or Elysia's `t` helper)
- Tags endpoints for Swagger documentation
- Mounts auth middleware where needed

**handlers/** (e.g., `pegawai.handler.ts`)
- Plain objects (not classes) containing async request handlers
- Business logic & orchestration
- Calls repositories and logs activity
- Formats responses using helpers from `src/utils/response.ts`

**repositories/** (e.g., `pegawai.repository.ts`)
- Class-based data access layer
- Wraps Drizzle queries
- Receives typed parameters
- Handles pagination, filtering, sorting

**db/index.ts**
- Exports the Drizzle instance (`db`) and pg Pool (`pool`)
- Connection strings come from `DATABASE_URL` env var

### Database & Schema
- **PostgreSQL** via `pg` Pool (max 3 connections)
- **Drizzle ORM** for migrations and queries
- Schemas in `src/db/schema/` follow prefixes:
  - `mst_*` for master data tables
  - `trx_*` for transaction/event tables

### Caching & Auth
- **Redis**: Caches regional data (provinces, regencies, districts, villages) using keys from `src/constants/cache.ts`
- **Clerk**: Handles user authentication; user context available as `ctx.user` after `authMiddleware`
- **ImageKit**: Handles file uploads via `src/utils/imagekit.ts`

## Key Conventions

### File Naming
Use kebab-case with suffixes:
- `pegawai.handler.ts`
- `pegawai.route.ts`
- `pegawai.repository.ts`

### Response Format
Always use helpers from `src/utils/response.ts`:
```typescript
// Single response
successResponse('Success message', data)

// Paginated response
successResponseWithPagination('Success message', items, { page, perPage, total })
```

Response structure: `{ responseCode: "2000000", responseMessage: "Success", message, data?, pagination? }`

### Types & Validation
Define TypeBox schemas in `src/types/` with exported types:
```typescript
export const CreatePegawaiSchema = Type.Object({ name: Type.String(), ... });
export type CreatePegawaiType = Static<typeof CreatePegawaiSchema>;
```

Not all entities have dedicated type files—simple endpoints may define validation inline at the route.

### Handler Pattern
```typescript
export const pegawaiHandler = {
  async getAll({ query }: Context<{ query: PegawaiQueryType }>) {
    // Call repository, format response
  },
  async create({ body, headers, request, path }: Context<{ body: CreatePegawaiType }>) {
    // Create resource, log activity, return response
  },
};
```

### Repository Pattern
```typescript
export class PegawaiRepository {
  async findAll(query: PegawaiQueryType) { /* Drizzle query */ }
  async findById(id: number) { /* Drizzle query */ }
  async create(data: CreatePegawaiType) { /* Drizzle insert */ }
}

// In handler
const repo = new PegawaiRepository();
const result = await repo.findAll(query);
```

### Activity Logging
Every CREATE/UPDATE/DELETE mutation must log activity:
```typescript
import { logActivitySimple } from '../utils/activity-logger';

await logActivitySimple({
  context: { headers, request, path },
  aktivitas: 'CREATE', // 'CREATE' | 'UPDATE' | 'DELETE' | 'LOGIN' | 'LOGOUT' | 'VIEW'
  modul: 'PEGAWAI',
  deskripsi: 'Deskripsi aksi...',
  data_baru: result,   // for CREATE/UPDATE
  data_lama: existing, // for UPDATE/DELETE
});
```

Also log errors with `status: 'ERROR'` and `error_message`.

### Cache Keys
Use constants from `src/constants/cache.ts`:
```typescript
CACHE_KEYS.PROVINCES.ALL
CACHE_KEYS.PROVINCES.BY_ID(id)
CACHE_TTL.DEFAULT  // 86400 (24 hours)
CACHE_TTL.SHORT    // 3600 (1 hour)
CACHE_TTL.LONG     // 604800 (7 days)
```

Caching is currently only used for regional data (provinces, regencies, districts, villages).

### Auth Middleware
```typescript
import { authMiddleware } from '../middlewares/auth.middleware';

new Elysia({ prefix: '/protected' })
  .use(authMiddleware)
  .get('/', ({ user }) => ({ user }))
```

After middleware is applied, user context is available as `ctx.user`.

## Important Notes

- **CORS**: Currently set to `origin: true` (allow all)—suitable for development only
- **Elysia version**: Pinned to `"latest"` in package.json; consider specifying an exact version for stability
- **Language consistency**: Some routes use English names (province, district), others use Indonesian (penyuluh, nelayan)—naming is not fully consistent
- **Type coverage**: Not all entities have dedicated type files yet
- **Redis config**: Currently in `src/redis.ts`; consider moving to `src/config/`
- **Graceful shutdown**: SIGTERM/SIGINT handlers are in `src/index.ts`—do not add duplicate handlers in other files
