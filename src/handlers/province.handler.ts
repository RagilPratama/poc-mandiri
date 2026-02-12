import { ProvinceRepository } from "../repositories/province.repository";

const provinceRepo = new ProvinceRepository();

export const provinceHandlers = {
  async getAllProvinces() {
    try {
      const provinces = await provinceRepo.getAllProvinces();
      const total = await provinceRepo.countProvinces();

      return { data: provinces, total };
    } catch (error) {
      console.error("Error fetching provinces:", error);
      throw error;
    }
  },

  async getProvinceById({ params }: { params: { id: number } }) {
    try {
      const province = await provinceRepo.getProvinceById(params.id);

      if (!province) {
        throw new Error("Province not found");
      }

      return { data: province };
    } catch (error) {
      console.error("Error fetching province:", error);
      throw error;
    }
  },

  async searchProvinces({ query }: { query: { q?: string } }) {
    try {
      if (!query.q || query.q.trim().length === 0) {
        throw new Error("Search query is required");
      }

      const results = await provinceRepo.searchProvinces(query.q);

      return { data: results, total: results.length };
    } catch (error) {
      console.error("Error searching provinces:", error);
      throw error;
    }
  },
};
