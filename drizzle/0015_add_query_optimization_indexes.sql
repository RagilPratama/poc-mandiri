-- Add indexes untuk optimasi query pegawai
CREATE INDEX IF NOT EXISTS idx_pegawai_organisasi_id ON mst_pegawai(organisasi_id);
CREATE INDEX IF NOT EXISTS idx_pegawai_role_id ON mst_pegawai(role_id);
CREATE INDEX IF NOT EXISTS idx_pegawai_status_aktif ON mst_pegawai(status_aktif);
CREATE INDEX IF NOT EXISTS idx_pegawai_created_at ON mst_pegawai(created_at);

-- Add indexes untuk optimasi query penyuluh
CREATE INDEX IF NOT EXISTS idx_penyuluh_pegawai_id ON mst_penyuluh(pegawai_id);
CREATE INDEX IF NOT EXISTS idx_penyuluh_upt_id ON mst_penyuluh(upt_id);
CREATE INDEX IF NOT EXISTS idx_penyuluh_province_id ON mst_penyuluh(province_id);
CREATE INDEX IF NOT EXISTS idx_penyuluh_status_aktif ON mst_penyuluh(status_aktif);

-- Add indexes untuk optimasi query kelompok nelayan
CREATE INDEX IF NOT EXISTS idx_kelompok_nelayan_upt_id ON mst_kelompok_nelayan(upt_id);
CREATE INDEX IF NOT EXISTS idx_kelompok_nelayan_province_id ON mst_kelompok_nelayan(province_id);
CREATE INDEX IF NOT EXISTS idx_kelompok_nelayan_penyuluh_id ON mst_kelompok_nelayan(penyuluh_id);
CREATE INDEX IF NOT EXISTS idx_kelompok_nelayan_jenis_usaha_id ON mst_kelompok_nelayan(jenis_usaha_id);
