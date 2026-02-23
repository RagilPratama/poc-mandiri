export interface CreateKegiatanHarianType {
  pegawai_id: number;
  kelompok_nelayan_id?: number;
  tanggal: string; // YYYY-MM-DD
  lokasi_kegiatan?: string;
  iki?: string;
  rencana_kerja?: string;
  detail_keterangan?: string;
  foto_kegiatan?: any[]; // File[] or string[]
}

export interface UpdateKegiatanHarianType {
  pegawai_id?: number;
  kelompok_nelayan_id?: number;
  tanggal?: string;
  lokasi_kegiatan?: string;
  iki?: string;
  rencana_kerja?: string;
  detail_keterangan?: string;
  foto_kegiatan?: any[]; // File[] or string[]
  is_active?: boolean;
}

export interface KegiatanHarianQueryType {
  page?: number;
  limit?: number;
  pegawai_id?: number;
  kelompok_nelayan_id?: number;
  tanggal?: string; // YYYY-MM-DD
  bulan?: string; // YYYY-MM
  tahun?: string; // YYYY
  search?: string;
}
