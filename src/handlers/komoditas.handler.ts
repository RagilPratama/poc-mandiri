import { Context } from 'elysia';
import { KomoditasRepository } from '../repositories/komoditas.repository';
import { successResponse, successResponseWithPagination } from '../utils/response';

const komoditasRepo = new KomoditasRepository();

export const komoditasHandler = {
  async getAll({ query }: Context<{ query: any }>) {
    try {
      const result = await komoditasRepo.findAll(query);
      return successResponseWithPagination(
        'Data komoditas berhasil diambil',
        result.data,
        result.pagination
      );
    } catch (error) {
      console.error('Error getting komoditas:', error);
      throw new Error('Gagal mengambil data komoditas');
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

      const komoditas = await komoditasRepo.findById(id);
      if (!komoditas) {
        return {
          message: 'Komoditas tidak ditemukan',
        };
      }

      return successResponse('Data komoditas berhasil diambil', komoditas);
    } catch (error) {
      console.error('Error getting komoditas by id:', error);
      throw new Error('Gagal mengambil data komoditas');
    }
  },

  async create({ body }: Context<{ body: any }>) {
    try {
      // Validate required fields
      if (!body.kode_komoditas || !body.nama_komoditas || !body.kategori || !body.satuan) {
        return {
          message: 'Kode komoditas, nama komoditas, kategori, dan satuan wajib diisi',
        };
      }

      const komoditas = await komoditasRepo.create(body);
      return successResponse('Komoditas berhasil ditambahkan', komoditas);
    } catch (error) {
      console.error('Error creating komoditas:', error);
      throw new Error('Gagal menambahkan komoditas');
    }
  },

  async update({ params, body }: Context<{ params: { id: string }; body: any }>) {
    try {
      const id = parseInt(params.id);
      if (isNaN(id)) {
        return {
          message: 'ID tidak valid',
        };
      }

      const existing = await komoditasRepo.findById(id);
      if (!existing) {
        return {
          message: 'Komoditas tidak ditemukan',
        };
      }

      const komoditas = await komoditasRepo.update(id, body);
      return successResponse('Komoditas berhasil diupdate', komoditas);
    } catch (error) {
      console.error('Error updating komoditas:', error);
      throw new Error('Gagal mengupdate komoditas');
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

      const existing = await komoditasRepo.findById(id);
      if (!existing) {
        return {
          message: 'Komoditas tidak ditemukan',
        };
      }

      await komoditasRepo.delete(id);
      return successResponse('Komoditas berhasil dihapus');
    } catch (error) {
      console.error('Error deleting komoditas:', error);
      throw new Error('Gagal menghapus komoditas');
    }
  },
};
