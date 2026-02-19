import { Context } from 'elysia';
import { SertifikasiRepository } from '../repositories/sertifikasi.repository';
import { successResponse, successResponseWithPagination } from '../utils/response';

const sertifikasiRepo = new SertifikasiRepository();

export const sertifikasiHandler = {
  async getAll({ query }: Context<{ query: any }>) {
    try {
      const result = await sertifikasiRepo.findAll(query);
      return successResponseWithPagination(
        'Data sertifikasi berhasil diambil',
        result.data,
        result.pagination
      );
    } catch (error) {
      console.error('Error getting sertifikasi:', error);
      throw new Error('Gagal mengambil data sertifikasi');
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

      const sertifikasi = await sertifikasiRepo.findById(id);
      if (!sertifikasi) {
        return {
          message: 'Data sertifikasi tidak ditemukan',
        };
      }

      return successResponse('Data sertifikasi berhasil diambil', sertifikasi);
    } catch (error) {
      console.error('Error getting sertifikasi by id:', error);
      throw new Error('Gagal mengambil data sertifikasi');
    }
  },

  async create({ body }: Context<{ body: any }>) {
    try {
      // Validate required fields
      if (!body.no_sertifikat || !body.jenis_sertifikasi_id || !body.kelompok_nelayan_id || 
          !body.tanggal_terbit || !body.tanggal_berlaku || !body.tanggal_kadaluarsa || !body.lembaga_penerbit) {
        return {
          message: 'Semua field wajib diisi',
        };
      }

      const sertifikasi = await sertifikasiRepo.create(body);
      return successResponse('Data sertifikasi berhasil ditambahkan', sertifikasi);
    } catch (error) {
      console.error('Error creating sertifikasi:', error);
      throw new Error('Gagal menambahkan data sertifikasi');
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

      const existing = await sertifikasiRepo.findById(id);
      if (!existing) {
        return {
          message: 'Data sertifikasi tidak ditemukan',
        };
      }

      const sertifikasi = await sertifikasiRepo.update(id, body);
      return successResponse('Data sertifikasi berhasil diupdate', sertifikasi);
    } catch (error) {
      console.error('Error updating sertifikasi:', error);
      throw new Error('Gagal mengupdate data sertifikasi');
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

      const existing = await sertifikasiRepo.findById(id);
      if (!existing) {
        return {
          message: 'Data sertifikasi tidak ditemukan',
        };
      }

      await sertifikasiRepo.delete(id);
      return successResponse('Data sertifikasi berhasil dihapus');
    } catch (error) {
      console.error('Error deleting sertifikasi:', error);
      throw new Error('Gagal menghapus data sertifikasi');
    }
  },
};
