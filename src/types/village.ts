export interface VillageResponse {
  id: number;
  district_id: number;
  name: string;
  alt_name: string | null;
  latitude: number | null;
  longitude: number | null;
}

export interface VillageListResponse {
  data: VillageResponse[];
  total: number;
}

export interface VillageSingleResponse {
  data: VillageResponse;
}

export interface VillageSearchResponse {
  data: VillageResponse[];
  total: number;
}
