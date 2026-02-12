export interface DistrictResponse {
  id: number;
  regency_id: number;
  name: string;
  alt_name: string | null;
  latitude: string | null;
  longitude: string | null;
}

export interface DistrictListResponse {
  data: DistrictResponse[];
  total: number;
}

export interface DistrictSingleResponse {
  data: DistrictResponse;
}

export interface DistrictSearchResponse {
  data: DistrictResponse[];
  total: number;
}
