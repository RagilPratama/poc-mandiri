import { PelatihanRepository } from '../repositories/pelatihan.repository';
import { successResponse, successResponseWithPagination } from '../utils/response';

const pelatihanRepo = new PelatihanRepository();

export const pelatihanHandler = {
  async getAll({ query }: any) {
    try {
      const result = await pelatihanRepo.findAll(query);
      return successResponseWithPagination(
        'Data pelatihan berhasil diambil',
        result.data,
        result.pagination
      );
    } catch (error) {
      console.error('Error getting pelatihan:', error);
      throw new Error('Gagal mengambil data pelatihan');
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

      const pelatihan = await pelatihanRepo.findById(id);
      if (!pelatihan) {
        return {
          message: 'Data pelatihan tidak ditemukan',
        };
      }

      return successResponse('Data pelatihan berhasil diambil', pelatihan);
    } catch (error) {
      console.error('Error getting pelatihan by id:', error);
      throw new Error('Gagal mengambil data pelatihan');
    }
  },

  async create({ body }: any) {
    try {
      // Validate required fields
      if (!body.no_pelatihan || !body.jenis_pelatihan_id || !body.nama_pelatihan || !body.penyelenggara || 
          !body.tanggal_mulai || !body.tanggal_selesai || !body.lokasi || !body.target_peserta) {
        return {
          message: 'Semua field wajib diisi',
        };
      }

      const pelatihan = await pelatihanRepo.create(body);
      return successResponse('Data pelatihan berhasil ditambahkan', pelatihan);
    } catch (error) {
      console.error('Error creating pelatihan:', error);
      throw new Error('Gagal menambahkan data pelatihan');
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

      const existing = await pelatihanRepo.findById(id);
      if (!existing) {
        return {
          message: 'Data pelatihan tidak ditemukan',
        };
      }

      const pelatihan = await pelatihanRepo.update(id, body);
      return successResponse('Data pelatihan berhasil diupdate', pelatihan);
    } catch (error) {
      console.error('Error updating pelatihan:', error);
      throw new Error('Gagal mengupdate data pelatihan');
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

      const existing = await pelatihanRepo.findById(id);
      if (!existing) {
        return {
          message: 'Data pelatihan tidak ditemukan',
        };
      }

      await pelatihanRepo.delete(id);
      return successResponse('Data pelatihan berhasil dihapus');
    } catch (error) {
      console.error('Error deleting pelatihan:', error);
      throw new Error('Gagal menghapus data pelatihan');
    }
  },
};
