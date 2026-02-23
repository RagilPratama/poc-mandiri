import { Context } from 'elysia';
import { KegiatanHarianRepository } from '../repositories/kegiatan-harian.repository';
import { successResponse, successResponseWithPagination } from '../utils/response';
import { logActivitySimple } from '../utils/activity-logger';
import type { CreateKegiatanHarianType, UpdateKegiatanHarianType, KegiatanHarianQueryType } from '../types/kegiatan-harian';

const kegiatanHarianRepo = new KegiatanHarianRepository();

export const kegiatanHarianHandler = {
  async getAll({ query }: Context<{ query: KegiatanHarianQueryType }>) {
    try {
      const result = await kegiatanHarianRepo.findAll(query);
      return successResponseWithPagination(
        'Data kegiatan harian berhasil diambil',
        result.data,
        result.pagination
      );
    } catch (error) {
      console.error('Error getting kegiatan harian:', error);
      throw new Error('Gagal mengambil data kegiatan harian');
    }
  },

  async getById({ params }: Context<{ params: { id: number } }>) {
    try {
      const kegiatan = await kegiatanHarianRepo.findById(params.id);
      if (!kegiatan) {
        return {
          message: 'Data kegiatan harian tidak ditemukan',
        };
      }

      return successResponse('Data kegiatan harian berhasil diambil', kegiatan);
    } catch (error) {
      console.error('Error getting kegiatan harian by id:', error);
      throw new Error('Gagal mengambil data kegiatan harian');
    }
  },

  async getKegiatanByMonth({ query }: Context<{ query: { pegawai_id: number; year: number; month: number } }>) {
    try {
      const result = await kegiatanHarianRepo.getKegiatanByMonth(query.pegawai_id, query.year, query.month);
      return successResponse('Data kegiatan harian per bulan berhasil diambil', result);
    } catch (error) {
      console.error('Error getting kegiatan harian by month:', error);
      throw new Error('Gagal mengambil data kegiatan harian per bulan');
    }
  },

  async create({ body, headers, request, path }: Context<{ body: CreateKegiatanHarianType }>) {
    try {
      if (!body.pegawai_id || !body.tanggal) {
        return {
          message: 'Pegawai dan tanggal wajib diisi',
        };
      }

      // Validate rencana_kerja max 1000 chars
      if (body.rencana_kerja && body.rencana_kerja.length > 1000) {
        return {
          message: 'Rencana kerja maksimal 1000 karakter',
        };
      }

      // Validate max 5 photos
      if (body.foto_kegiatan && body.foto_kegiatan.length > 5) {
        return {
          message: 'Maksimal 5 foto kegiatan',
        };
      }

      const kegiatan = await kegiatanHarianRepo.create(body);

      await logActivitySimple({
        context: { headers, request, path },
        aktivitas: 'CREATE',
        modul: 'KEGIATAN_HARIAN',
        deskripsi: `Membuat kegiatan harian pada ${body.tanggal}`,
        data_baru: kegiatan,
      });

      return successResponse('Kegiatan harian berhasil ditambahkan', kegiatan);
    } catch (error) {
      console.error('Error creating kegiatan harian:', error);

      await logActivitySimple({
        context: { headers, request, path },
        aktivitas: 'CREATE',
        modul: 'KEGIATAN_HARIAN',
        deskripsi: `Gagal membuat kegiatan harian: ${error instanceof Error ? error.message : 'Unknown error'}`,
        status: 'ERROR',
        error_message: error instanceof Error ? error.message : 'Unknown error',
      });

      throw new Error('Gagal menambahkan kegiatan harian');
    }
  },

  async update({ params, body, headers, request, path }: Context<{ params: { id: number }; body: UpdateKegiatanHarianType }>) {
    try {
      const existing = await kegiatanHarianRepo.findById(params.id);
      if (!existing) {
        return {
          message: 'Data kegiatan harian tidak ditemukan',
        };
      }

      // Validate rencana_kerja max 1000 chars
      if (body.rencana_kerja && body.rencana_kerja.length > 1000) {
        return {
          message: 'Rencana kerja maksimal 1000 karakter',
        };
      }

      // Validate max 5 photos
      if (body.foto_kegiatan && body.foto_kegiatan.length > 5) {
        return {
          message: 'Maksimal 5 foto kegiatan',
        };
      }

      const kegiatan = await kegiatanHarianRepo.update(params.id, body);

      await logActivitySimple({
        context: { headers, request, path },
        aktivitas: 'UPDATE',
        modul: 'KEGIATAN_HARIAN',
        deskripsi: `Mengupdate kegiatan harian pada ${existing.tanggal}`,
        data_lama: existing,
        data_baru: kegiatan,
      });

      return successResponse('Kegiatan harian berhasil diupdate', kegiatan);
    } catch (error) {
      console.error('Error updating kegiatan harian:', error);

      await logActivitySimple({
        context: { headers, request, path },
        aktivitas: 'UPDATE',
        modul: 'KEGIATAN_HARIAN',
        deskripsi: `Gagal mengupdate kegiatan harian: ${error instanceof Error ? error.message : 'Unknown error'}`,
        status: 'ERROR',
        error_message: error instanceof Error ? error.message : 'Unknown error',
      });

      throw new Error('Gagal mengupdate kegiatan harian');
    }
  },

  async delete({ params, headers, request, path }: Context<{ params: { id: number } }>) {
    try {
      const existing = await kegiatanHarianRepo.findById(params.id);
      if (!existing) {
        return {
          message: 'Data kegiatan harian tidak ditemukan',
        };
      }

      await kegiatanHarianRepo.delete(params.id);

      await logActivitySimple({
        context: { headers, request, path },
        aktivitas: 'DELETE',
        modul: 'KEGIATAN_HARIAN',
        deskripsi: `Menghapus kegiatan harian pada ${existing.tanggal}`,
        data_lama: existing,
      });

      return successResponse('Kegiatan harian berhasil dihapus');
    } catch (error) {
      console.error('Error deleting kegiatan harian:', error);

      await logActivitySimple({
        context: { headers, request, path },
        aktivitas: 'DELETE',
        modul: 'KEGIATAN_HARIAN',
        deskripsi: `Gagal menghapus kegiatan harian: ${error instanceof Error ? error.message : 'Unknown error'}`,
        status: 'ERROR',
        error_message: error instanceof Error ? error.message : 'Unknown error',
      });

      throw new Error('Gagal menghapus kegiatan harian');
    }
  },
};
