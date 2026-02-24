export interface CreateIkiType {
  kategori_iki: string;
  detail_iki: string;
}

export interface UpdateIkiType {
  kategori_iki?: string;
  detail_iki?: string;
  is_active?: boolean;
}

export interface IkiQueryType {
  page?: number;
  limit?: number;
  kategori_iki?: string;
  search?: string;
}
