import { Context } from 'elysia';
import { JenisUsahaRepository } from '../repositories/jenis-usaha.repository';
import { successResponse, successResponseWithPagination } from '../utils/response';

const jenisUsahaRepo = new JenisUsahaRepository();

export const jenisUsahaHandler = {
  async getAll({ query }: Context<{ query: any }>) {
    try {
      const result = await jenisUsahaRepo.findAll(query);
      return successResponseWithPagination(
        'Data jenis usaha berhasil diambil',
        result.data,
        result.pagination
      );
    } catch (error) {
      console.error('Error getting jenis usaha:', error);
      throw new Error('Gagal mengambil data jenis usaha');
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

      const jenisUsaha = await jenisUsahaRepo.findById(id);
      if (!jenisUsaha) {
        return {
          message: 'Jenis usaha tidak ditemukan',
        };
      }

      return successResponse('Data jenis usaha berhasil diambil', jenisUsaha);
    } catch (error) {
      console.error('Error getting jenis usaha by id:', error);
      throw new Error('Gagal mengambil data jenis usaha');
    }
  },

  async create({ body }: Context<{ body: any }>) {
    try {
      // Validate required fields
      if (!body.kode_jenis_usaha || !body.nama_jenis_usaha || !body.kategori) {
        return {
          message: 'Kode jenis usaha, nama jenis usaha, dan kategori wajib diisi',
        };
      }

      const jenisUsaha = await jenisUsahaRepo.create(body);
      return successResponse('Jenis usaha berhasil ditambahkan', jenisUsaha);
    } catch (error) {
      console.error('Error creating jenis usaha:', error);
      throw new Error('Gagal menambahkan jenis usaha');
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

      const existing = await jenisUsahaRepo.findById(id);
      if (!existing) {
        return {
          message: 'Jenis usaha tidak ditemukan',
        };
      }

      const jenisUsaha = await jenisUsahaRepo.update(id, body);
      return successResponse('Jenis usaha berhasil diupdate', jenisUsaha);
    } catch (error) {
      console.error('Error updating jenis usaha:', error);
      throw new Error('Gagal mengupdate jenis usaha');
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

      const existing = await jenisUsahaRepo.findById(id);
      if (!existing) {
        return {
          message: 'Jenis usaha tidak ditemukan',
        };
      }

      await jenisUsahaRepo.delete(id);
      return successResponse('Jenis usaha berhasil dihapus');
    } catch (error) {
      console.error('Error deleting jenis usaha:', error);
      throw new Error('Gagal menghapus jenis usaha');
    }
  },
};
