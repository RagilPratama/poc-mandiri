import { ProvinceRepository } from "../repositories/province.repository";
import { successResponse, successResponseWithPagination } from "../utils/response";

const provinceRepo = new ProvinceRepository();

export const provinceHandlers = {
  async getAllProvinces() {
    try {
      const provinces = await provinceRepo.getAllProvinces();
      const total = await provinceRepo.countProvinces();

      return successResponseWithPagination(
        "Data provinsi berhasil diambil",
        provinces,
        { total, page: 1, limit: total }
      );
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

      return successResponse("Data provinsi berhasil diambil", province);
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

      return successResponseWithPagination(
        "Data provinsi berhasil diambil",
        results,
        { total: results.length, page: 1, limit: results.length }
      );
    } catch (error) {
      console.error("Error searching provinces:", error);
      throw error;
    }
  },
};
