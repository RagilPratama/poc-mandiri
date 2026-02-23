export interface CreateKegiatanPrioritasType {
  pegawai_id: number;
  kelompok_nelayan_id?: number;
  tanggal: string; // YYYY-MM-DD
  lokasi_kegiatan?: string;
  iki?: string;
  rencana_kerja?: string;
  detail_keterangan?: string;
  foto_kegiatan?: string[];
}

export interface UpdateKegiatanPrioritasType {
  pegawai_id?: number;
  kelompok_nelayan_id?: number;
  tanggal?: string;
  lokasi_kegiatan?: string;
  iki?: string;
  rencana_kerja?: string;
  detail_keterangan?: string;
  foto_kegiatan?: string[];
  is_active?: boolean;
}

export interface KegiatanPrioritasQueryType {
  page?: number;
  limit?: number;
  pegawai_id?: number;
  kelompok_nelayan_id?: number;
  tanggal?: string; // YYYY-MM-DD
  bulan?: string; // YYYY-MM
  tahun?: string; // YYYY
  search?: string;
}
