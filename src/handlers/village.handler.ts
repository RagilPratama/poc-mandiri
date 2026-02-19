import { VillageRepository } from "../repositories/village.repository";
import { successResponse, successResponseWithPagination } from "../utils/response";

const villageRepo = new VillageRepository();

export const villageHandlers = {
  async getAllVillages() {
    try {
      const villages = await villageRepo.getAllVillages();
      const total = await villageRepo.countVillages();

      return successResponseWithPagination(
        "Data desa berhasil diambil",
        villages,
        { total, page: 1, limit: total }
      );
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

      return successResponse("Data desa berhasil diambil", village);
    } catch (error) {
      console.error("Error fetching village:", error);
      throw error;
    }
  },

  async getVillagesByDistrictId({ params }: { params: { district_id: number } }) {
    try {
      const villages = await villageRepo.getVillagesByDistrictId(params.district_id);

      return successResponseWithPagination(
        "Data desa berhasil diambil",
        villages,
        { total: villages.length, page: 1, limit: villages.length }
      );
    } catch (error) {
      console.error("Error fetching villages by district:", error);
      throw error;
    }
  },

  async searchVillages({ query }: { query: { q?: string; district_id?: string } }) {
    try {
      if (!query.q || query.q.trim().length === 0) {
        throw new Error("Search query is required");
      }

      const district_id = query.district_id ? Number(query.district_id) : undefined;
      const results = await villageRepo.searchVillages(query.q, district_id);

      return successResponseWithPagination(
        "Data desa berhasil diambil",
        Array.isArray(results) ? results : [],
        { total: results.length, page: 1, limit: results.length }
      );
    } catch (error) {
      console.error("Error searching villages:", error);
      throw error;
    }
  },

  // Handler baru untuk get villages dengan semua relasi + pagination
  async getAllVillagesWithRelations({ query }: { query: { page?: string; limit?: string } }) {
    try {
      const page = query.page ? parseInt(query.page) : 1;
      const limit = query.limit ? parseInt(query.limit) : 10;

      const result = await villageRepo.getAllVillagesWithRelations(page, limit);
      return successResponseWithPagination(
        "Data desa berhasil diambil",
        result.data,
        result.pagination
      );
    } catch (error) {
      console.error("Error fetching villages with relations:", error);
      throw error;
    }
  },

  // Handler untuk search dengan relasi + pagination
  async searchVillagesWithRelations({ query }: { query: { q?: string; page?: string; limit?: string } }) {
    try {
      const page = query.page ? parseInt(query.page) : 1;
      const limit = query.limit ? parseInt(query.limit) : 10;

      const result = await villageRepo.searchVillagesWithRelations(query.q, page, limit);
      return successResponseWithPagination(
        "Data desa berhasil diambil",
        result.data,
        result.pagination
      );
    } catch (error) {
      console.error("Error searching villages with relations:", error);
      throw error;
    }
  },
};
