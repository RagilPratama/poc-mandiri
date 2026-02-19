import { AlatTangkapRepository } from '../repositories/alat-tangkap.repository';
import { successResponse, successResponseWithPagination } from '../utils/response';

const alatTangkapRepo = new AlatTangkapRepository();

export const alatTangkapHandler = {
  async getAll({ query }: any) {
    try {
      const result = await alatTangkapRepo.findAll(query);
      return successResponseWithPagination(
        'Data alat tangkap berhasil diambil',
        result.data,
        result.pagination
      );
    } catch (error) {
      console.error('Error getting alat tangkap:', error);
      throw new Error('Gagal mengambil data alat tangkap');
    }
  },

  async getById({ params }: any) {
    try {
      const id = parseInt(params.id);
      if (isNaN(id)) {
        return {
          message: 'ID tidak valid',
        };
      }

      const alatTangkap = await alatTangkapRepo.findById(id);
      if (!alatTangkap) {
        return {
          message: 'Alat tangkap tidak ditemukan',
        };
      }

      return successResponse('Data alat tangkap berhasil diambil', alatTangkap);
    } catch (error) {
      console.error('Error getting alat tangkap by id:', error);
      throw new Error('Gagal mengambil data alat tangkap');
    }
  },

  async create({ body }: any) {
    try {
      // Validate required fields
      if (!body.kode_alat_tangkap || !body.nama_alat_tangkap || !body.jenis) {
        return {
          message: 'Kode alat tangkap, nama alat tangkap, dan jenis wajib diisi',
        };
      }

      const alatTangkap = await alatTangkapRepo.create(body);
      return successResponse('Alat tangkap berhasil ditambahkan', alatTangkap);
    } catch (error) {
      console.error('Error creating alat tangkap:', error);
      throw new Error('Gagal menambahkan alat tangkap');
    }
  },

  async update({ params, body }: any) {
    try {
      const id = parseInt(params.id);
      if (isNaN(id)) {
        return {
          message: 'ID tidak valid',
        };
      }

      const existing = await alatTangkapRepo.findById(id);
      if (!existing) {
        return {
          message: 'Alat tangkap tidak ditemukan',
        };
      }

      const alatTangkap = await alatTangkapRepo.update(id, body);
      return successResponse('Alat tangkap berhasil diupdate', alatTangkap);
    } catch (error) {
      console.error('Error updating alat tangkap:', error);
      throw new Error('Gagal mengupdate alat tangkap');
    }
  },

  async delete({ params }: any) {
    try {
      const id = parseInt(params.id);
      if (isNaN(id)) {
        return {
          message: 'ID tidak valid',
        };
      }

      const existing = await alatTangkapRepo.findById(id);
      if (!existing) {
        return {
          message: 'Alat tangkap tidak ditemukan',
        };
      }

      await alatTangkapRepo.delete(id);
      return successResponse('Alat tangkap berhasil dihapus');
    } catch (error) {
      console.error('Error deleting alat tangkap:', error);
      throw new Error('Gagal menghapus alat tangkap');
    }
  },
};
