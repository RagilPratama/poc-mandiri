import { ProduksiHasilTangkapanRepository } from '../repositories/produksi-hasil-tangkapan.repository';
import { successResponse, successResponseWithPagination } from '../utils/response';

const produksiRepo = new ProduksiHasilTangkapanRepository();

export const produksiHasilTangkapanHandler = {
  async getAll({ query }: any) {
    try {
      const result = await produksiRepo.findAll(query);
      return successResponseWithPagination(
        'Data produksi hasil tangkapan berhasil diambil',
        result.data,
        result.pagination
      );
    } catch (error) {
      console.error('Error getting produksi hasil tangkapan:', error);
      throw new Error('Gagal mengambil data produksi hasil tangkapan');
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

      const produksi = await produksiRepo.findById(id);
      if (!produksi) {
        return {
          message: 'Data produksi hasil tangkapan tidak ditemukan',
        };
      }

      return successResponse('Data produksi hasil tangkapan berhasil diambil', produksi);
    } catch (error) {
      console.error('Error getting produksi hasil tangkapan by id:', error);
      throw new Error('Gagal mengambil data produksi hasil tangkapan');
    }
  },

  async create({ body }: any) {
    try {
      // Validate required fields
      if (!body.kelompok_nelayan_id || !body.tanggal_produksi || !body.komoditas_id || !body.jumlah_produksi || !body.satuan) {
        return {
          message: 'Kelompok nelayan, tanggal produksi, komoditas, jumlah produksi, dan satuan wajib diisi',
        };
      }

      const produksi = await produksiRepo.create(body);
      return successResponse('Data produksi hasil tangkapan berhasil ditambahkan', produksi);
    } catch (error) {
      console.error('Error creating produksi hasil tangkapan:', error);
      throw new Error('Gagal menambahkan data produksi hasil tangkapan');
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

      const existing = await produksiRepo.findById(id);
      if (!existing) {
        return {
          message: 'Data produksi hasil tangkapan tidak ditemukan',
        };
      }

      const produksi = await produksiRepo.update(id, body);
      return successResponse('Data produksi hasil tangkapan berhasil diupdate', produksi);
    } catch (error) {
      console.error('Error updating produksi hasil tangkapan:', error);
      throw new Error('Gagal mengupdate data produksi hasil tangkapan');
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

      const existing = await produksiRepo.findById(id);
      if (!existing) {
        return {
          message: 'Data produksi hasil tangkapan tidak ditemukan',
        };
      }

      await produksiRepo.delete(id);
      return successResponse('Data produksi hasil tangkapan berhasil dihapus');
    } catch (error) {
      console.error('Error deleting produksi hasil tangkapan:', error);
      throw new Error('Gagal menghapus data produksi hasil tangkapan');
    }
  },
};
