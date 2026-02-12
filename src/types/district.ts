export interface DistrictResponse {
  id: number;
  regency_id: number;
  name: string;
  alt_name: string | null;
  latitude: string | null;
  longitude: string | null;
}

export interface DistrictListResponse {
  success: boolean;
  data: DistrictResponse[];
  total?: number;
  error?: string;
  message?: string;
}

export interface DistrictSingleResponse {
  success: boolean;
  data: DistrictResponse | null;
  error?: string;
  message?: string;
}

export interface DistrictSearchResponse {
  success: boolean;
  data: DistrictResponse[];
  total?: number;
  error?: string;
  message?: string;
}
