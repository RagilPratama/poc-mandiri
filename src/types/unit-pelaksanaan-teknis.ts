export interface UnitPelaksanaanTeknis {
  id: number;
  nama_organisasi: string;
  pimpinan: string;
  regencies_id: number;
}

export interface CreateUnitPelaksanaanTeknisDTO {
  nama_organisasi: string;
  pimpinan: string;
  regencies_id: number;
}

export interface UpdateUnitPelaksanaanTeknisDTO {
  nama_organisasi?: string;
  pimpinan?: string;
  regencies_id?: number;
}
