# Implementation Plan: Database Restructure

## Overview

This implementation plan breaks down the database restructure into discrete, incremental tasks. Each task builds on previous work and includes verification steps. The plan follows a phased approach: database migration → schema updates → repository layer → handler layer → routes → types → testing.

## Tasks

- [x] 1. Create database migration script
  - Create `scripts/migrate-database-restructure.ts` with all migration phases
  - Include pre-migration verification (row counts, foreign keys)
  - Include post-migration verification queries
  - Add transaction wrapping for each phase
  - Add rollback procedures
  - _Requirements: 3.1, 5.1, 9.1, 9.2_

- [x] 2. Test migration on local database
  - Create database backup
  - Run migration script on local copy
  - Verify row counts match for all 11 tables
  - Verify zero orphaned records
  - Test rollback procedure
  - Document execution time for each phase
  - _Requirements: 5.1, 8.1, 9.1_

- [x] 3. Update master wilayah schema files
  - [x] 3.1 Rename and update provinces schema to mst_provinsi.ts
    - Update table name to 'mst_provinsi'
    - Update index names
    - Update type exports
    - _Requirements: 3.1, 3.5_
  
  - [x] 3.2 Rename and update regencies schema to mst_kabupaten.ts
    - Update table name to 'mst_kabupaten'
    - Update foreign key reference to mst_provinsi
    - Update index names
    - Update type exports
    - _Requirements: 3.1, 3.5_
  
  - [x] 3.3 Rename and update districts schema to mst_kecamatan.ts
    - Update table name to 'mst_kecamatan'
    - Update foreign key reference to mst_kabupaten
    - Update index names
    - Update type exports
    - _Requirements: 3.1, 3.5_
  
  - [x] 3.4 Rename and update villages schema to mst_desa.ts
    - Update table name to 'mst_desa'
    - Update foreign key reference to mst_kecamatan
    - Update index names
    - Update type exports
    - _Requirements: 3.1, 3.5_



- [x] 4. Update organization and staff schema files
  - [x] 4.1 Rename organisasi schema to mst_organisasi.ts
    - Update table name to 'mst_organisasi'
    - Update type exports
    - _Requirements: 3.1, 3.5_
  
  - [x] 4.2 Rename roles schema to mst_role.ts
    - Update table name to 'mst_role'
    - Update type exports
    - _Requirements: 3.1, 3.5_
  
  - [x] 4.3 Rename unit_pelaksanaan_teknis schema to mst_upt.ts
    - Update table name to 'mst_upt'
    - Update foreign key reference to mst_provinsi
    - Update type exports
    - _Requirements: 3.1, 3.5_
  
  - [x] 4.4 Rename and update pegawai schema to mst_pegawai.ts
    - Update table name to 'mst_pegawai'
    - Update foreign key references to mst_organisasi and mst_role
    - Add new columns: no_hp, alamat, foto_url, tanggal_lahir, jenis_kelamin, pendidikan_terakhir, tanggal_bergabung
    - Update type exports
    - _Requirements: 3.1, 3.2, 3.5_
  
  - [x] 4.5 Rename and update penyuluh schema to mst_penyuluh.ts
    - Update table name to 'mst_penyuluh'
    - Update foreign key references to mst_pegawai, mst_upt, mst_provinsi
    - Add new columns: wilayah_binaan, spesialisasi
    - Update type exports
    - _Requirements: 3.1, 3.2, 3.5_
  
  - [x] 4.6 Rename and update kelompok_nelayan schema to mst_kelompok_nelayan.ts
    - Update table name to 'mst_kelompok_nelayan'
    - Update foreign key references to mst_upt, mst_provinsi, mst_penyuluh
    - Add new columns: jenis_usaha_id, alamat, no_hp_ketua, tahun_berdiri, status_kelompok, luas_lahan, koordinat_latitude, koordinat_longitude
    - Update type exports
    - _Requirements: 3.1, 3.2, 3.5_

- [x] 5. Update transaction schema files
  - [x] 5.1 Rename and update absensi schema to trx_absensi.ts
    - Update table name to 'trx_absensi'
    - Update foreign key reference to mst_pegawai
    - Add new columns: keterangan, foto_checkout_url, foto_checkout_id
    - Update type exports
    - _Requirements: 3.1, 3.2, 3.5_

- [x] 6. Create new master table schemas
  - [x] 6.1 Create mst_jenis_usaha.ts schema
    - Define table with all columns and constraints
    - Add indexes on kategori
    - Export types
    - _Requirements: 3.3, 3.5_
  
  - [x] 6.2 Create mst_komoditas.ts schema
    - Define table with all columns and constraints
    - Add indexes on kategori and nama_komoditas
    - Export types
    - _Requirements: 3.3, 3.5_
  
  - [x] 6.3 Create mst_alat_tangkap.ts schema
    - Define table with all columns and constraints
    - Add index on jenis
    - Export types
    - _Requirements: 3.3, 3.5_
  
  - [x] 6.4 Create mst_kapal.ts schema
    - Define table with all columns and constraints
    - Add foreign key to mst_kelompok_nelayan
    - Add indexes on kelompok_nelayan_id and status_kapal
    - Export types
    - _Requirements: 3.3, 3.5_
  
  - [x] 6.5 Create mst_jenis_bantuan.ts schema
    - Define table with all columns and constraints
    - Add index on kategori
    - Export types
    - _Requirements: 3.3, 3.5_
  
  - [x] 6.6 Create mst_jenis_pelatihan.ts schema
    - Define table with all columns and constraints
    - Add index on kategori
    - Export types
    - _Requirements: 3.3, 3.5_
  
  - [x] 6.7 Create mst_jenis_sertifikasi.ts schema
    - Define table with all columns and constraints
    - Add index on kategori
    - Export types
    - _Requirements: 3.3, 3.5_



- [x] 7. Create new transaction table schemas
  - [x] 7.1 Create trx_produksi_hasil_tangkapan.ts schema
    - Define table with all columns and constraints
    - Add foreign keys to mst_kelompok_nelayan, mst_kapal, mst_komoditas, mst_alat_tangkap
    - Add indexes on kelompok_nelayan_id, tanggal_produksi, komoditas_id
    - Add composite index on (kelompok_nelayan_id, tanggal_produksi)
    - Export types
    - _Requirements: 3.4, 3.5_
  
  - [x] 7.2 Create trx_bantuan.ts schema
    - Define table with all columns and constraints
    - Add foreign keys to mst_jenis_bantuan, mst_kelompok_nelayan, mst_penyuluh
    - Add indexes on kelompok_nelayan_id, tanggal_penyaluran, status_penyaluran
    - Add composite index on (tahun_anggaran, status_penyaluran)
    - Export types
    - _Requirements: 3.4, 3.5_
  
  - [x] 7.3 Create trx_pelatihan.ts schema
    - Define table with all columns and constraints
    - Add foreign keys to mst_jenis_pelatihan, mst_penyuluh
    - Add indexes on tanggal_mulai, status_pelatihan
    - Add composite index on (tanggal_mulai, status_pelatihan)
    - Export types
    - _Requirements: 3.4, 3.5_
  
  - [x] 7.4 Create trx_sertifikasi.ts schema
    - Define table with all columns and constraints
    - Add foreign keys to mst_jenis_sertifikasi, mst_kelompok_nelayan, mst_penyuluh
    - Add indexes on kelompok_nelayan_id, tanggal_kadaluarsa, status_sertifikat
    - Add composite index on (kelompok_nelayan_id, status_sertifikat)
    - Export types
    - _Requirements: 3.4, 3.5_

- [x] 8. Update schema index.ts exports
  - Update all imports to use new schema file names
  - Export all renamed schemas
  - Export all new schemas
  - Verify TypeScript compilation succeeds
  - _Requirements: 3.5_

- [x] 9. Generate Drizzle migration files
  - Run `bun run drizzle-kit generate`
  - Review generated migration SQL
  - Verify migration matches design document
  - Test migration on local database
  - _Requirements: 3.5_

- [x] 10. Checkpoint - Verify schema layer complete
  - Ensure all schema files compile without errors
  - Ensure all types are exported correctly
  - Ensure migration files generated successfully
  - Ask user if questions arise



- [x] 11. Update existing repositories for renamed tables
  - [x] 11.1 Update province.repository.ts
    - Update import to use mst_provinsi schema
    - Update all queries to use 'mst_provinsi' table name
    - Test CRUD operations
    - _Requirements: 3.6_
  
  - [x] 11.2 Update regency.repository.ts
    - Update import to use mst_kabupaten schema
    - Update all queries to use 'mst_kabupaten' table name
    - Update join references to mst_provinsi
    - Test CRUD operations
    - _Requirements: 3.6_
  
  - [x] 11.3 Update district.repository.ts
    - Update import to use mst_kecamatan schema
    - Update all queries to use 'mst_kecamatan' table name
    - Update join references to mst_kabupaten
    - Test CRUD operations
    - _Requirements: 3.6_
  
  - [x] 11.4 Update village.repository.ts
    - Update import to use mst_desa schema
    - Update all queries to use 'mst_desa' table name
    - Update join references to mst_kecamatan
    - Test CRUD operations
    - _Requirements: 3.6_
  
  - [x] 11.5 Update organisasi.repository.ts
    - Update import to use mst_organisasi schema
    - Update all queries to use 'mst_organisasi' table name
    - Test CRUD operations
    - _Requirements: 3.6_
  
  - [x] 11.6 Update role.repository.ts
    - Update import to use mst_role schema
    - Update all queries to use 'mst_role' table name
    - Test CRUD operations
    - _Requirements: 3.6_
  
  - [x] 11.7 Update unit-pelaksanaan-teknis.repository.ts
    - Update import to use mst_upt schema
    - Update all queries to use 'mst_upt' table name
    - Update join references to mst_provinsi
    - Test CRUD operations
    - _Requirements: 3.6_
  
  - [x] 11.8 Update pegawai.repository.ts
    - Update import to use mst_pegawai schema
    - Update all queries to use 'mst_pegawai' table name
    - Update join references to mst_organisasi and mst_role
    - Add support for new columns in create/update methods
    - Test CRUD operations with new fields
    - _Requirements: 3.6_
  
  - [x] 11.9 Update penyuluh.repository.ts
    - Update import to use mst_penyuluh schema
    - Update all queries to use 'mst_penyuluh' table name
    - Update join references to mst_pegawai, mst_upt, mst_provinsi
    - Add support for new columns in create/update methods
    - Test CRUD operations with new fields
    - _Requirements: 3.6_
  
  - [x] 11.10 Update kelompok-nelayan.repository.ts
    - Update import to use mst_kelompok_nelayan schema
    - Update all queries to use 'mst_kelompok_nelayan' table name
    - Update join references to mst_upt, mst_provinsi, mst_penyuluh
    - Add support for new columns in create/update methods
    - Add support for jenis_usaha_id foreign key
    - Test CRUD operations with new fields
    - _Requirements: 3.6_
  
  - [x] 11.11 Update absensi.repository.ts
    - Update import to use trx_absensi schema
    - Update all queries to use 'trx_absensi' table name
    - Update join references to mst_pegawai
    - Add support for new columns in create/update methods
    - Test CRUD operations with new fields
    - _Requirements: 3.6_



- [x] 12. Create repositories for new master tables
  - [x] 12.1 Create jenis-usaha.repository.ts
    - Implement findAll with pagination and search
    - Implement findById
    - Implement create, update, delete
    - Add filtering by kategori
    - _Requirements: 3.6_
  
  - [x] 12.2 Create komoditas.repository.ts
    - Implement findAll with pagination and search
    - Implement findById
    - Implement create, update, delete
    - Add filtering by kategori
    - _Requirements: 3.6_
  
  - [x] 12.3 Create alat-tangkap.repository.ts
    - Implement findAll with pagination and search
    - Implement findById
    - Implement create, update, delete
    - Add filtering by jenis
    - _Requirements: 3.6_
  
  - [x] 12.4 Create kapal.repository.ts
    - Implement findAll with pagination and search
    - Implement findById
    - Implement findByKelompokNelayan
    - Implement create, update, delete
    - Add filtering by status_kapal
    - Add join with mst_kelompok_nelayan
    - _Requirements: 3.6_
  
  - [x] 12.5 Create jenis-bantuan.repository.ts
    - Implement findAll with pagination and search
    - Implement findById
    - Implement create, update, delete
    - Add filtering by kategori
    - _Requirements: 3.6_
  
  - [x] 12.6 Create jenis-pelatihan.repository.ts
    - Implement findAll with pagination and search
    - Implement findById
    - Implement create, update, delete
    - Add filtering by kategori
    - _Requirements: 3.6_
  
  - [x] 12.7 Create jenis-sertifikasi.repository.ts
    - Implement findAll with pagination and search
    - Implement findById
    - Implement create, update, delete
    - Add filtering by kategori
    - _Requirements: 3.6_

- [x] 13. Create repositories for new transaction tables
  - [x] 13.1 Create produksi-hasil-tangkapan.repository.ts
    - Implement findAll with pagination and date range filtering
    - Implement findById
    - Implement findByKelompokNelayan
    - Implement create, update, delete
    - Add joins with mst_kelompok_nelayan, mst_kapal, mst_komoditas, mst_alat_tangkap
    - Add filtering by tanggal_produksi, komoditas_id
    - _Requirements: 3.6_
  
  - [x] 13.2 Create bantuan.repository.ts
    - Implement findAll with pagination and filtering
    - Implement findById
    - Implement findByKelompokNelayan
    - Implement create, update, delete
    - Add joins with mst_jenis_bantuan, mst_kelompok_nelayan, mst_penyuluh
    - Add filtering by status_penyaluran, tahun_anggaran
    - _Requirements: 3.6_
  
  - [x] 13.3 Create pelatihan.repository.ts
    - Implement findAll with pagination and date filtering
    - Implement findById
    - Implement create, update, delete
    - Add joins with mst_jenis_pelatihan, mst_penyuluh
    - Add filtering by status_pelatihan, tanggal_mulai
    - _Requirements: 3.6_
  
  - [x] 13.4 Create sertifikasi.repository.ts
    - Implement findAll with pagination and filtering
    - Implement findById
    - Implement findByKelompokNelayan
    - Implement create, update, delete
    - Add joins with mst_jenis_sertifikasi, mst_kelompok_nelayan, mst_penyuluh
    - Add filtering by status_sertifikat, tanggal_kadaluarsa
    - _Requirements: 3.6_

- [x] 14. Checkpoint - Verify repository layer complete
  - Ensure all repositories compile without errors
  - Ensure all CRUD operations work
  - Ensure all joins work correctly
  - Ask user if questions arise



- [x] 15. Update existing handlers
  - [x] 15.1 Update province.handler.ts
    - Update to use updated province repository
    - Verify response format maintained (responseCode: "2000000")
    - Test all handler methods
    - _Requirements: 3.7, 3.10_
  
  - [x] 15.2 Update regency.handler.ts
    - Update to use updated regency repository
    - Verify response format maintained
    - Test all handler methods
    - _Requirements: 3.7, 3.10_
  
  - [x] 15.3 Update district.handler.ts
    - Update to use updated district repository
    - Verify response format maintained
    - Test all handler methods
    - _Requirements: 3.7, 3.10_
  
  - [x] 15.4 Update village.handler.ts
    - Update to use updated village repository
    - Verify response format maintained
    - Test all handler methods
    - _Requirements: 3.7, 3.10_
  
  - [x] 15.5 Update organisasi.handler.ts
    - Update to use updated organisasi repository
    - Verify response format maintained
    - Test all handler methods
    - _Requirements: 3.7, 3.10_
  
  - [x] 15.6 Update role.handler.ts
    - Update to use updated role repository
    - Verify response format maintained
    - Test all handler methods
    - _Requirements: 3.7, 3.10_
  
  - [x] 15.7 Update unit-pelaksanaan-teknis.handler.ts
    - Update to use updated UPT repository
    - Verify response format maintained
    - Test all handler methods
    - _Requirements: 3.7, 3.10_
  
  - [x] 15.8 Update pegawai.handler.ts
    - Update to use updated pegawai repository
    - Add handling for new fields in create/update
    - Verify response format maintained
    - Test all handler methods including new fields
    - _Requirements: 3.7, 3.10_
  
  - [x] 15.9 Update penyuluh.handler.ts
    - Update to use updated penyuluh repository
    - Add handling for new fields in create/update
    - Verify response format maintained
    - Test all handler methods including new fields
    - _Requirements: 3.7, 3.10_
  
  - [x] 15.10 Update kelompok-nelayan.handler.ts
    - Update to use updated kelompok nelayan repository
    - Add handling for new fields in create/update
    - Verify response format maintained
    - Test all handler methods including new fields
    - _Requirements: 3.7, 3.10_
  
  - [x] 15.11 Update absensi.handler.ts
    - Update to use updated absensi repository
    - Add handling for new fields in create/update
    - Verify response format maintained
    - Test all handler methods including new fields
    - _Requirements: 3.7, 3.10_



- [x] 16. Create handlers for new master tables
  - [x] 16.1 Create jenis-usaha.handler.ts
    - Implement getAll, getById, create, update, delete
    - Use successResponse and successResponseWithPagination
    - Add validation for required fields
    - _Requirements: 3.7_
  
  - [x] 16.2 Create komoditas.handler.ts
    - Implement getAll, getById, create, update, delete
    - Use successResponse and successResponseWithPagination
    - Add validation for required fields
    - _Requirements: 3.7_
  
  - [x] 16.3 Create alat-tangkap.handler.ts
    - Implement getAll, getById, create, update, delete
    - Use successResponse and successResponseWithPagination
    - Add validation for required fields
    - _Requirements: 3.7_
  
  - [x] 16.4 Create kapal.handler.ts
    - Implement getAll, getById, create, update, delete
    - Use successResponse and successResponseWithPagination
    - Add validation for required fields and foreign keys
    - _Requirements: 3.7_
  
  - [x] 16.5 Create jenis-bantuan.handler.ts
    - Implement getAll, getById, create, update, delete
    - Use successResponse and successResponseWithPagination
    - Add validation for required fields
    - _Requirements: 3.7_
  
  - [x] 16.6 Create jenis-pelatihan.handler.ts
    - Implement getAll, getById, create, update, delete
    - Use successResponse and successResponseWithPagination
    - Add validation for required fields
    - _Requirements: 3.7_
  
  - [x] 16.7 Create jenis-sertifikasi.handler.ts
    - Implement getAll, getById, create, update, delete
    - Use successResponse and successResponseWithPagination
    - Add validation for required fields
    - _Requirements: 3.7_

- [x] 17. Create handlers for new transaction tables
  - [x] 17.1 Create produksi-hasil-tangkapan.handler.ts
    - Implement getAll, getById, create, update, delete
    - Use successResponse and successResponseWithPagination
    - Add validation for required fields and foreign keys
    - Add date range filtering support
    - _Requirements: 3.7_
  
  - [x] 17.2 Create bantuan.handler.ts
    - Implement getAll, getById, create, update, delete
    - Use successResponse and successResponseWithPagination
    - Add validation for required fields and foreign keys
    - Add status filtering support
    - _Requirements: 3.7_
  
  - [x] 17.3 Create pelatihan.handler.ts
    - Implement getAll, getById, create, update, delete
    - Use successResponse and successResponseWithPagination
    - Add validation for required fields and foreign keys
    - Add date and status filtering support
    - _Requirements: 3.7_
  
  - [x] 17.4 Create sertifikasi.handler.ts
    - Implement getAll, getById, create, update, delete
    - Use successResponse and successResponseWithPagination
    - Add validation for required fields and foreign keys
    - Add status filtering support
    - _Requirements: 3.7_

- [x] 18. Checkpoint - Verify handler layer complete
  - Ensure all handlers compile without errors
  - Ensure all handlers use correct response format
  - Ensure validation works correctly
  - Ask user if questions arise



- [x] 19. Update existing routes
  - [x] 19.1 Update province routes
    - Verify routes still work with updated handler
    - Test GET, POST, PUT, DELETE endpoints
    - _Requirements: 3.8, 3.10_
  
  - [x] 19.2 Update regency routes
    - Verify routes still work with updated handler
    - Test GET, POST, PUT, DELETE endpoints
    - _Requirements: 3.8, 3.10_
  
  - [x] 19.3 Update district routes
    - Verify routes still work with updated handler
    - Test GET, POST, PUT, DELETE endpoints
    - _Requirements: 3.8, 3.10_
  
  - [x] 19.4 Update village routes
    - Verify routes still work with updated handler
    - Test GET, POST, PUT, DELETE endpoints
    - _Requirements: 3.8, 3.10_
  
  - [x] 19.5 Update organisasi routes
    - Verify routes still work with updated handler
    - Test GET, POST, PUT, DELETE endpoints
    - _Requirements: 3.8, 3.10_
  
  - [x] 19.6 Update role routes
    - Verify routes still work with updated handler
    - Test GET, POST, PUT, DELETE endpoints
    - _Requirements: 3.8, 3.10_
  
  - [x] 19.7 Update UPT routes
    - Verify routes still work with updated handler
    - Test GET, POST, PUT, DELETE endpoints
    - _Requirements: 3.8, 3.10_
  
  - [x] 19.8 Update pegawai routes
    - Verify routes still work with updated handler
    - Test GET, POST, PUT, DELETE endpoints with new fields
    - _Requirements: 3.8, 3.10_
  
  - [x] 19.9 Update penyuluh routes
    - Verify routes still work with updated handler
    - Test GET, POST, PUT, DELETE endpoints with new fields
    - _Requirements: 3.8, 3.10_
  
  - [x] 19.10 Update kelompok nelayan routes
    - Verify routes still work with updated handler
    - Test GET, POST, PUT, DELETE endpoints with new fields
    - _Requirements: 3.8, 3.10_
  
  - [x] 19.11 Update absensi routes
    - Verify routes still work with updated handler
    - Test GET, POST, PUT, DELETE endpoints with new fields
    - _Requirements: 3.8, 3.10_

- [x] 20. Create routes for new master tables
  - [x] 20.1 Create jenis-usaha routes
    - Define GET /jenis-usaha (list with pagination)
    - Define GET /jenis-usaha/:id (detail)
    - Define POST /jenis-usaha (create)
    - Define PUT /jenis-usaha/:id (update)
    - Define DELETE /jenis-usaha/:id (delete)
    - _Requirements: 3.8_
  
  - [x] 20.2 Create komoditas routes
    - Define GET /komoditas (list with pagination)
    - Define GET /komoditas/:id (detail)
    - Define POST /komoditas (create)
    - Define PUT /komoditas/:id (update)
    - Define DELETE /komoditas/:id (delete)
    - _Requirements: 3.8_
  
  - [x] 20.3 Create alat-tangkap routes
    - Define GET /alat-tangkap (list with pagination)
    - Define GET /alat-tangkap/:id (detail)
    - Define POST /alat-tangkap (create)
    - Define PUT /alat-tangkap/:id (update)
    - Define DELETE /alat-tangkap/:id (delete)
    - _Requirements: 3.8_
  
  - [x] 20.4 Create kapal routes
    - Define GET /kapal (list with pagination)
    - Define GET /kapal/:id (detail)
    - Define POST /kapal (create)
    - Define PUT /kapal/:id (update)
    - Define DELETE /kapal/:id (delete)
    - _Requirements: 3.8_
  
  - [x] 20.5 Create jenis-bantuan routes
    - Define GET /jenis-bantuan (list with pagination)
    - Define GET /jenis-bantuan/:id (detail)
    - Define POST /jenis-bantuan (create)
    - Define PUT /jenis-bantuan/:id (update)
    - Define DELETE /jenis-bantuan/:id (delete)
    - _Requirements: 3.8_
  
  - [x] 20.6 Create jenis-pelatihan routes
    - Define GET /jenis-pelatihan (list with pagination)
    - Define GET /jenis-pelatihan/:id (detail)
    - Define POST /jenis-pelatihan (create)
    - Define PUT /jenis-pelatihan/:id (update)
    - Define DELETE /jenis-pelatihan/:id (delete)
    - _Requirements: 3.8_
  
  - [x] 20.7 Create jenis-sertifikasi routes
    - Define GET /jenis-sertifikasi (list with pagination)
    - Define GET /jenis-sertifikasi/:id (detail)
    - Define POST /jenis-sertifikasi (create)
    - Define PUT /jenis-sertifikasi/:id (update)
    - Define DELETE /jenis-sertifikasi/:id (delete)
    - _Requirements: 3.8_



- [x] 21. Create routes for new transaction tables
  - [x] 21.1 Create produksi-hasil-tangkapan routes
    - Define GET /produksi-hasil-tangkapan (list with pagination and date filtering)
    - Define GET /produksi-hasil-tangkapan/:id (detail)
    - Define POST /produksi-hasil-tangkapan (create)
    - Define PUT /produksi-hasil-tangkapan/:id (update)
    - Define DELETE /produksi-hasil-tangkapan/:id (delete)
    - _Requirements: 3.8_
  
  - [x] 21.2 Create bantuan routes
    - Define GET /bantuan (list with pagination and status filtering)
    - Define GET /bantuan/:id (detail)
    - Define POST /bantuan (create)
    - Define PUT /bantuan/:id (update)
    - Define DELETE /bantuan/:id (delete)
    - _Requirements: 3.8_
  
  - [x] 21.3 Create pelatihan routes
    - Define GET /pelatihan (list with pagination and date/status filtering)
    - Define GET /pelatihan/:id (detail)
    - Define POST /pelatihan (create)
    - Define PUT /pelatihan/:id (update)
    - Define DELETE /pelatihan/:id (delete)
    - _Requirements: 3.8_
  
  - [x] 21.4 Create sertifikasi routes
    - Define GET /sertifikasi (list with pagination and status filtering)
    - Define GET /sertifikasi/:id (detail)
    - Define POST /sertifikasi (create)
    - Define PUT /sertifikasi/:id (update)
    - Define DELETE /sertifikasi/:id (delete)
    - _Requirements: 3.8_

- [ ] 22. Update type definitions for existing tables
  - [ ] 22.1 Update pegawai types
    - Add types for new fields (no_hp, alamat, foto_url, etc.)
    - Update CreatePegawaiType and UpdatePegawaiType
    - Update PegawaiQueryType if needed
    - _Requirements: 3.9_
  
  - [ ] 22.2 Update penyuluh types
    - Add types for new fields (wilayah_binaan, spesialisasi)
    - Update CreatePenyuluhType and UpdatePenyuluhType
    - Update PenyuluhQueryType if needed
    - _Requirements: 3.9_
  
  - [ ] 22.3 Update kelompok nelayan types
    - Add types for new fields (jenis_usaha_id, alamat, no_hp_ketua, etc.)
    - Update CreateKelompokNelayanType and UpdateKelompokNelayanType
    - Update KelompokNelayanQueryType if needed
    - _Requirements: 3.9_
  
  - [ ] 22.4 Update absensi types
    - Add types for new fields (keterangan, foto_checkout_url, foto_checkout_id)
    - Update CreateAbsensiType and UpdateAbsensiType
    - Update AbsensiQueryType if needed
    - _Requirements: 3.9_

- [ ] 23. Create type definitions for new tables
  - [ ] 23.1 Create jenis-usaha types
    - Create JenisUsahaType, CreateJenisUsahaType, UpdateJenisUsahaType, JenisUsahaQueryType
    - _Requirements: 3.9_
  
  - [ ] 23.2 Create komoditas types
    - Create KomoditasType, CreateKomoditasType, UpdateKomoditasType, KomoditasQueryType
    - _Requirements: 3.9_
  
  - [ ] 23.3 Create alat-tangkap types
    - Create AlatTangkapType, CreateAlatTangkapType, UpdateAlatTangkapType, AlatTangkapQueryType
    - _Requirements: 3.9_
  
  - [ ] 23.4 Create kapal types
    - Create KapalType, CreateKapalType, UpdateKapalType, KapalQueryType
    - _Requirements: 3.9_
  
  - [ ] 23.5 Create jenis-bantuan types
    - Create JenisBantuanType, CreateJenisBantuanType, UpdateJenisBantuanType, JenisBantuanQueryType
    - _Requirements: 3.9_
  
  - [ ] 23.6 Create jenis-pelatihan types
    - Create JenisPelatihanType, CreateJenisPelatihanType, UpdateJenisPelatihanType, JenisPelatihanQueryType
    - _Requirements: 3.9_
  
  - [ ] 23.7 Create jenis-sertifikasi types
    - Create JenisSertifikasiType, CreateJenisSertifikasiType, UpdateJenisSertifikasiType, JenisSertifikasiQueryType
    - _Requirements: 3.9_
  
  - [ ] 23.8 Create produksi-hasil-tangkapan types
    - Create ProduksiHasilTangkapanType, CreateProduksiHasilTangkapanType, UpdateProduksiHasilTangkapanType, ProduksiHasilTangkapanQueryType
    - _Requirements: 3.9_
  
  - [ ] 23.9 Create bantuan types
    - Create BantuanType, CreateBantuanType, UpdateBantuanType, BantuanQueryType
    - _Requirements: 3.9_
  
  - [ ] 23.10 Create pelatihan types
    - Create PelatihanType, CreatePelatihanType, UpdatePelatihanType, PelatihanQueryType
    - _Requirements: 3.9_
  
  - [ ] 23.11 Create sertifikasi types
    - Create SertifikasiType, CreateSertifikasiType, UpdateSertifikasiType, SertifikasiQueryType
    - _Requirements: 3.9_

- [ ] 24. Checkpoint - Verify all code layers complete
  - Ensure all TypeScript compiles without errors
  - Ensure all types are correctly defined
  - Ensure all routes are registered
  - Ask user if questions arise



- [ ] 25. Write unit tests for migration
  - [ ]* 25.1 Test migration Phase 1 (master wilayah rename)
    - Test provinces → mst_provinsi rename
    - Test row count preservation
    - Test index recreation
    - _Requirements: 3.1, 5.1, 9.1_
  
  - [ ]* 25.2 Test migration Phase 2 (organization & staff rename)
    - Test all table renames
    - Test row count preservation
    - Test foreign key integrity
    - _Requirements: 3.1, 5.1, 9.1_
  
  - [ ]* 25.3 Test migration Phase 4 (add new columns)
    - Test new columns exist
    - Test columns are nullable
    - Test existing data preserved
    - _Requirements: 3.2, 5.1_
  
  - [ ]* 25.4 Test migration Phase 5-7 (create new tables)
    - Test all new tables created
    - Test foreign keys work
    - Test indexes created
    - _Requirements: 3.3, 3.4, 9.2_

- [ ] 26. Write unit tests for API endpoints
  - [ ]* 26.1 Test existing endpoints maintain response format
    - Test GET /pegawai returns responseCode "2000000"
    - Test GET /api/master/provinces returns correct format
    - Test pagination works correctly
    - _Requirements: 3.10, 9.3_
  
  - [ ]* 26.2 Test new master table endpoints
    - Test GET /jenis-usaha returns correct format
    - Test POST /komoditas creates record
    - Test PUT /alat-tangkap updates record
    - Test DELETE /kapal deletes record
    - _Requirements: 3.7, 3.8_
  
  - [ ]* 26.3 Test new transaction table endpoints
    - Test GET /produksi-hasil-tangkapan with date filtering
    - Test POST /bantuan with foreign keys
    - Test GET /pelatihan with status filtering
    - Test GET /sertifikasi with pagination
    - _Requirements: 3.7, 3.8_

- [ ] 27. Write property-based tests
  - [ ]* 27.1 Property test for data preservation
    - **Property 1: Data Preservation During Migration**
    - Generate test for all tables
    - Verify row counts match before and after
    - Run 100 iterations
    - _Requirements: 3.1, 5.1, 9.1_
  
  - [ ]* 27.2 Property test for foreign key integrity
    - **Property 2: Foreign Key Integrity Preservation**
    - Generate test for all foreign key relationships
    - Verify zero orphaned records
    - Run 100 iterations
    - _Requirements: 3.1, 5.1_
  
  - [ ]* 27.3 Property test for schema structure
    - **Property 3: Schema Structure Completeness**
    - Generate test for all new columns and tables
    - Verify schema contains expected structure
    - Run 100 iterations
    - _Requirements: 3.2, 3.3, 3.4, 9.2_
  
  - [ ]* 27.4 Property test for CRUD operations
    - **Property 4: CRUD Operations Functionality**
    - Generate test for all tables
    - Verify create, read, update, delete work
    - Run 100 iterations
    - _Requirements: 3.5, 3.6_
  
  - [ ]* 27.5 Property test for API response format
    - **Property 5: API Response Format Consistency**
    - Generate test for all endpoints
    - Verify responseCode "2000000" for success
    - Run 100 iterations
    - _Requirements: 3.7, 3.8, 3.9, 3.10, 9.3_
  
  - [ ]* 27.6 Property test for pagination
    - **Property 6: Pagination Functionality Preservation**
    - Generate test for all paginated endpoints
    - Verify pagination metadata correct
    - Run 100 iterations
    - _Requirements: 3.10, 9.3_
  
  - [ ]* 27.7 Property test for type safety
    - **Property 8: Type Safety Across Layers**
    - Verify TypeScript types compile
    - Verify no type errors in any layer
    - Run 100 iterations
    - _Requirements: 3.5, 3.9_

- [ ] 28. Run integration tests
  - [ ]* 28.1 Test end-to-end migration
    - Run complete migration on test database
    - Verify all data preserved
    - Test all API endpoints
    - Verify response formats
    - _Requirements: 5.1, 9.1, 9.2, 9.3_
  
  - [ ]* 28.2 Test rollback procedure
    - Run migration to specific phase
    - Trigger rollback
    - Verify database restored
    - Verify data intact
    - _Requirements: 5.1_
  
  - [ ]* 28.3 Test new table relationships
    - Create records with foreign keys
    - Verify relationships work
    - Test cascade operations
    - _Requirements: 3.3, 3.4, 5.1_

- [ ] 29. Final checkpoint - Ensure all tests pass
  - Ensure all unit tests pass
  - Ensure all property tests pass
  - Ensure all integration tests pass
  - Ensure no TypeScript errors
  - Ask user if questions arise

- [ ] 30. Deploy to staging and verify
  - Create database backup on staging
  - Run migration on staging database
  - Deploy updated application code
  - Run smoke tests on all endpoints
  - Monitor for errors
  - _Requirements: 9.1, 9.2, 9.3, 9.4_

## Notes

- Tasks marked with `*` are optional test-related sub-tasks and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation at key milestones
- Property tests validate universal correctness properties with 100+ iterations
- Unit tests validate specific examples and edge cases
- Migration must be tested thoroughly before production deployment
- All existing API endpoints must maintain backward compatibility

