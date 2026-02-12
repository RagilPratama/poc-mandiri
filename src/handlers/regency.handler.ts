import { RegencyRepository } from "../repositories/regency.repository";

const regencyRepo = new RegencyRepository();

export const regencyHandlers = {
  async getAllRegencies() {
    try {
      const regencies = await regencyRepo.getAllRegencies();
      const total = await regencyRepo.countRegencies();

      return { data: regencies, total };
    } catch (error) {
      console.error("Error fetching regencies:", error);
      throw error;
    }
  },

  async getRegencyById({ params }: { params: { id: number } }) {
    try {
      const regency = await regencyRepo.getRegencyById(params.id);

      if (!regency) {
        throw new Error("Regency not found");
      }

      return { data: regency };
    } catch (error) {
      console.error("Error fetching regency:", error);
      throw error;
    }
  },

  async getRegenciesByProvinceId({ params }: { params: { province_id: number } }) {
    try {
      const regencies = await regencyRepo.getRegenciesByProvinceId(params.province_id);

      return { data: regencies, total: regencies.length };
    } catch (error) {
      console.error("Error fetching regencies by province:", error);
      throw error;
    }
  },

  async searchRegencies({ query }: { query: { q?: string } }) {
    try {
      if (!query.q || query.q.trim().length === 0) {
        throw new Error("Search query is required");
      }

      const results = await regencyRepo.searchRegencies(query.q);

      return { data: Array.isArray(results) ? results : [], total: results.length };
    } catch (error) {
      console.error("Error searching regencies:", error);
      throw error;
    }
  },
};
