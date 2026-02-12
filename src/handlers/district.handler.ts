import { DistrictRepository } from "../repositories/district.repository";
import { DistrictListResponse, DistrictSingleResponse, DistrictSearchResponse } from "../types/district";

const districtRepo = new DistrictRepository();

export const districtHandlers = {
  async getAllDistricts(): Promise<DistrictListResponse> {
    try {
      const districts = await districtRepo.getAllDistricts();
      const total = await districtRepo.countDistricts();

      return {
        success: true,
        data: districts,
        total,
      };
    } catch (error) {
      console.error("Error fetching districts:", error);
      return {
        success: false,
        error: "Failed to fetch districts",
        message: error instanceof Error ? error.message : "Unknown error",
        data: [],
      };
    }
  },

  async getDistrictById({ params }: { params: { id: number } }): Promise<DistrictSingleResponse> {
    try {
      const district = await districtRepo.getDistrictById(params.id);

      if (!district) {
        return {
          success: false,
          error: "District not found",
          data: null,
        };
      }

      return {
        success: true,
        data: district,
      };
    } catch (error) {
      console.error("Error fetching district:", error);
      return {
        success: false,
        error: "Failed to fetch district",
        message: error instanceof Error ? error.message : "Unknown error",
        data: null,
      };
    }
  },

  async getDistrictsByRegencyId({ params }: { params: { regency_id: number } }): Promise<DistrictListResponse> {
    try {
      const districts = await districtRepo.getDistrictsByRegencyId(params.regency_id);

      return {
        success: true,
        data: districts,
        total: districts.length,
      };
    } catch (error) {
      console.error("Error fetching districts by regency:", error);
      return {
        success: false,
        error: "Failed to fetch districts",
        message: error instanceof Error ? error.message : "Unknown error",
        data: [],
      };
    }
  },

  async searchDistricts({ query }: { query: { q?: string } }): Promise<DistrictSearchResponse> {
    try {
      if (!query.q || query.q.trim().length === 0) {
        return {
          success: false,
          error: "Search query is required",
          data: [],
        };
      }

      const results = await districtRepo.searchDistricts(query.q);

      return {
        success: true,
        data: Array.isArray(results) ? results : [],
        total: Array.isArray(results) ? results.length : 0,
      };
    } catch (error) {
      console.error("Error searching districts:", error);
      return {
        success: false,
        error: "Failed to search districts",
        message: error instanceof Error ? error.message : "Unknown error",
        data: [],
      };
    }
  },
};
