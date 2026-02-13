# Migration: Fix Database Relations

## Overview
Migration untuk memperbaiki konsistensi relasi database antara UPT, Penyuluh, dan Kelompok Nelayan.

## Changes Made

### 1. UPT (Unit Pelaksanaan Teknis)
**Before:**
- Column: `regencies_id` (FK to regencies table)
- Level: Kabupaten/Kota

**After:**
- Column: `province_id` (FK to provinces table)
- Level: Provinsi

**Reason:** Konsistensi dengan penyuluh dan kelompok_nelayan yang menggunakan province level.

### 2. Kelompok Nelayan - Penyuluh Relation
**Before:**
- `penyuluh_id` → FK to `pegawai.id`
- Problem: Bisa reference pegawai yang bukan penyuluh

**After:**
- `penyuluh_id` → FK to `penyuluh.id`
- Benefit: Data integrity lebih baik, hanya bisa reference penyuluh aktif

## Migration Steps

### 1. Data Analysis
```bash
bun run scripts/migrate-relations.ts
```
Output:
- 2 UPT records mapped successfully
- 10 Kelompok Nelayan records mapped successfully
- All mappings valid ✓

### 2. Database Migration
```bash
cat drizzle/0005_fix_relations.sql | psql $DATABASE_URL
```

Migration includes:
1. Drop FK constraints
2. Update data (map regency → province, pegawai → penyuluh)
3. Rename column (regencies_id → province_id)
4. Add new FK constraints

### 3. Code Updates
Updated files:
- `src/db/schema/unit_pelaksanaan_teknis.ts` - schema definition
- `src/db/schema/kelompok_nelayan.ts` - schema definition
- `src/types/unit-pelaksanaan-teknis.ts` - TypeScript types
- `src/repositories/unit-pelaksanaan-teknis.repository.ts` - queries
- `src/repositories/kelompok-nelayan.repository.ts` - queries with proper joins
- `src/routes/unit-pelaksanaan-teknis.route.ts` - API validation

## Testing Results

### UPT Endpoints
✓ GET /api/master/unit-pelaksanaan-teknis - Returns province_id and province name
✓ GET /api/master/unit-pelaksanaan-teknis/:id - Returns correct province data
✓ POST /api/master/unit-pelaksanaan-teknis - Accepts province_id
✓ PUT /api/master/unit-pelaksanaan-teknis/:id - Updates with province_id

### Kelompok Nelayan Endpoints
✓ GET /kelompok-nelayan - Returns penyuluh data correctly
✓ GET /kelompok-nelayan/:id - Shows penyuluh name and NIP
✓ POST /kelompok-nelayan - Validates penyuluh_id (must exist in penyuluh table)
✓ FK constraint works - Rejects invalid penyuluh_id

### Penyuluh Endpoints
✓ GET /penyuluh - Shows UPT and province data correctly
✓ All relations working properly

## Database Schema After Migration

```
unit_pelaksanaan_teknis
├── id (PK)
├── nama_organisasi
├── pimpinan
└── province_id (FK → provinces.id) ✓ CHANGED

penyuluh
├── id (PK)
├── pegawai_id (FK → pegawai.id)
├── upt_id (FK → unit_pelaksanaan_teknis.id)
├── province_id (FK → provinces.id)
├── jumlah_kelompok
├── program_prioritas
└── status_aktif

kelompok_nelayan
├── id (PK)
├── nib_kelompok
├── no_registrasi
├── nama_kelompok
├── nik_ketua
├── nama_ketua
├── upt_id (FK → unit_pelaksanaan_teknis.id)
├── province_id (FK → provinces.id)
├── penyuluh_id (FK → penyuluh.id) ✓ CHANGED
├── gabungan_kelompok_id (FK → kelompok_nelayan.id)
└── jumlah_anggota
```

## Benefits

1. **Consistency**: All entities (UPT, Penyuluh, Kelompok Nelayan) now use province level
2. **Data Integrity**: Kelompok Nelayan can only reference valid penyuluh records
3. **Simplified Queries**: Easier to join and filter by province
4. **Better Validation**: FK constraints prevent invalid data entry

## Rollback (if needed)

```bash
cat drizzle/0005_rollback.sql | psql $DATABASE_URL
```

Note: Rollback will restore old structure but data will be in province format. Additional data migration needed to restore regency IDs.
