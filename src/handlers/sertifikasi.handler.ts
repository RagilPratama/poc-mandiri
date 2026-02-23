import { Context } from 'elysia';
import { SertifikasiRepository } from '../repositories/sertifikasi.repository';
import { successResponse, successResponseWithPagination } from '../utils/response';
import { logActivitySimple } from '../utils/activity-logger';

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

  async create({ body, headers, request, path }: Context<{ body: any }>) {
    try {
      // Validate required fields
      if (!body.no_sertifikat || !body.jenis_sertifikasi_id || !body.kelompok_nelayan_id || 
          !body.tanggal_terbit || !body.tanggal_berlaku || !body.tanggal_kadaluarsa || !body.lembaga_penerbit) {
        return {
          message: 'Semua field wajib diisi',
        };
      }

      const sertifikasi = await sertifikasiRepo.create(body);

      await logActivitySimple({
        context: { headers, request, path },
        aktivitas: 'CREATE',
        modul: 'SERTIFIKASI',
        deskripsi: `Membuat sertifikasi baru: ${body.no_sertifikat}`,
        data_baru: sertifikasi,
      });

      return successResponse('Data sertifikasi berhasil ditambahkan', sertifikasi);
    } catch (error) {
      console.error('Error creating sertifikasi:', error);
      
      await logActivitySimple({
        context: { headers, request, path },
        aktivitas: 'CREATE',
        modul: 'SERTIFIKASI',
        deskripsi: `Gagal membuat sertifikasi: ${error instanceof Error ? error.message : 'Unknown error'}`,
        status: 'ERROR',
        error_message: error instanceof Error ? error.message : 'Unknown error',
      });
      
      throw new Error('Gagal menambahkan data sertifikasi');
    }
  },

  async update({ params, body, headers, request, path }: Context<{ params: { id: string }; body: any }>) {
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

      await logActivitySimple({
        context: { headers, request, path },
        aktivitas: 'UPDATE',
        modul: 'SERTIFIKASI',
        deskripsi: `Mengupdate sertifikasi: ${existing.no_sertifikat}`,
        data_lama: existing,
        data_baru: sertifikasi,
      });

      return successResponse('Data sertifikasi berhasil diupdate', sertifikasi);
    } catch (error) {
      console.error('Error updating sertifikasi:', error);
      
      await logActivitySimple({
        context: { headers, request, path },
        aktivitas: 'UPDATE',
        modul: 'SERTIFIKASI',
        deskripsi: `Gagal mengupdate sertifikasi: ${error instanceof Error ? error.message : 'Unknown error'}`,
        status: 'ERROR',
        error_message: error instanceof Error ? error.message : 'Unknown error',
      });
      
      throw new Error('Gagal mengupdate data sertifikasi');
    }
  },

  async delete({ params, headers, request, path }: Context<{ params: { id: string } }>) {
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

      await logActivitySimple({
        context: { headers, request, path },
        aktivitas: 'DELETE',
        modul: 'SERTIFIKASI',
        deskripsi: `Menghapus sertifikasi: ${existing.no_sertifikat}`,
        data_lama: existing,
      });

      return successResponse('Data sertifikasi berhasil dihapus');
    } catch (error) {
      console.error('Error deleting sertifikasi:', error);
      
      await logActivitySimple({
        context: { headers, request, path },
        aktivitas: 'DELETE',
        modul: 'SERTIFIKASI',
        deskripsi: `Gagal menghapus sertifikasi: ${error instanceof Error ? error.message : 'Unknown error'}`,
        status: 'ERROR',
        error_message: error instanceof Error ? error.message : 'Unknown error',
      });
      
      throw new Error('Gagal menghapus data sertifikasi');
    }
  },
};
