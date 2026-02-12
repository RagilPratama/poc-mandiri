export interface VillageResponse {
  id: number;
  district_id: number;
  name: string;
  alt_name: string | null;
  latitude: number | null;
  longitude: number | null;
}

export interface VillageListResponse {
  success: boolean;
  data: VillageResponse[];
  total?: number;
  error?: string;
  message?: string;
}

export interface VillageSingleResponse {
  success: boolean;
  data: VillageResponse | null;
  error?: string;
  message?: string;
}

export interface VillageSearchResponse {
  success: boolean;
  data: VillageResponse[];
  total?: number;
  error?: string;
  message?: string;
}
