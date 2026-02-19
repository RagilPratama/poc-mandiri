import { RegencyRepository } from "../repositories/regency.repository";
import { successResponse, successResponseWithPagination } from "../utils/response";

const regencyRepo = new RegencyRepository();

export const regencyHandlers = {
  async getAllRegencies() {
    try {
      const regencies = await regencyRepo.getAllRegencies();
      const total = await regencyRepo.countRegencies();

      return successResponseWithPagination(
        "Data kabupaten berhasil diambil",
        regencies,
        { total, page: 1, limit: total }
      );
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

      return successResponse("Data kabupaten berhasil diambil", regency);
    } catch (error) {
      console.error("Error fetching regency:", error);
      throw error;
    }
  },

  async getRegenciesByProvinceId({ params }: { params: { province_id: number } }) {
    try {
      const regencies = await regencyRepo.getRegenciesByProvinceId(params.province_id);

      return successResponseWithPagination(
        "Data kabupaten berhasil diambil",
        regencies,
        { total: regencies.length, page: 1, limit: regencies.length }
      );
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

      return successResponseWithPagination(
        "Data kabupaten berhasil diambil",
        Array.isArray(results) ? results : [],
        { total: results.length, page: 1, limit: results.length }
      );
    } catch (error) {
      console.error("Error searching regencies:", error);
      throw error;
    }
  },
};
