import { Context } from 'elysia';
import { JenisSertifikasiRepository } from '../repositories/jenis-sertifikasi.repository';
import { successResponse, successResponseWithPagination } from '../utils/response';

const jenisSertifikasiRepo = new JenisSertifikasiRepository();

export const jenisSertifikasiHandler = {
  async getAll({ query }: Context<{ query: any }>) {
    try {
      const result = await jenisSertifikasiRepo.findAll(query);
      return successResponseWithPagination(
        'Data jenis sertifikasi berhasil diambil',
        result.data,
        result.pagination
      );
    } catch (error) {
      console.error('Error getting jenis sertifikasi:', error);
      throw new Error('Gagal mengambil data jenis sertifikasi');
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

      const jenisSertifikasi = await jenisSertifikasiRepo.findById(id);
      if (!jenisSertifikasi) {
        return {
          message: 'Jenis sertifikasi tidak ditemukan',
        };
      }

      return successResponse('Data jenis sertifikasi berhasil diambil', jenisSertifikasi);
    } catch (error) {
      console.error('Error getting jenis sertifikasi by id:', error);
      throw new Error('Gagal mengambil data jenis sertifikasi');
    }
  },

  async create({ body }: Context<{ body: any }>) {
    try {
      // Validate required fields
      if (!body.kode_jenis_sertifikasi || !body.nama_jenis_sertifikasi || !body.kategori || !body.lembaga_penerbit) {
        return {
          message: 'Kode jenis sertifikasi, nama jenis sertifikasi, kategori, dan lembaga penerbit wajib diisi',
        };
      }

      const jenisSertifikasi = await jenisSertifikasiRepo.create(body);
      return successResponse('Jenis sertifikasi berhasil ditambahkan', jenisSertifikasi);
    } catch (error) {
      console.error('Error creating jenis sertifikasi:', error);
      throw new Error('Gagal menambahkan jenis sertifikasi');
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

      const existing = await jenisSertifikasiRepo.findById(id);
      if (!existing) {
        return {
          message: 'Jenis sertifikasi tidak ditemukan',
        };
      }

      const jenisSertifikasi = await jenisSertifikasiRepo.update(id, body);
      return successResponse('Jenis sertifikasi berhasil diupdate', jenisSertifikasi);
    } catch (error) {
      console.error('Error updating jenis sertifikasi:', error);
      throw new Error('Gagal mengupdate jenis sertifikasi');
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

      const existing = await jenisSertifikasiRepo.findById(id);
      if (!existing) {
        return {
          message: 'Jenis sertifikasi tidak ditemukan',
        };
      }

      await jenisSertifikasiRepo.delete(id);
      return successResponse('Jenis sertifikasi berhasil dihapus');
    } catch (error) {
      console.error('Error deleting jenis sertifikasi:', error);
      throw new Error('Gagal menghapus jenis sertifikasi');
    }
  },
};
