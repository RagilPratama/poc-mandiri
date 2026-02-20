import { Context } from 'elysia';
import { JenisSertifikasiRepository } from '../repositories/jenis-sertifikasi.repository';
import { successResponse, successResponseWithPagination } from '../utils/response';
import { logActivitySimple } from '../utils/activity-logger';

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

  async create({ body, headers, request, path }: Context<{ body: any }>) {
    try {
      // Validate required fields
      if (!body.kode_jenis_sertifikasi || !body.nama_jenis_sertifikasi || !body.kategori || !body.lembaga_penerbit) {
        return {
          message: 'Kode jenis sertifikasi, nama jenis sertifikasi, kategori, dan lembaga penerbit wajib diisi',
        };
      }

      const jenisSertifikasi = await jenisSertifikasiRepo.create(body);

      await logActivitySimple({
        context: { headers, request, path },
        aktivitas: 'CREATE',
        modul: 'JENIS_SERTIFIKASI',
        deskripsi: `Membuat jenis sertifikasi baru: ${body.nama_jenis_sertifikasi} (${body.kode_jenis_sertifikasi})`,
        data_baru: jenisSertifikasi,
      });

      return successResponse('Jenis sertifikasi berhasil ditambahkan', jenisSertifikasi);
    } catch (error) {
      console.error('Error creating jenis sertifikasi:', error);
      
      await logActivitySimple({
        context: { headers, request, path },
        aktivitas: 'CREATE',
        modul: 'JENIS_SERTIFIKASI',
        deskripsi: `Gagal membuat jenis sertifikasi: ${error instanceof Error ? error.message : 'Unknown error'}`,
        status: 'ERROR',
        error_message: error instanceof Error ? error.message : 'Unknown error',
      });
      
      throw new Error('Gagal menambahkan jenis sertifikasi');
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

      const existing = await jenisSertifikasiRepo.findById(id);
      if (!existing) {
        return {
          message: 'Jenis sertifikasi tidak ditemukan',
        };
      }

      const jenisSertifikasi = await jenisSertifikasiRepo.update(id, body);

      await logActivitySimple({
        context: { headers, request, path },
        aktivitas: 'UPDATE',
        modul: 'JENIS_SERTIFIKASI',
        deskripsi: `Mengupdate jenis sertifikasi: ${existing.nama_jenis_sertifikasi} (${existing.kode_jenis_sertifikasi})`,
        data_lama: existing,
        data_baru: jenisSertifikasi,
      });

      return successResponse('Jenis sertifikasi berhasil diupdate', jenisSertifikasi);
    } catch (error) {
      console.error('Error updating jenis sertifikasi:', error);
      
      await logActivitySimple({
        context: { headers, request, path },
        aktivitas: 'UPDATE',
        modul: 'JENIS_SERTIFIKASI',
        deskripsi: `Gagal mengupdate jenis sertifikasi: ${error instanceof Error ? error.message : 'Unknown error'}`,
        status: 'ERROR',
        error_message: error instanceof Error ? error.message : 'Unknown error',
      });
      
      throw new Error('Gagal mengupdate jenis sertifikasi');
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

      const existing = await jenisSertifikasiRepo.findById(id);
      if (!existing) {
        return {
          message: 'Jenis sertifikasi tidak ditemukan',
        };
      }

      await jenisSertifikasiRepo.delete(id);

      await logActivitySimple({
        context: { headers, request, path },
        aktivitas: 'DELETE',
        modul: 'JENIS_SERTIFIKASI',
        deskripsi: `Menghapus jenis sertifikasi: ${existing.nama_jenis_sertifikasi} (${existing.kode_jenis_sertifikasi})`,
        data_lama: existing,
      });

      return successResponse('Jenis sertifikasi berhasil dihapus');
    } catch (error) {
      console.error('Error deleting jenis sertifikasi:', error);
      
      await logActivitySimple({
        context: { headers, request, path },
        aktivitas: 'DELETE',
        modul: 'JENIS_SERTIFIKASI',
        deskripsi: `Gagal menghapus jenis sertifikasi: ${error instanceof Error ? error.message : 'Unknown error'}`,
        status: 'ERROR',
        error_message: error instanceof Error ? error.message : 'Unknown error',
      });
      
      throw new Error('Gagal menghapus jenis sertifikasi');
    }
  },
};
