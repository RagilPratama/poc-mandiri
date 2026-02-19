import { unitPelaksanaanTeknisRepository } from '../repositories/unit-pelaksanaan-teknis.repository';
import { successResponse } from '../utils/response';
import type { CreateUnitPelaksanaanTeknisDTO, UpdateUnitPelaksanaanTeknisDTO } from '../types/unit-pelaksanaan-teknis';

export const unitPelaksanaanTeknisHandler = {
  async getAll() {
    try {
      const data = await unitPelaksanaanTeknisRepository.findAll();
      return successResponse("Data UPT berhasil diambil", data);
    } catch (error) {
      console.error('Error fetching unit pelaksanaan teknis:', error);
      throw new Error('Failed to fetch unit pelaksanaan teknis');
    }
  },

  async getById({ params }: { params: { id: number } }) {
    try {
      const data = await unitPelaksanaanTeknisRepository.findById(params.id);
      
      if (!data) {
        throw new Error("Unit pelaksanaan teknis not found");
      }

      return successResponse("Data UPT berhasil diambil", data);
    } catch (error) {
      console.error('Error fetching unit pelaksanaan teknis:', error);
      throw error;
    }
  },

  async create({ body }: { body: CreateUnitPelaksanaanTeknisDTO }) {
    try {
      const data = await unitPelaksanaanTeknisRepository.create(body);
      
      return successResponse("UPT berhasil ditambahkan", data);
    } catch (error) {
      console.error('Error creating unit pelaksanaan teknis:', error);
      throw new Error('Failed to create unit pelaksanaan teknis');
    }
  },

  async update({ params, body }: { params: { id: number }; body: UpdateUnitPelaksanaanTeknisDTO }) {
    try {
      const data = await unitPelaksanaanTeknisRepository.update(params.id, body);
      
      if (!data) {
        throw new Error("Unit pelaksanaan teknis not found");
      }

      return successResponse("UPT berhasil diupdate", data);
    } catch (error) {
      console.error('Error updating unit pelaksanaan teknis:', error);
      throw error;
    }
  },

  async delete({ params }: { params: { id: number } }) {
    try {
      const data = await unitPelaksanaanTeknisRepository.delete(params.id);
      
      if (!data) {
        throw new Error("Unit pelaksanaan teknis not found");
      }

      return successResponse("UPT berhasil dihapus");
    } catch (error) {
      console.error('Error deleting unit pelaksanaan teknis:', error);
      throw error;
    }
  },
};
