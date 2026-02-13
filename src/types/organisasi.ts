export interface Organisasi {
  id: number;
  level_organisasi: string;
  kode_organisasi: string;
  nama_organisasi: string;
  keterangan: string | null;
  created_at: Date | null;
  updated_at: Date | null;
}

export interface CreateOrganisasiDTO {
  level_organisasi: string;
  kode_organisasi: string;
  nama_organisasi: string;
  keterangan?: string;
}

export interface UpdateOrganisasiDTO {
  level_organisasi?: string;
  kode_organisasi?: string;
  nama_organisasi?: string;
  keterangan?: string;
}

export interface OrganisasiResponse {
  id: number;
  level_organisasi: string;
  kode_organisasi: string;
  nama_organisasi: string;
  keterangan: string | null;
}
