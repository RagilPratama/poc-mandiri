export interface ProvinceResponse {
  id: number;
  name: string;
  alt_name: string | null;
  latitude: string | null;
  longitude: string | null;
}

export interface ProvinceListResponse {
  data: ProvinceResponse[];
  total: number;
}

export interface ProvinceSingleResponse {
  data: ProvinceResponse;
}

export interface ProvinceSearchResponse {
  data: ProvinceResponse[];
  total: number;
}
