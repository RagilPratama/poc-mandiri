import { Context } from 'elysia';
import { JenisBantuanRepository } from '../repositories/jenis-bantuan.repository';
import { successResponse, successResponseWithPagination } from '../utils/response';
import { logActivitySimple } from '../utils/activity-logger';

const jenisBantuanRepo = new JenisBantuanRepository();

export const jenisBantuanHandler = {
  async getAll({ query }: Context<{ query: any }>) {
    try {
      const result = await jenisBantuanRepo.findAll(query);
      return successResponseWithPagination(
        'Data jenis bantuan berhasil diambil',
        result.data,
        result.pagination
      );
    } catch (error) {
      console.error('Error getting jenis bantuan:', error);
      throw new Error('Gagal mengambil data jenis bantuan');
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

      const jenisBantuan = await jenisBantuanRepo.findById(id);
      if (!jenisBantuan) {
        return {
          message: 'Jenis bantuan tidak ditemukan',
        };
      }

      return successResponse('Data jenis bantuan berhasil diambil', jenisBantuan);
    } catch (error) {
      console.error('Error getting jenis bantuan by id:', error);
      throw new Error('Gagal mengambil data jenis bantuan');
    }
  },

  async create({ body, headers, request, path }: Context<{ body: any }>) {
    try {
      // Validate required fields
      if (!body.kode_jenis_bantuan || !body.nama_jenis_bantuan || !body.kategori) {
        return {
          message: 'Kode jenis bantuan, nama jenis bantuan, dan kategori wajib diisi',
        };
      }

      const jenisBantuan = await jenisBantuanRepo.create(body);

      await logActivitySimple({
        context: { headers, request, path },
        aktivitas: 'CREATE',
        modul: 'JENIS_BANTUAN',
        deskripsi: `Membuat jenis bantuan baru: ${body.nama_jenis_bantuan} (${body.kode_jenis_bantuan})`,
        data_baru: jenisBantuan,
      });

      return successResponse('Jenis bantuan berhasil ditambahkan', jenisBantuan);
    } catch (error) {
      console.error('Error creating jenis bantuan:', error);
      
      await logActivitySimple({
        context: { headers, request, path },
        aktivitas: 'CREATE',
        modul: 'JENIS_BANTUAN',
        deskripsi: `Gagal membuat jenis bantuan: ${error instanceof Error ? error.message : 'Unknown error'}`,
        status: 'ERROR',
        error_message: error instanceof Error ? error.message : 'Unknown error',
      });
      
      throw new Error('Gagal menambahkan jenis bantuan');
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

      const existing = await jenisBantuanRepo.findById(id);
      if (!existing) {
        return {
          message: 'Jenis bantuan tidak ditemukan',
        };
      }

      const jenisBantuan = await jenisBantuanRepo.update(id, body);

      await logActivitySimple({
        context: { headers, request, path },
        aktivitas: 'UPDATE',
        modul: 'JENIS_BANTUAN',
        deskripsi: `Mengupdate jenis bantuan: ${existing.nama_jenis_bantuan} (${existing.kode_jenis_bantuan})`,
        data_lama: existing,
        data_baru: jenisBantuan,
      });

      return successResponse('Jenis bantuan berhasil diupdate', jenisBantuan);
    } catch (error) {
      console.error('Error updating jenis bantuan:', error);
      
      await logActivitySimple({
        context: { headers, request, path },
        aktivitas: 'UPDATE',
        modul: 'JENIS_BANTUAN',
        deskripsi: `Gagal mengupdate jenis bantuan: ${error instanceof Error ? error.message : 'Unknown error'}`,
        status: 'ERROR',
        error_message: error instanceof Error ? error.message : 'Unknown error',
      });
      
      throw new Error('Gagal mengupdate jenis bantuan');
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

      const existing = await jenisBantuanRepo.findById(id);
      if (!existing) {
        return {
          message: 'Jenis bantuan tidak ditemukan',
        };
      }

      await jenisBantuanRepo.delete(id);

      await logActivitySimple({
        context: { headers, request, path },
        aktivitas: 'DELETE',
        modul: 'JENIS_BANTUAN',
        deskripsi: `Menghapus jenis bantuan: ${existing.nama_jenis_bantuan} (${existing.kode_jenis_bantuan})`,
        data_lama: existing,
      });

      return successResponse('Jenis bantuan berhasil dihapus');
    } catch (error) {
      console.error('Error deleting jenis bantuan:', error);
      
      await logActivitySimple({
        context: { headers, request, path },
        aktivitas: 'DELETE',
        modul: 'JENIS_BANTUAN',
        deskripsi: `Gagal menghapus jenis bantuan: ${error instanceof Error ? error.message : 'Unknown error'}`,
        status: 'ERROR',
        error_message: error instanceof Error ? error.message : 'Unknown error',
      });
      
      throw new Error('Gagal menghapus jenis bantuan');
    }
  },
};
