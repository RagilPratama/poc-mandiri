import { Context } from 'elysia';
import { KegiatanPrioritasRepository } from '../repositories/kegiatan-prioritas.repository';
import { successResponse, successResponseWithPagination } from '../utils/response';
import { logActivitySimple } from '../utils/activity-logger';
import type { CreateKegiatanPrioritasType, UpdateKegiatanPrioritasType, KegiatanPrioritasQueryType } from '../types/kegiatan-prioritas';

const kegiatanPrioritasRepo = new KegiatanPrioritasRepository();

export const kegiatanPrioritasHandler = {
  async getAll({ query }: Context<{ query: KegiatanPrioritasQueryType }>) {
    try {
      const result = await kegiatanPrioritasRepo.findAll(query);
      return successResponseWithPagination(
        'Data kegiatan prioritas berhasil diambil',
        result.data,
        result.pagination
      );
    } catch (error) {
      console.error('Error getting kegiatan prioritas:', error);
      throw new Error('Gagal mengambil data kegiatan prioritas');
    }
  },

  async getById({ params }: Context<{ params: { id: number } }>) {
    try {
      const kegiatan = await kegiatanPrioritasRepo.findById(params.id);
      if (!kegiatan) {
        return {
          message: 'Data kegiatan prioritas tidak ditemukan',
        };
      }

      return successResponse('Data kegiatan prioritas berhasil diambil', kegiatan);
    } catch (error) {
      console.error('Error getting kegiatan prioritas by id:', error);
      throw new Error('Gagal mengambil data kegiatan prioritas');
    }
  },

  async getKegiatanByMonth({ query }: Context<{ query: { pegawai_id: number; year: number; month: number } }>) {
    try {
      const result = await kegiatanPrioritasRepo.getKegiatanByMonth(query.pegawai_id, query.year, query.month);
      return successResponse('Data kegiatan prioritas per bulan berhasil diambil', result);
    } catch (error) {
      console.error('Error getting kegiatan prioritas by month:', error);
      throw new Error('Gagal mengambil data kegiatan prioritas per bulan');
    }
  },

  async create({ body, headers, request, path }: Context<{ body: CreateKegiatanPrioritasType }>) {
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

      const kegiatan = await kegiatanPrioritasRepo.create(body);

      await logActivitySimple({
        context: { headers, request, path },
        aktivitas: 'CREATE',
        modul: 'KEGIATAN_PRIORITAS',
        deskripsi: `Membuat kegiatan prioritas pada ${body.tanggal}`,
        data_baru: kegiatan,
      });

      return successResponse('Kegiatan harian berhasil ditambahkan', kegiatan);
    } catch (error) {
      console.error('Error creating kegiatan prioritas:', error);

      await logActivitySimple({
        context: { headers, request, path },
        aktivitas: 'CREATE',
        modul: 'KEGIATAN_PRIORITAS',
        deskripsi: `Gagal membuat kegiatan prioritas: ${error instanceof Error ? error.message : 'Unknown error'}`,
        status: 'ERROR',
        error_message: error instanceof Error ? error.message : 'Unknown error',
      });

      throw new Error('Gagal menambahkan kegiatan prioritas');
    }
  },

  async update({ params, body, headers, request, path }: Context<{ params: { id: number }; body: UpdateKegiatanPrioritasType }>) {
    try {
      const existing = await kegiatanPrioritasRepo.findById(params.id);
      if (!existing) {
        return {
          message: 'Data kegiatan prioritas tidak ditemukan',
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

      const kegiatan = await kegiatanPrioritasRepo.update(params.id, body);

      await logActivitySimple({
        context: { headers, request, path },
        aktivitas: 'UPDATE',
        modul: 'KEGIATAN_PRIORITAS',
        deskripsi: `Mengupdate kegiatan prioritas pada ${existing.tanggal}`,
        data_lama: existing,
        data_baru: kegiatan,
      });

      return successResponse('Kegiatan harian berhasil diupdate', kegiatan);
    } catch (error) {
      console.error('Error updating kegiatan prioritas:', error);

      await logActivitySimple({
        context: { headers, request, path },
        aktivitas: 'UPDATE',
        modul: 'KEGIATAN_PRIORITAS',
        deskripsi: `Gagal mengupdate kegiatan prioritas: ${error instanceof Error ? error.message : 'Unknown error'}`,
        status: 'ERROR',
        error_message: error instanceof Error ? error.message : 'Unknown error',
      });

      throw new Error('Gagal mengupdate kegiatan prioritas');
    }
  },

  async delete({ params, headers, request, path }: Context<{ params: { id: number } }>) {
    try {
      const existing = await kegiatanPrioritasRepo.findById(params.id);
      if (!existing) {
        return {
          message: 'Data kegiatan prioritas tidak ditemukan',
        };
      }

      await kegiatanPrioritasRepo.delete(params.id);

      await logActivitySimple({
        context: { headers, request, path },
        aktivitas: 'DELETE',
        modul: 'KEGIATAN_PRIORITAS',
        deskripsi: `Menghapus kegiatan prioritas pada ${existing.tanggal}`,
        data_lama: existing,
      });

      return successResponse('Kegiatan harian berhasil dihapus');
    } catch (error) {
      console.error('Error deleting kegiatan prioritas:', error);

      await logActivitySimple({
        context: { headers, request, path },
        aktivitas: 'DELETE',
        modul: 'KEGIATAN_PRIORITAS',
        deskripsi: `Gagal menghapus kegiatan prioritas: ${error instanceof Error ? error.message : 'Unknown error'}`,
        status: 'ERROR',
        error_message: error instanceof Error ? error.message : 'Unknown error',
      });

      throw new Error('Gagal menghapus kegiatan prioritas');
    }
  },
};
