import { BantuanRepository } from '../repositories/bantuan.repository';
import { successResponse, successResponseWithPagination } from '../utils/response';

const bantuanRepo = new BantuanRepository();

export const bantuanHandler = {
  async getAll({ query }: any) {
    try {
      const result = await bantuanRepo.findAll(query);
      return successResponseWithPagination(
        'Data bantuan berhasil diambil',
        result.data,
        result.pagination
      );
    } catch (error) {
      console.error('Error getting bantuan:', error);
      throw new Error('Gagal mengambil data bantuan');
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

      const bantuan = await bantuanRepo.findById(id);
      if (!bantuan) {
        return {
          message: 'Data bantuan tidak ditemukan',
        };
      }

      return successResponse('Data bantuan berhasil diambil', bantuan);
    } catch (error) {
      console.error('Error getting bantuan by id:', error);
      throw new Error('Gagal mengambil data bantuan');
    }
  },

  async create({ body }: any) {
    try {
      // Validate required fields
      if (!body.no_bantuan || !body.jenis_bantuan_id || !body.kelompok_nelayan_id || !body.penyuluh_id || 
          !body.tanggal_penyaluran || !body.jumlah || !body.satuan || !body.nilai_bantuan || !body.tahun_anggaran) {
        return {
          message: 'Semua field wajib diisi',
        };
      }

      const bantuan = await bantuanRepo.create(body);
      return successResponse('Data bantuan berhasil ditambahkan', bantuan);
    } catch (error) {
      console.error('Error creating bantuan:', error);
      throw new Error('Gagal menambahkan data bantuan');
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

      const existing = await bantuanRepo.findById(id);
      if (!existing) {
        return {
          message: 'Data bantuan tidak ditemukan',
        };
      }

      const bantuan = await bantuanRepo.update(id, body);
      return successResponse('Data bantuan berhasil diupdate', bantuan);
    } catch (error) {
      console.error('Error updating bantuan:', error);
      throw new Error('Gagal mengupdate data bantuan');
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

      const existing = await bantuanRepo.findById(id);
      if (!existing) {
        return {
          message: 'Data bantuan tidak ditemukan',
        };
      }

      await bantuanRepo.delete(id);
      return successResponse('Data bantuan berhasil dihapus');
    } catch (error) {
      console.error('Error deleting bantuan:', error);
      throw new Error('Gagal menghapus data bantuan');
    }
  },
};
