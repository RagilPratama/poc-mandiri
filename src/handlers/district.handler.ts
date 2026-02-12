import { DistrictRepository } from "../repositories/district.repository";

const districtRepo = new DistrictRepository();

export const districtHandlers = {
  async getAllDistricts() {
    try {
      const districts = await districtRepo.getAllDistricts();
      const total = await districtRepo.countDistricts();

      return { data: districts, total };
    } catch (error) {
      console.error("Error fetching districts:", error);
      throw error;
    }
  },

  async getDistrictById({ params }: { params: { id: number } }) {
    try {
      const district = await districtRepo.getDistrictById(params.id);

      if (!district) {
        throw new Error("District not found");
      }

      return { data: district };
    } catch (error) {
      console.error("Error fetching district:", error);
      throw error;
    }
  },

  async getDistrictsByRegencyId({ params }: { params: { regency_id: number } }) {
    try {
      const districts = await districtRepo.getDistrictsByRegencyId(params.regency_id);

      return { data: districts, total: districts.length };
    } catch (error) {
      console.error("Error fetching districts by regency:", error);
      throw error;
    }
  },

  async searchDistricts({ query }: { query: { q?: string } }) {
    try {
      if (!query.q || query.q.trim().length === 0) {
        throw new Error("Search query is required");
      }

      const results = await districtRepo.searchDistricts(query.q);

      return { data: results, total: results.length };
    } catch (error) {
      console.error("Error searching districts:", error);
      throw error;
    }
  },
};
