export interface RegencyResponse {
  id: number;
  province_id: number;
  name: string;
  alt_name: string | null;
  latitude: string | null;
  longitude: string | null;
}

export interface RegencyListResponse {
  data: RegencyResponse[];
  total: number;
}

export interface RegencySingleResponse {
  data: RegencyResponse;
}

export interface RegencySearchResponse {
  data: RegencyResponse[];
  total: number;
}
