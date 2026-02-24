import { Context } from 'elysia';
import { IkuRepository } from '../repositories/iku.repository';
import { successResponse, successResponseWithPagination } from '../utils/response';
import { logActivitySimple } from '../utils/activity-logger';

const ikuRepo = new IkuRepository();

export const ikuHandler = {
  async getAll({ query }: Context<{ query: any }>) {
    try {
      const result = await ikuRepo.findAll(query);
      return successResponseWithPagination(
        'Data IKU berhasil diambil',
        result.data,
        result.pagination
      );
    } catch (error) {
      console.error('Error getting IKU:', error);
      throw new Error('Gagal mengambil data IKU');
    }
  },

  async getById({ params }: Context<{ params: { id: string } }>) {
    try {
      const id = parseInt(params.id);
      if (isNaN(id)) {
        return { message: 'ID tidak valid' };
      }

      const iku = await ikuRepo.findById(id);
      if (!iku) {
        return { message: 'IKU tidak ditemukan' };
      }

      return successResponse('Data IKU berhasil diambil', iku);
    } catch (error) {
      console.error('Error getting IKU by id:', error);
      throw new Error('Gagal mengambil data IKU');
    }
  },

  async create({ body, headers, request, path }: Context<{ body: any }>) {
    try {
      if (!body.kode_iku || !body.nama_iku || !body.tahun) {
        return { message: 'Kode IKU, nama IKU, dan tahun wajib diisi' };
      }

      const existing = await ikuRepo.findByKode(body.kode_iku);
      if (existing) {
        return { message: `Kode IKU ${body.kode_iku} sudah digunakan` };
      }

      const iku = await ikuRepo.create(body);

      await logActivitySimple({
        context: { headers, request, path },
        aktivitas: 'CREATE',
        modul: 'IKU',
        deskripsi: `Membuat IKU baru: ${body.nama_iku} (${body.kode_iku})`,
        data_baru: iku,
      });

      return successResponse('IKU berhasil ditambahkan', iku);
    } catch (error) {
      console.error('Error creating IKU:', error);

      await logActivitySimple({
        context: { headers, request, path },
        aktivitas: 'CREATE',
        modul: 'IKU',
        deskripsi: `Gagal membuat IKU: ${error instanceof Error ? error.message : 'Unknown error'}`,
        status: 'ERROR',
        error_message: error instanceof Error ? error.message : 'Unknown error',
      });

      throw new Error('Gagal menambahkan IKU');
    }
  },

  async update({ params, body, headers, request, path }: Context<{ params: { id: string }; body: any }>) {
    try {
      const id = parseInt(params.id);
      if (isNaN(id)) {
        return { message: 'ID tidak valid' };
      }

      const existing = await ikuRepo.findById(id);
      if (!existing) {
        return { message: 'IKU tidak ditemukan' };
      }

      if (body.kode_iku && body.kode_iku !== existing.kode_iku) {
        const duplicate = await ikuRepo.findByKode(body.kode_iku);
        if (duplicate) {
          return { message: `Kode IKU ${body.kode_iku} sudah digunakan` };
        }
      }

      const iku = await ikuRepo.update(id, body);

      await logActivitySimple({
        context: { headers, request, path },
        aktivitas: 'UPDATE',
        modul: 'IKU',
        deskripsi: `Mengupdate IKU: ${existing.nama_iku} (${existing.kode_iku})`,
        data_lama: existing,
        data_baru: iku,
      });

      return successResponse('IKU berhasil diupdate', iku);
    } catch (error) {
      console.error('Error updating IKU:', error);

      await logActivitySimple({
        context: { headers, request, path },
        aktivitas: 'UPDATE',
        modul: 'IKU',
        deskripsi: `Gagal mengupdate IKU: ${error instanceof Error ? error.message : 'Unknown error'}`,
        status: 'ERROR',
        error_message: error instanceof Error ? error.message : 'Unknown error',
      });

      throw new Error('Gagal mengupdate IKU');
    }
  },

  async delete({ params, headers, request, path }: Context<{ params: { id: string } }>) {
    try {
      const id = parseInt(params.id);
      if (isNaN(id)) {
        return { message: 'ID tidak valid' };
      }

      const existing = await ikuRepo.findById(id);
      if (!existing) {
        return { message: 'IKU tidak ditemukan' };
      }

      await ikuRepo.delete(id);

      await logActivitySimple({
        context: { headers, request, path },
        aktivitas: 'DELETE',
        modul: 'IKU',
        deskripsi: `Menghapus IKU: ${existing.nama_iku} (${existing.kode_iku})`,
        data_lama: existing,
      });

      return successResponse('IKU berhasil dihapus');
    } catch (error) {
      console.error('Error deleting IKU:', error);

      await logActivitySimple({
        context: { headers, request, path },
        aktivitas: 'DELETE',
        modul: 'IKU',
        deskripsi: `Gagal menghapus IKU: ${error instanceof Error ? error.message : 'Unknown error'}`,
        status: 'ERROR',
        error_message: error instanceof Error ? error.message : 'Unknown error',
      });

      throw new Error('Gagal menghapus IKU');
    }
  },
};
