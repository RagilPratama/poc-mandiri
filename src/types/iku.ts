export interface CreateIkuType {
  tahun: number;
  level: string;
  satuan?: string;
  target?: string;
  deskripsi?: string;
}

export interface UpdateIkuType {
  tahun?: number;
  level?: string;
  satuan?: string;
  target?: string;
  deskripsi?: string;
  is_active?: boolean;
}

export interface IkuQueryType {
  page?: number;
  limit?: number;
  tahun?: number;
  search?: string;
}
