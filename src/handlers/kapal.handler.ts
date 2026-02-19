import { Context } from 'elysia';
import { KapalRepository } from '../repositories/kapal.repository';
import { successResponse, successResponseWithPagination } from '../utils/response';

const kapalRepo = new KapalRepository();

export const kapalHandler = {
  async getAll({ query }: Context<{ query: any }>) {
    try {
      const result = await kapalRepo.findAll(query);
      return successResponseWithPagination(
        'Data kapal berhasil diambil',
        result.data,
        result.pagination
      );
    } catch (error) {
      console.error('Error getting kapal:', error);
      throw new Error('Gagal mengambil data kapal');
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

      const kapal = await kapalRepo.findById(id);
      if (!kapal) {
        return {
          message: 'Kapal tidak ditemukan',
        };
      }

      return successResponse('Data kapal berhasil diambil', kapal);
    } catch (error) {
      console.error('Error getting kapal by id:', error);
      throw new Error('Gagal mengambil data kapal');
    }
  },

  async create({ body }: Context<{ body: any }>) {
    try {
      // Validate required fields
      if (!body.kelompok_nelayan_id || !body.no_registrasi_kapal || !body.nama_kapal || !body.jenis_kapal) {
        return {
          message: 'Kelompok nelayan, nomor registrasi, nama kapal, dan jenis kapal wajib diisi',
        };
      }

      const kapal = await kapalRepo.create(body);
      return successResponse('Kapal berhasil ditambahkan', kapal);
    } catch (error) {
      console.error('Error creating kapal:', error);
      throw new Error('Gagal menambahkan kapal');
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

      const existing = await kapalRepo.findById(id);
      if (!existing) {
        return {
          message: 'Kapal tidak ditemukan',
        };
      }

      const kapal = await kapalRepo.update(id, body);
      return successResponse('Kapal berhasil diupdate', kapal);
    } catch (error) {
      console.error('Error updating kapal:', error);
      throw new Error('Gagal mengupdate kapal');
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

      const existing = await kapalRepo.findById(id);
      if (!existing) {
        return {
          message: 'Kapal tidak ditemukan',
        };
      }

      await kapalRepo.delete(id);
      return successResponse('Kapal berhasil dihapus');
    } catch (error) {
      console.error('Error deleting kapal:', error);
      throw new Error('Gagal menghapus kapal');
    }
  },
};
