import { VillageRepository } from "../repositories/village.repository";
import { VillageListResponse, VillageSingleResponse, VillageSearchResponse } from "../types/village";

const villageRepo = new VillageRepository();

export const villageHandlers = {
  async getAllVillages(): Promise<VillageListResponse> {
    try {
      const villages = await villageRepo.getAllVillages();
      const total = await villageRepo.countVillages();

      return {
        success: true,
        data: villages,
        total,
      };
    } catch (error) {
      console.error("Error fetching villages:", error);
      return {
        success: false,
        error: "Failed to fetch villages",
        message: error instanceof Error ? error.message : "Unknown error",
        data: [],
      };
    }
  },

  async getVillageById({ params }: { params: { id: number } }): Promise<VillageSingleResponse> {
    try {
      const village = await villageRepo.getVillageById(params.id);

      if (!village) {
        return {
          success: false,
          error: "Village not found",
          data: null,
        };
      }

      return {
        success: true,
        data: village,
      };
    } catch (error) {
      console.error("Error fetching village:", error);
      return {
        success: false,
        error: "Failed to fetch village",
        message: error instanceof Error ? error.message : "Unknown error",
        data: null,
      };
    }
  },

  async getVillagesByDistrictId({ params }: { params: { district_id: number } }): Promise<VillageListResponse> {
    try {
      const villages = await villageRepo.getVillagesByDistrictId(params.district_id);

      return {
        success: true,
        data: villages,
        total: villages.length,
      };
    } catch (error) {
      console.error("Error fetching villages by district:", error);
      return {
        success: false,
        error: "Failed to fetch villages",
        message: error instanceof Error ? error.message : "Unknown error",
        data: [],
      };
    }
  },

  async searchVillages({ query }: { query: { q?: string } }): Promise<VillageSearchResponse> {
    try {
      if (!query.q || query.q.trim().length === 0) {
        return {
          success: false,
          error: "Search query is required",
          data: [],
        };
      }

      const results = await villageRepo.searchVillages(query.q);

      return {
        success: true,
        data: Array.isArray(results) ? results : [],
        total: Array.isArray(results) ? results.length : 0,
      };
    } catch (error) {
      console.error("Error searching villages:", error);
      return {
        success: false,
        error: "Failed to search villages",
        message: error instanceof Error ? error.message : "Unknown error",
        data: [],
      };
    }
  },
};
