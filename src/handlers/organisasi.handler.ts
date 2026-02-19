import { OrganisasiRepository } from '../repositories/organisasi.repository';
import { successResponse, successResponseWithPagination } from '../utils/response';
import type { CreateOrganisasiDTO, UpdateOrganisasiDTO } from '../types/organisasi';

const organisasiRepo = new OrganisasiRepository();

export const organisasiHandlers = {
  async getAll({ query }: { query: { page?: string; limit?: string; search?: string } }) {
    try {
      const page = query.page ? parseInt(query.page) : 1;
      const limit = query.limit ? parseInt(query.limit) : 10;
      const search = query.search;

      const result = await organisasiRepo.findAll(page, limit, search);
      return successResponseWithPagination(
        "Data organisasi berhasil diambil",
        result.data,
        result.pagination
      );
    } catch (error) {
      console.error('Error fetching organisasi:', error);
      throw error;
    }
  },

  async getById({ params }: { params: { id: number } }) {
    try {
      const org = await organisasiRepo.findById(params.id);
      
      if (!org) {
        throw new Error("Organisasi not found");
      }

      return successResponse("Data organisasi berhasil diambil", org);
    } catch (error) {
      console.error('Error fetching organisasi:', error);
      throw error;
    }
  },

  async create({ body }: { body: CreateOrganisasiDTO }) {
    try {
      const org = await organisasiRepo.create(body);
      
      return successResponse("Organisasi berhasil ditambahkan", org);
    } catch (error) {
      console.error('Error creating organisasi:', error);
      throw error;
    }
  },

  async update({ params, body }: { params: { id: number }; body: UpdateOrganisasiDTO }) {
    try {
      const org = await organisasiRepo.update(params.id, body);
      
      if (!org) {
        throw new Error("Organisasi not found");
      }

      return successResponse("Organisasi berhasil diupdate", org);
    } catch (error) {
      console.error('Error updating organisasi:', error);
      throw error;
    }
  },

  async delete({ params }: { params: { id: number } }) {
    try {
      const org = await organisasiRepo.delete(params.id);
      
      if (!org) {
        throw new Error("Organisasi not found");
      }

      return successResponse("Organisasi berhasil dihapus");
    } catch (error) {
      console.error('Error deleting organisasi:', error);
      throw error;
    }
  },
};
