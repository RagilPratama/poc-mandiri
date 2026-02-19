import { Context } from 'elysia';
import { JenisPelatihanRepository } from '../repositories/jenis-pelatihan.repository';
import { successResponse, successResponseWithPagination } from '../utils/response';

const jenisPelatihanRepo = new JenisPelatihanRepository();

export const jenisPelatihanHandler = {
  async getAll({ query }: Context<{ query: any }>) {
    try {
      const result = await jenisPelatihanRepo.findAll(query);
      return successResponseWithPagination(
        'Data jenis pelatihan berhasil diambil',
        result.data,
        result.pagination
      );
    } catch (error) {
      console.error('Error getting jenis pelatihan:', error);
      throw new Error('Gagal mengambil data jenis pelatihan');
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

      const jenisPelatihan = await jenisPelatihanRepo.findById(id);
      if (!jenisPelatihan) {
        return {
          message: 'Jenis pelatihan tidak ditemukan',
        };
      }

      return successResponse('Data jenis pelatihan berhasil diambil', jenisPelatihan);
    } catch (error) {
      console.error('Error getting jenis pelatihan by id:', error);
      throw new Error('Gagal mengambil data jenis pelatihan');
    }
  },

  async create({ body }: Context<{ body: any }>) {
    try {
      // Validate required fields
      if (!body.kode_jenis_pelatihan || !body.nama_jenis_pelatihan || !body.kategori) {
        return {
          message: 'Kode jenis pelatihan, nama jenis pelatihan, dan kategori wajib diisi',
        };
      }

      const jenisPelatihan = await jenisPelatihanRepo.create(body);
      return successResponse('Jenis pelatihan berhasil ditambahkan', jenisPelatihan);
    } catch (error) {
      console.error('Error creating jenis pelatihan:', error);
      throw new Error('Gagal menambahkan jenis pelatihan');
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

      const existing = await jenisPelatihanRepo.findById(id);
      if (!existing) {
        return {
          message: 'Jenis pelatihan tidak ditemukan',
        };
      }

      const jenisPelatihan = await jenisPelatihanRepo.update(id, body);
      return successResponse('Jenis pelatihan berhasil diupdate', jenisPelatihan);
    } catch (error) {
      console.error('Error updating jenis pelatihan:', error);
      throw new Error('Gagal mengupdate jenis pelatihan');
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

      const existing = await jenisPelatihanRepo.findById(id);
      if (!existing) {
        return {
          message: 'Jenis pelatihan tidak ditemukan',
        };
      }

      await jenisPelatihanRepo.delete(id);
      return successResponse('Jenis pelatihan berhasil dihapus');
    } catch (error) {
      console.error('Error deleting jenis pelatihan:', error);
      throw new Error('Gagal menghapus jenis pelatihan');
    }
  },
};
