import { ProvinceRepository } from "../repositories/province.repository";

const provinceRepo = new ProvinceRepository();

export const provinceHandlers = {
  async getAllProvinces() {
    try {
      const provinces = await provinceRepo.getAllProvinces();
      const total = await provinceRepo.countProvinces();

      return {
        success: true,
        data: provinces,
        total,
      };
    } catch (error) {
      console.error("Error fetching provinces:", error);
      return {
        success: false,
        error: "Failed to fetch provinces",
        message: error instanceof Error ? error.message : "Unknown error",
        data: [],
      };
    }
  },

  async getProvinceById({ params }: { params: { id: number } }) {
    try {
      const province = await provinceRepo.getProvinceById(params.id);

      if (!province) {
        return {
          success: false,
          error: "Province not found",
          data: null,
        };
      }

      return {
        success: true,
        data: province,
      };
    } catch (error) {
      console.error("Error fetching province:", error);
      return {
        success: false,
        error: "Failed to fetch province",
        message: error instanceof Error ? error.message : "Unknown error",
        data: null,
      };
    }
  },

  async searchProvinces({ query }: { query: { q?: string } }) {
    try {
      if (!query.q || query.q.trim().length === 0) {
        return {
          success: false,
          error: "Search query is required",
          data: [],
        };
      }

      const results = await provinceRepo.searchProvinces(query.q);

      return {
        success: true,
        data: Array.isArray(results) ? results : [],
        total: Array.isArray(results) ? results.length : 0,
      };
    } catch (error) {
      console.error("Error searching provinces:", error);
      return {
        success: false,
        error: "Failed to search provinces",
        message: error instanceof Error ? error.message : "Unknown error",
        data: [],
      };
    }
  },
};
