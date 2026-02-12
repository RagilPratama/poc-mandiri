export interface RegencyResponse {
  id: number;
  province_id: number;
  name: string;
  alt_name: string | null;
  latitude: string | null;
  longitude: string | null;
}

export interface RegencyListResponse {
  success: boolean;
  data: RegencyResponse[];
  total?: number;
  error?: string;
  message?: string;
}

export interface RegencySingleResponse {
  success: boolean;
  data: RegencyResponse | null;
  error?: string;
  message?: string;
}

export interface RegencySearchResponse {
  success: boolean;
  data: RegencyResponse[];
  total?: number;
  error?: string;
  message?: string;
}
