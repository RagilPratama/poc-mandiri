import { VillageRepository } from "../repositories/village.repository";

const villageRepo = new VillageRepository();

export const villageHandlers = {
  async getAllVillages() {
    try {
      const villages = await villageRepo.getAllVillages();
      const total = await villageRepo.countVillages();

      return { data: villages, total };
    } catch (error) {
      console.error("Error fetching villages:", error);
      throw error;
    }
  },

  async getVillageById({ params }: { params: { id: number } }) {
    try {
      const village = await villageRepo.getVillageById(params.id);

      if (!village) {
        throw new Error("Village not found");
      }

      return { data: village };
    } catch (error) {
      console.error("Error fetching village:", error);
      throw error;
    }
  },

  async getVillagesByDistrictId({ params }: { params: { district_id: number } }) {
    try {
      const villages = await villageRepo.getVillagesByDistrictId(params.district_id);

      return { data: villages, total: villages.length };
    } catch (error) {
      console.error("Error fetching villages by district:", error);
      throw error;
    }
  },

  async searchVillages({ query }: { query: { q?: string } }) {
    try {
      if (!query.q || query.q.trim().length === 0) {
        throw new Error("Search query is required");
      }

      const results = await villageRepo.searchVillages(query.q);

      return { data: Array.isArray(results) ? results : [], total: results.length };
    } catch (error) {
      console.error("Error searching villages:", error);
      throw error;
    }
  },
};
