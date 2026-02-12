import { RegencyRepository } from "../repositories/regency.repository";
import { RegencyListResponse, RegencySingleResponse, RegencySearchResponse } from "../types/regency";

const regencyRepo = new RegencyRepository();

export const regencyHandlers = {
  async getAllRegencies(): Promise<RegencyListResponse> {
    try {
      const regencies = await regencyRepo.getAllRegencies();
      const total = await regencyRepo.countRegencies();

      return {
        success: true,
        data: regencies,
        total,
      };
    } catch (error) {
      console.error("Error fetching regencies:", error);
      return {
        success: false,
        error: "Failed to fetch regencies",
        message: error instanceof Error ? error.message : "Unknown error",
        data: [],
      };
    }
  },

  async getRegencyById({ params }: { params: { id: number } }): Promise<RegencySingleResponse> {
    try {
      const regency = await regencyRepo.getRegencyById(params.id);

      if (!regency) {
        return {
          success: false,
          error: "Regency not found",
          data: null,
        };
      }

      return {
        success: true,
        data: regency,
      };
    } catch (error) {
      console.error("Error fetching regency:", error);
      return {
        success: false,
        error: "Failed to fetch regency",
        message: error instanceof Error ? error.message : "Unknown error",
        data: null,
      };
    }
  },

  async getRegenciesByProvinceId({ params }: { params: { province_id: number } }): Promise<RegencyListResponse> {
    try {
      const regencies = await regencyRepo.getRegenciesByProvinceId(params.province_id);

      return {
        success: true,
        data: regencies,
        total: regencies.length,
      };
    } catch (error) {
      console.error("Error fetching regencies by province:", error);
      return {
        success: false,
        error: "Failed to fetch regencies",
        message: error instanceof Error ? error.message : "Unknown error",
        data: [],
      };
    }
  },

  async searchRegencies({ query }: { query: { q?: string } }): Promise<RegencySearchResponse> {
    try {
      if (!query.q || query.q.trim().length === 0) {
        return {
          success: false,
          error: "Search query is required",
          data: [],
        };
      }

      const results = await regencyRepo.searchRegencies(query.q);

      return {
        success: true,
        data: Array.isArray(results) ? results : [],
        total: Array.isArray(results) ? results.length : 0,
      };
    } catch (error) {
      console.error("Error searching regencies:", error);
      return {
        success: false,
        error: "Failed to search regencies",
        message: error instanceof Error ? error.message : "Unknown error",
        data: [],
      };
    }
  },
};
