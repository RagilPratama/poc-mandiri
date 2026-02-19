import { Context } from 'elysia';
import { PenyuluhRepository } from '../repositories/penyuluh.repository';
import { successResponse, successResponseWithPagination } from '../utils/response';
import type { CreatePenyuluhType, UpdatePenyuluhType, PenyuluhQueryType } from '../types/penyuluh';

const penyuluhRepo = new PenyuluhRepository();

export const penyuluhHandler = {
  async getAll({ query }: Context<{ query: PenyuluhQueryType }>) {
    try {
      const result = await penyuluhRepo.findAll(query);
      return successResponseWithPagination(
        "Data penyuluh berhasil diambil",
        result.data,
        result.pagination
      );
    } catch (error) {
      console.error('Error getting penyuluh:', error);
      throw new Error('Gagal mengambil data penyuluh');
    }
  },

  async getById({ params }: Context<{ params: { id: string } }>) {
    try {
      const id = parseInt(params.id);
      if (isNaN(id)) {
        return {
          message: 'ID tidak valid',
        };
      }

      const penyuluh = await penyuluhRepo.findById(id);
      if (!penyuluh) {
        return {
          message: 'Penyuluh tidak ditemukan',
        };
      }

      return successResponse("Data penyuluh berhasil diambil", penyuluh);
    } catch (error) {
      console.error('Error getting penyuluh by id:', error);
      throw new Error('Gagal mengambil data penyuluh');
    }
  },

  async create({ body }: Context<{ body: CreatePenyuluhType }>) {
    try {
      // Check if pegawai already registered as penyuluh
      const existingPenyuluh = await penyuluhRepo.findByPegawaiId(body.pegawai_id);
      if (existingPenyuluh) {
        return {
          message: 'Pegawai sudah terdaftar sebagai penyuluh',
        };
      }

      const penyuluh = await penyuluhRepo.create(body);
      return successResponse("Penyuluh berhasil ditambahkan", penyuluh);
    } catch (error) {
      console.error('Error creating penyuluh:', error);
      throw new Error('Gagal menambahkan penyuluh');
    }
  },

  async update({ params, body }: Context<{ params: { id: string }; body: UpdatePenyuluhType }>) {
    try {
      const id = parseInt(params.id);
      if (isNaN(id)) {
        return {
          message: 'ID tidak valid',
        };
      }

      const existing = await penyuluhRepo.findById(id);
      if (!existing) {
        return {
          message: 'Penyuluh tidak ditemukan',
        };
      }

      // Check if pegawai_id is being updated and already exists
      if (body.pegawai_id && body.pegawai_id !== existing.pegawai_id) {
        const existingPenyuluh = await penyuluhRepo.findByPegawaiId(body.pegawai_id);
        if (existingPenyuluh) {
          return {
            message: 'Pegawai sudah terdaftar sebagai penyuluh',
          };
        }
      }

      const penyuluh = await penyuluhRepo.update(id, body);
      return successResponse("Penyuluh berhasil diupdate", penyuluh);
    } catch (error) {
      console.error('Error updating penyuluh:', error);
      throw new Error('Gagal mengupdate penyuluh');
    }
  },

  async delete({ params }: Context<{ params: { id: string } }>) {
    try {
      const id = parseInt(params.id);
      if (isNaN(id)) {
        return {
          message: 'ID tidak valid',
        };
      }

      const existing = await penyuluhRepo.findById(id);
      if (!existing) {
        return {
          message: 'Penyuluh tidak ditemukan',
        };
      }

      await penyuluhRepo.delete(id);
      return successResponse("Penyuluh berhasil dihapus");
    } catch (error) {
      console.error('Error deleting penyuluh:', error);
      throw new Error('Gagal menghapus penyuluh');
    }
  },
};
