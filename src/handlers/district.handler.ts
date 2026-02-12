import { DistrictRepository } from "../repositories/district.repository";
import { DistrictListResponse, DistrictSingleResponse, DistrictSearchResponse } from "../types/district";
import { successResponse, errorResponse } from "../utils/response";

const districtRepo = new DistrictRepository();

export const districtHandlers = {
  async getAllDistricts(): Promise<DistrictListResponse> {
    try {
      const districts = await districtRepo.getAllDistricts();
      const total = await districtRepo.countDistricts();

      return successResponse(districts, total) as DistrictListResponse;
    } catch (error) {
      console.error("Error fetching districts:", error);
      return {
        ...errorResponse("Failed to fetch districts", error instanceof Error ? error.message : "Unknown error"),
        data: [],
      };
    }
  },

  async getDistrictById({ params }: { params: { id: number } }): Promise<DistrictSingleResponse> {
    try {
      const district = await districtRepo.getDistrictById(params.id);

      if (!district) {
        return {
          ...errorResponse("District not found"),
          data: null,
        };
      }

      return successResponse(district) as DistrictSingleResponse;
    } catch (error) {
      console.error("Error fetching district:", error);
      return {
        ...errorResponse("Failed to fetch district", error instanceof Error ? error.message : "Unknown error"),
        data: null,
      };
    }
  },

  async getDistrictsByRegencyId({ params }: { params: { regency_id: number } }): Promise<DistrictListResponse> {
    try {
      const districts = await districtRepo.getDistrictsByRegencyId(params.regency_id);

      return successResponse(districts, districts.length) as DistrictListResponse;
    } catch (error) {
      console.error("Error fetching districts by regency:", error);
      return {
        ...errorResponse("Failed to fetch districts", error instanceof Error ? error.message : "Unknown error"),
        data: [],
      };
    }
  },

  async searchDistricts({ query }: { query: { q?: string } }): Promise<DistrictSearchResponse> {
    try {
      if (!query.q || query.q.trim().length === 0) {
        return {
          ...errorResponse("Search query is required"),
          data: [],
        };
      }

      const results = await districtRepo.searchDistricts(query.q);

      return successResponse(Array.isArray(results) ? results : [], results.length) as DistrictSearchResponse;
    } catch (error) {
      console.error("Error searching districts:", error);
      return {
        ...errorResponse("Failed to search districts", error instanceof Error ? error.message : "Unknown error"),
        data: [],
      };
    }
  },
};
