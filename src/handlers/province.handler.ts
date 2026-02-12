import { ProvinceRepository } from "../repositories/province.repository";
import { ProvinceListResponse, ProvinceSingleResponse, ProvinceSearchResponse } from "../types/province";
import { successResponse, errorResponse } from "../utils/response";

const provinceRepo = new ProvinceRepository();

export const provinceHandlers = {
  async getAllProvinces(): Promise<ProvinceListResponse> {
    try {
      const provinces = await provinceRepo.getAllProvinces();
      const total = await provinceRepo.countProvinces();

      return successResponse(provinces, total) as ProvinceListResponse;
    } catch (error) {
      console.error("Error fetching provinces:", error);
      return {
        ...errorResponse("Failed to fetch provinces", error instanceof Error ? error.message : "Unknown error"),
        data: [],
      };
    }
  },

  async getProvinceById({ params }: { params: { id: number } }): Promise<ProvinceSingleResponse> {
    try {
      const province = await provinceRepo.getProvinceById(params.id);

      if (!province) {
        return {
          ...errorResponse("Province not found"),
          data: null,
        };
      }

      return successResponse(province) as ProvinceSingleResponse;
    } catch (error) {
      console.error("Error fetching province:", error);
      return {
        ...errorResponse("Failed to fetch province", error instanceof Error ? error.message : "Unknown error"),
        data: null,
      };
    }
  },

  async searchProvinces({ query }: { query: { q?: string } }): Promise<ProvinceSearchResponse> {
    try {
      if (!query.q || query.q.trim().length === 0) {
        return {
          ...errorResponse("Search query is required"),
          data: [],
        };
      }

      const results = await provinceRepo.searchProvinces(query.q);

      return successResponse(Array.isArray(results) ? results : [], results.length) as ProvinceSearchResponse;
    } catch (error) {
      console.error("Error searching provinces:", error);
      return {
        ...errorResponse("Failed to search provinces", error instanceof Error ? error.message : "Unknown error"),
        data: [],
      };
    }
  },
};
