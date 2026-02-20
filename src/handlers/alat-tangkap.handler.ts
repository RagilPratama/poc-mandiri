import { AlatTangkapRepository } from '../repositories/alat-tangkap.repository';
import { successResponse, successResponseWithPagination } from '../utils/response';
import { logActivitySimple } from '../utils/activity-logger';

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

  async create({ body, headers, request, path }: any) {
    try {
      // Validate required fields
      if (!body.kode_alat_tangkap || !body.nama_alat_tangkap || !body.jenis) {
        return {
          message: 'Kode alat tangkap, nama alat tangkap, dan jenis wajib diisi',
        };
      }

      const alatTangkap = await alatTangkapRepo.create(body);

      await logActivitySimple({
        context: { headers, request, path },
        aktivitas: 'CREATE',
        modul: 'ALAT_TANGKAP',
        deskripsi: `Membuat alat tangkap baru: ${body.nama_alat_tangkap} (${body.kode_alat_tangkap})`,
        data_baru: alatTangkap,
      });

      return successResponse('Alat tangkap berhasil ditambahkan', alatTangkap);
    } catch (error) {
      console.error('Error creating alat tangkap:', error);
      
      await logActivitySimple({
        context: { headers, request, path },
        aktivitas: 'CREATE',
        modul: 'ALAT_TANGKAP',
        deskripsi: `Gagal membuat alat tangkap: ${error instanceof Error ? error.message : 'Unknown error'}`,
        status: 'ERROR',
        error_message: error instanceof Error ? error.message : 'Unknown error',
      });
      
      throw new Error('Gagal menambahkan alat tangkap');
    }
  },

  async update({ params, body, headers, request, path }: any) {
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

      await logActivitySimple({
        context: { headers, request, path },
        aktivitas: 'UPDATE',
        modul: 'ALAT_TANGKAP',
        deskripsi: `Mengupdate alat tangkap: ${existing.nama_alat_tangkap} (${existing.kode_alat_tangkap})`,
        data_lama: existing,
        data_baru: alatTangkap,
      });

      return successResponse('Alat tangkap berhasil diupdate', alatTangkap);
    } catch (error) {
      console.error('Error updating alat tangkap:', error);
      
      await logActivitySimple({
        context: { headers, request, path },
        aktivitas: 'UPDATE',
        modul: 'ALAT_TANGKAP',
        deskripsi: `Gagal mengupdate alat tangkap: ${error instanceof Error ? error.message : 'Unknown error'}`,
        status: 'ERROR',
        error_message: error instanceof Error ? error.message : 'Unknown error',
      });
      
      throw new Error('Gagal mengupdate alat tangkap');
    }
  },

  async delete({ params, headers, request, path }: any) {
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

      await logActivitySimple({
        context: { headers, request, path },
        aktivitas: 'DELETE',
        modul: 'ALAT_TANGKAP',
        deskripsi: `Menghapus alat tangkap: ${existing.nama_alat_tangkap} (${existing.kode_alat_tangkap})`,
        data_lama: existing,
      });

      return successResponse('Alat tangkap berhasil dihapus');
    } catch (error) {
      console.error('Error deleting alat tangkap:', error);
      
      await logActivitySimple({
        context: { headers, request, path },
        aktivitas: 'DELETE',
        modul: 'ALAT_TANGKAP',
        deskripsi: `Gagal menghapus alat tangkap: ${error instanceof Error ? error.message : 'Unknown error'}`,
        status: 'ERROR',
        error_message: error instanceof Error ? error.message : 'Unknown error',
      });
      
      throw new Error('Gagal menghapus alat tangkap');
    }
  },
};
