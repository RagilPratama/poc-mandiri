import { VillageRepository } from "../repositories/village.repository";
import { VillageListResponse, VillageSingleResponse, VillageSearchResponse } from "../types/village";
import { successResponse, errorResponse } from "../utils/response";

const villageRepo = new VillageRepository();

export const villageHandlers = {
  async getAllVillages(): Promise<VillageListResponse> {
    try {
      const villages = await villageRepo.getAllVillages();
      const total = await villageRepo.countVillages();

      return successResponse(villages, total) as VillageListResponse;
    } catch (error) {
      console.error("Error fetching villages:", error);
      return {
        ...errorResponse("Failed to fetch villages", error instanceof Error ? error.message : "Unknown error"),
        data: [],
      };
    }
  },

  async getVillageById({ params }: { params: { id: number } }): Promise<VillageSingleResponse> {
    try {
      const village = await villageRepo.getVillageById(params.id);

      if (!village) {
        return {
          ...errorResponse("Village not found"),
          data: null,
        };
      }

      return successResponse(village) as VillageSingleResponse;
    } catch (error) {
      console.error("Error fetching village:", error);
      return {
        ...errorResponse("Failed to fetch village", error instanceof Error ? error.message : "Unknown error"),
        data: null,
      };
    }
  },

  async getVillagesByDistrictId({ params }: { params: { district_id: number } }): Promise<VillageListResponse> {
    try {
      const villages = await villageRepo.getVillagesByDistrictId(params.district_id);

      return successResponse(villages, villages.length) as VillageListResponse;
    } catch (error) {
      console.error("Error fetching villages by district:", error);
      return {
        ...errorResponse("Failed to fetch villages", error instanceof Error ? error.message : "Unknown error"),
        data: [],
      };
    }
  },

  async searchVillages({ query }: { query: { q?: string } }): Promise<VillageSearchResponse> {
    try {
      if (!query.q || query.q.trim().length === 0) {
        return {
          ...errorResponse("Search query is required"),
          data: [],
        };
      }

      const results = await villageRepo.searchVillages(query.q);

      return successResponse(Array.isArray(results) ? results : [], results.length) as VillageSearchResponse;
    } catch (error) {
      console.error("Error searching villages:", error);
      return {
        ...errorResponse("Failed to search villages", error instanceof Error ? error.message : "Unknown error"),
        data: [],
      };
    }
  },
};
