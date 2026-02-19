# Database Restructure - Requirements

## 1. Overview

Restructure database schema to follow new naming convention and add new tables for fisheries management system. This includes renaming existing tables, adding new columns, and creating new master and transaction tables.

## 2. User Stories

### 2.1 As a developer
I want all database tables to follow consistent naming convention (mst_* for master data, trx_* for transactions) so that the database structure is more organized and easier to understand.

### 2.2 As a system administrator
I want to preserve existing data during the migration so that no data is lost during the restructure process.

### 2.3 As a developer
I want new tables for fisheries operations (production, assistance, training, certification) so that the system can track complete fisheries activities.

### 2.4 As a developer
I want enhanced pegawai, penyuluh, and kelompok_nelayan tables with additional fields so that we can store more detailed information.

## 3. Acceptance Criteria

### 3.1 Table Renaming
- [ ] All existing tables are renamed to follow new convention
- [ ] All foreign key relationships are maintained after rename
- [ ] All indexes are preserved after rename
- [ ] Existing data is not lost during rename

### 3.2 Column Additions to Existing Tables
- [ ] mst_pegawai has new columns: no_hp, alamat, foto_url, tanggal_lahir, jenis_kelamin, pendidikan_terakhir, tanggal_bergabung
- [ ] mst_penyuluh has new columns: wilayah_binaan, spesialisasi
- [ ] mst_kelompok_nelayan has new columns: jenis_usaha_id, alamat, no_hp_ketua, tahun_berdiri, status_kelompok, luas_lahan, koordinat_latitude, koordinat_longitude
- [ ] trx_absensi has new columns: keterangan, foto_checkout_url, foto_checkout_id

### 3.3 New Master Tables
- [ ] mst_jenis_usaha table created with proper structure
- [ ] mst_komoditas table created with proper structure
- [ ] mst_alat_tangkap table created with proper structure
- [ ] mst_kapal table created with proper structure
- [ ] mst_jenis_bantuan table created with proper structure
- [ ] mst_jenis_pelatihan table created with proper structure
- [ ] mst_jenis_sertifikasi table created with proper structure

### 3.4 New Transaction Tables
- [ ] trx_produksi_hasil_tangkapan table created with proper structure
- [ ] trx_bantuan table created with proper structure
- [ ] trx_pelatihan table created with proper structure
- [ ] trx_sertifikasi table created with proper structure

### 3.5 Schema Files Update
- [ ] All schema files updated with new table names
- [ ] All schema files updated with new columns
- [ ] New schema files created for new tables
- [ ] All foreign key relationships properly defined

### 3.6 Repository Layer Update
- [ ] All existing repositories updated with new table names
- [ ] New repositories created for new tables
- [ ] All queries updated to use new table/column names

### 3.7 Handler Layer Update
- [ ] All existing handlers updated to work with new structure
- [ ] New handlers created for new tables with CRUD operations

### 3.8 Route Layer Update
- [ ] All existing routes updated with new structure
- [ ] New routes created for new tables

### 3.9 Type Definitions Update
- [ ] All existing types updated with new fields
- [ ] New types created for new tables

### 3.10 API Compatibility
- [ ] All existing API endpoints continue to work
- [ ] Response format remains consistent (responseCode: "2000000")
- [ ] Pagination works correctly for all endpoints
- [ ] Search/filter functionality works correctly

## 4. Table Mapping

### 4.1 Existing Tables Rename
| Old Name | New Name |
|----------|----------|
| provinces | mst_provinsi |
| regencies | mst_kabupaten |
| districts | mst_kecamatan |
| villages | mst_desa |
| unit_pelaksanaan_teknis | mst_upt |
| organisasi | mst_organisasi |
| roles | mst_role |
| pegawai | mst_pegawai |
| penyuluh | mst_penyuluh |
| kelompok_nelayan | mst_kelompok_nelayan |
| absensi | trx_absensi |

### 4.2 New Tables
- mst_jenis_usaha
- mst_komoditas
- mst_alat_tangkap
- mst_kapal
- mst_jenis_bantuan
- mst_jenis_pelatihan
- mst_jenis_sertifikasi
- trx_produksi_hasil_tangkapan
- trx_bantuan
- trx_pelatihan
- trx_sertifikasi

## 5. Non-Functional Requirements

### 5.1 Data Integrity
- All foreign key constraints must be maintained
- **CRITICAL: No data loss during migration, especially for:**
  - **Master wilayah (provinces, regencies, districts, villages)** - Must preserve ALL existing data
  - **Pegawai data** - Must preserve ALL existing employee records
  - Penyuluh data
  - Kelompok nelayan data
  - Absensi records
- All indexes must be recreated after rename
- Data count verification before and after migration

### 5.2 Performance
- Migration should complete within reasonable time
- API response time should not degrade after changes

### 5.3 Backward Compatibility
- Existing API endpoints must continue to work
- Response format must remain consistent

### 5.4 Data Preservation Priority
**HIGH PRIORITY - Must Not Lose:**
1. Master wilayah (provinces, regencies, districts, villages) - ~100K+ records
2. Pegawai data - All employee records with relations
3. Penyuluh data - All extension officer records
4. Kelompok nelayan data - All fisherman group records
5. Absensi records - All attendance history

**MEDIUM PRIORITY:**
- Organisasi data
- Role data
- UPT data

## 6. Out of Scope

- Authentication/authorization changes
- UI/Frontend changes
- Business logic changes (except for new tables)
- Performance optimization beyond maintaining current performance

## 7. Dependencies

- Drizzle ORM for schema management
- PostgreSQL database
- Existing API infrastructure (Elysia, handlers, repositories)

## 8. Risks and Mitigations

### 8.1 Risk: Data Loss During Migration (CRITICAL)
**Mitigation**: 
- **MANDATORY: Create full database backup before any migration**
- **MANDATORY: Verify data count before and after for critical tables:**
  - provinces: SELECT COUNT(*) FROM provinces; (before) vs mst_provinsi (after)
  - regencies: SELECT COUNT(*) FROM regencies; (before) vs mst_kabupaten (after)
  - districts: SELECT COUNT(*) FROM districts; (before) vs mst_kecamatan (after)
  - villages: SELECT COUNT(*) FROM villages; (before) vs mst_desa (after)
  - pegawai: SELECT COUNT(*) FROM pegawai; (before) vs mst_pegawai (after)
- Test migration on staging/local environment first
- Use transactions for all migration operations (rollback on error)
- Keep backup for at least 7 days after successful migration

### 8.2 Risk: Breaking Existing APIs
**Mitigation**:
- Comprehensive testing of all endpoints after migration
- Update all code references before deploying
- Test critical endpoints: GET /pegawai, GET /api/master/provinces, etc.

### 8.3 Risk: Foreign Key Constraint Violations
**Mitigation**:
- Carefully plan migration order (master tables first, then transaction tables)
- Use CASCADE options for foreign keys during rename
- Verify all relationships after migration
- Test foreign key constraints with sample inserts

### 8.4 Risk: Master Wilayah Data Corruption
**Mitigation**:
- **CRITICAL: Verify province count (should be 34 for Indonesia)**
- **CRITICAL: Verify regency count (should be 514)**
- **CRITICAL: Verify district count (should be ~7000+)**
- **CRITICAL: Verify village count (should be ~80000+)**
- Spot check: Verify specific provinces exist (DKI Jakarta, Jawa Barat, etc.)
- Verify foreign key relationships: regency → province, district → regency, village → district

### 8.5 Risk: Pegawai Data Loss
**Mitigation**:
- Verify pegawai count before and after
- Verify all pegawai have valid organisasi_id and role_id references
- Verify NIP uniqueness is maintained
- Verify email uniqueness is maintained
- Test pegawai API endpoints after migration

## 9. Success Metrics

### 9.1 Data Preservation (CRITICAL)
- [ ] **Master wilayah data count matches exactly:**
  - [ ] provinces: before count = after count (mst_provinsi)
  - [ ] regencies: before count = after count (mst_kabupaten)
  - [ ] districts: before count = after count (mst_kecamatan)
  - [ ] villages: before count = after count (mst_desa)
- [ ] **Pegawai data preserved:**
  - [ ] pegawai: before count = after count (mst_pegawai)
  - [ ] All NIP values preserved
  - [ ] All email values preserved
  - [ ] All organisasi_id references valid
  - [ ] All role_id references valid
- [ ] **Other critical data preserved:**
  - [ ] penyuluh: before count = after count (mst_penyuluh)
  - [ ] kelompok_nelayan: before count = after count (mst_kelompok_nelayan)
  - [ ] absensi: before count = after count (trx_absensi)

### 9.2 Migration Success
- [ ] All 11 existing tables successfully renamed
- [ ] All 11 new tables successfully created
- [ ] All foreign key constraints working
- [ ] All indexes recreated

### 9.3 API Functionality
- [ ] All existing API endpoints return 200 status
- [ ] All new API endpoints functional
- [ ] Pagination works correctly
- [ ] Search/filter works correctly

### 9.4 Quality Assurance
- [ ] Zero data loss verified
- [ ] All tests passing
- [ ] Database backup created and verified
- [ ] Rollback plan tested and ready
