import { RegencyRepository } from "../repositories/regency.repository";
import { RegencyListResponse, RegencySingleResponse, RegencySearchResponse } from "../types/regency";
import { successResponse, errorResponse } from "../utils/response";

const regencyRepo = new RegencyRepository();

export const regencyHandlers = {
  async getAllRegencies(): Promise<RegencyListResponse> {
    try {
      const regencies = await regencyRepo.getAllRegencies();
      const total = await regencyRepo.countRegencies();

      return successResponse(regencies, total) as RegencyListResponse;
    } catch (error) {
      console.error("Error fetching regencies:", error);
      return {
        ...errorResponse("Failed to fetch regencies", error instanceof Error ? error.message : "Unknown error"),
        data: [],
      };
    }
  },

  async getRegencyById({ params }: { params: { id: number } }): Promise<RegencySingleResponse> {
    try {
      const regency = await regencyRepo.getRegencyById(params.id);

      if (!regency) {
        return {
          ...errorResponse("Regency not found"),
          data: null,
        };
      }

      return successResponse(regency) as RegencySingleResponse;
    } catch (error) {
      console.error("Error fetching regency:", error);
      return {
        ...errorResponse("Failed to fetch regency", error instanceof Error ? error.message : "Unknown error"),
        data: null,
      };
    }
  },

  async getRegenciesByProvinceId({ params }: { params: { province_id: number } }): Promise<RegencyListResponse> {
    try {
      const regencies = await regencyRepo.getRegenciesByProvinceId(params.province_id);

      return successResponse(regencies, regencies.length) as RegencyListResponse;
    } catch (error) {
      console.error("Error fetching regencies by province:", error);
      return {
        ...errorResponse("Failed to fetch regencies", error instanceof Error ? error.message : "Unknown error"),
        data: [],
      };
    }
  },

  async searchRegencies({ query }: { query: { q?: string } }): Promise<RegencySearchResponse> {
    try {
      if (!query.q || query.q.trim().length === 0) {
        return {
          ...errorResponse("Search query is required"),
          data: [],
        };
      }

      const results = await regencyRepo.searchRegencies(query.q);

      return successResponse(Array.isArray(results) ? results : [], results.length) as RegencySearchResponse;
    } catch (error) {
      console.error("Error searching regencies:", error);
      return {
        ...errorResponse("Failed to search regencies", error instanceof Error ? error.message : "Unknown error"),
        data: [],
      };
    }
  },
};
