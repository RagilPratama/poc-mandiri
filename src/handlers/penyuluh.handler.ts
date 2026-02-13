import { Context } from 'elysia';
import { PenyuluhRepository } from '../repositories/penyuluh.repository';
import type { CreatePenyuluhType, UpdatePenyuluhType, PenyuluhQueryType } from '../types/penyuluh';

const penyuluhRepo = new PenyuluhRepository();

export const penyuluhHandler = {
  async getAll({ query }: Context<{ query: PenyuluhQueryType }>) {
    try {
      const result = await penyuluhRepo.findAll(query);
      return {
        success: true,
        message: 'Data penyuluh berhasil diambil',
        ...result,
      };
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
          success: false,
          message: 'ID tidak valid',
        };
      }

      const penyuluh = await penyuluhRepo.findById(id);
      if (!penyuluh) {
        return {
          success: false,
          message: 'Penyuluh tidak ditemukan',
        };
      }

      return {
        success: true,
        message: 'Data penyuluh berhasil diambil',
        data: penyuluh,
      };
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
          success: false,
          message: 'Pegawai sudah terdaftar sebagai penyuluh',
        };
      }

      const penyuluh = await penyuluhRepo.create(body);
      return {
        success: true,
        message: 'Penyuluh berhasil ditambahkan',
        data: penyuluh,
      };
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
          success: false,
          message: 'ID tidak valid',
        };
      }

      const existing = await penyuluhRepo.findById(id);
      if (!existing) {
        return {
          success: false,
          message: 'Penyuluh tidak ditemukan',
        };
      }

      // Check if pegawai_id is being updated and already exists
      if (body.pegawai_id && body.pegawai_id !== existing.pegawai_id) {
        const existingPenyuluh = await penyuluhRepo.findByPegawaiId(body.pegawai_id);
        if (existingPenyuluh) {
          return {
            success: false,
            message: 'Pegawai sudah terdaftar sebagai penyuluh',
          };
        }
      }

      const penyuluh = await penyuluhRepo.update(id, body);
      return {
        success: true,
        message: 'Penyuluh berhasil diupdate',
        data: penyuluh,
      };
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
          success: false,
          message: 'ID tidak valid',
        };
      }

      const existing = await penyuluhRepo.findById(id);
      if (!existing) {
        return {
          success: false,
          message: 'Penyuluh tidak ditemukan',
        };
      }

      await penyuluhRepo.delete(id);
      return {
        success: true,
        message: 'Penyuluh berhasil dihapus',
      };
    } catch (error) {
      console.error('Error deleting penyuluh:', error);
      throw new Error('Gagal menghapus penyuluh');
    }
  },
};
