import { Context } from 'elysia';
import { JenisBantuanRepository } from '../repositories/jenis-bantuan.repository';
import { successResponse, successResponseWithPagination } from '../utils/response';

const jenisBantuanRepo = new JenisBantuanRepository();

export const jenisBantuanHandler = {
  async getAll({ query }: Context<{ query: any }>) {
    try {
      const result = await jenisBantuanRepo.findAll(query);
      return successResponseWithPagination(
        'Data jenis bantuan berhasil diambil',
        result.data,
        result.pagination
      );
    } catch (error) {
      console.error('Error getting jenis bantuan:', error);
      throw new Error('Gagal mengambil data jenis bantuan');
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

      const jenisBantuan = await jenisBantuanRepo.findById(id);
      if (!jenisBantuan) {
        return {
          message: 'Jenis bantuan tidak ditemukan',
        };
      }

      return successResponse('Data jenis bantuan berhasil diambil', jenisBantuan);
    } catch (error) {
      console.error('Error getting jenis bantuan by id:', error);
      throw new Error('Gagal mengambil data jenis bantuan');
    }
  },

  async create({ body }: Context<{ body: any }>) {
    try {
      // Validate required fields
      if (!body.kode_jenis_bantuan || !body.nama_jenis_bantuan || !body.kategori) {
        return {
          message: 'Kode jenis bantuan, nama jenis bantuan, dan kategori wajib diisi',
        };
      }

      const jenisBantuan = await jenisBantuanRepo.create(body);
      return successResponse('Jenis bantuan berhasil ditambahkan', jenisBantuan);
    } catch (error) {
      console.error('Error creating jenis bantuan:', error);
      throw new Error('Gagal menambahkan jenis bantuan');
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

      const existing = await jenisBantuanRepo.findById(id);
      if (!existing) {
        return {
          message: 'Jenis bantuan tidak ditemukan',
        };
      }

      const jenisBantuan = await jenisBantuanRepo.update(id, body);
      return successResponse('Jenis bantuan berhasil diupdate', jenisBantuan);
    } catch (error) {
      console.error('Error updating jenis bantuan:', error);
      throw new Error('Gagal mengupdate jenis bantuan');
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

      const existing = await jenisBantuanRepo.findById(id);
      if (!existing) {
        return {
          message: 'Jenis bantuan tidak ditemukan',
        };
      }

      await jenisBantuanRepo.delete(id);
      return successResponse('Jenis bantuan berhasil dihapus');
    } catch (error) {
      console.error('Error deleting jenis bantuan:', error);
      throw new Error('Gagal menghapus jenis bantuan');
    }
  },
};
