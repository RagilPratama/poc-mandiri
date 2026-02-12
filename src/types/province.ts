export interface ProvinceResponse {
  id: number;
  name: string;
  alt_name: string | null;
  latitude: string | null;
  longitude: string | null;
}

export interface ProvinceListResponse {
  success: boolean;
  data: ProvinceResponse[];
  total?: number;
}

export interface ProvinceSingleResponse {
  success: boolean;
  data: ProvinceResponse | null;
}
