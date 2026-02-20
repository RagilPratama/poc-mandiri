import { Context } from 'elysia';
import { JenisPelatihanRepository } from '../repositories/jenis-pelatihan.repository';
import { successResponse, successResponseWithPagination } from '../utils/response';
import { logActivitySimple } from '../utils/activity-logger';

const jenisPelatihanRepo = new JenisPelatihanRepository();

export const jenisPelatihanHandler = {
  async getAll({ query }: Context<{ query: any }>) {
    try {
      const result = await jenisPelatihanRepo.findAll(query);
      return successResponseWithPagination(
        'Data jenis pelatihan berhasil diambil',
        result.data,
        result.pagination
      );
    } catch (error) {
      console.error('Error getting jenis pelatihan:', error);
      throw new Error('Gagal mengambil data jenis pelatihan');
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

      const jenisPelatihan = await jenisPelatihanRepo.findById(id);
      if (!jenisPelatihan) {
        return {
          message: 'Jenis pelatihan tidak ditemukan',
        };
      }

      return successResponse('Data jenis pelatihan berhasil diambil', jenisPelatihan);
    } catch (error) {
      console.error('Error getting jenis pelatihan by id:', error);
      throw new Error('Gagal mengambil data jenis pelatihan');
    }
  },

  async create({ body, headers, request, path }: Context<{ body: any }>) {
    try {
      // Validate required fields
      if (!body.kode_jenis_pelatihan || !body.nama_jenis_pelatihan || !body.kategori) {
        return {
          message: 'Kode jenis pelatihan, nama jenis pelatihan, dan kategori wajib diisi',
        };
      }

      const jenisPelatihan = await jenisPelatihanRepo.create(body);

      await logActivitySimple({
        context: { headers, request, path },
        aktivitas: 'CREATE',
        modul: 'JENIS_PELATIHAN',
        deskripsi: `Membuat jenis pelatihan baru: ${body.nama_jenis_pelatihan} (${body.kode_jenis_pelatihan})`,
        data_baru: jenisPelatihan,
      });

      return successResponse('Jenis pelatihan berhasil ditambahkan', jenisPelatihan);
    } catch (error) {
      console.error('Error creating jenis pelatihan:', error);
      
      await logActivitySimple({
        context: { headers, request, path },
        aktivitas: 'CREATE',
        modul: 'JENIS_PELATIHAN',
        deskripsi: `Gagal membuat jenis pelatihan: ${error instanceof Error ? error.message : 'Unknown error'}`,
        status: 'ERROR',
        error_message: error instanceof Error ? error.message : 'Unknown error',
      });
      
      throw new Error('Gagal menambahkan jenis pelatihan');
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

      const existing = await jenisPelatihanRepo.findById(id);
      if (!existing) {
        return {
          message: 'Jenis pelatihan tidak ditemukan',
        };
      }

      const jenisPelatihan = await jenisPelatihanRepo.update(id, body);

      await logActivitySimple({
        context: { headers, request, path },
        aktivitas: 'UPDATE',
        modul: 'JENIS_PELATIHAN',
        deskripsi: `Mengupdate jenis pelatihan: ${existing.nama_jenis_pelatihan} (${existing.kode_jenis_pelatihan})`,
        data_lama: existing,
        data_baru: jenisPelatihan,
      });

      return successResponse('Jenis pelatihan berhasil diupdate', jenisPelatihan);
    } catch (error) {
      console.error('Error updating jenis pelatihan:', error);
      
      await logActivitySimple({
        context: { headers, request, path },
        aktivitas: 'UPDATE',
        modul: 'JENIS_PELATIHAN',
        deskripsi: `Gagal mengupdate jenis pelatihan: ${error instanceof Error ? error.message : 'Unknown error'}`,
        status: 'ERROR',
        error_message: error instanceof Error ? error.message : 'Unknown error',
      });
      
      throw new Error('Gagal mengupdate jenis pelatihan');
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

      const existing = await jenisPelatihanRepo.findById(id);
      if (!existing) {
        return {
          message: 'Jenis pelatihan tidak ditemukan',
        };
      }

      await jenisPelatihanRepo.delete(id);

      await logActivitySimple({
        context: { headers, request, path },
        aktivitas: 'DELETE',
        modul: 'JENIS_PELATIHAN',
        deskripsi: `Menghapus jenis pelatihan: ${existing.nama_jenis_pelatihan} (${existing.kode_jenis_pelatihan})`,
        data_lama: existing,
      });

      return successResponse('Jenis pelatihan berhasil dihapus');
    } catch (error) {
      console.error('Error deleting jenis pelatihan:', error);
      
      await logActivitySimple({
        context: { headers, request, path },
        aktivitas: 'DELETE',
        modul: 'JENIS_PELATIHAN',
        deskripsi: `Gagal menghapus jenis pelatihan: ${error instanceof Error ? error.message : 'Unknown error'}`,
        status: 'ERROR',
        error_message: error instanceof Error ? error.message : 'Unknown error',
      });
      
      throw new Error('Gagal menghapus jenis pelatihan');
    }
  },
};
