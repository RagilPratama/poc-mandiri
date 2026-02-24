import { Context } from 'elysia';
import { IkiRepository } from '../repositories/iki.repository';
import { IkuRepository } from '../repositories/iku.repository';
import { successResponse, successResponseWithPagination } from '../utils/response';
import { logActivitySimple } from '../utils/activity-logger';

const ikiRepo = new IkiRepository();
const ikuRepo = new IkuRepository();

export const ikiHandler = {
  async getAll({ query }: Context<{ query: any }>) {
    try {
      const result = await ikiRepo.findAll(query);
      return successResponseWithPagination(
        'Data IKI berhasil diambil',
        result.data,
        result.pagination
      );
    } catch (error) {
      console.error('Error getting IKI:', error);
      throw new Error('Gagal mengambil data IKI');
    }
  },

  async getById({ params }: Context<{ params: { id: string } }>) {
    try {
      const id = parseInt(params.id);
      if (isNaN(id)) {
        return { message: 'ID tidak valid' };
      }

      const iki = await ikiRepo.findById(id);
      if (!iki) {
        return { message: 'IKI tidak ditemukan' };
      }

      return successResponse('Data IKI berhasil diambil', iki);
    } catch (error) {
      console.error('Error getting IKI by id:', error);
      throw new Error('Gagal mengambil data IKI');
    }
  },

  async create({ body, headers, request, path }: Context<{ body: any }>) {
    try {
      if (!body.iku_id || !body.kode_iki || !body.nama_iki) {
        return { message: 'IKU, kode IKI, dan nama IKI wajib diisi' };
      }

      const iku = await ikuRepo.findById(body.iku_id);
      if (!iku) {
        return { message: 'IKU tidak ditemukan' };
      }

      const existing = await ikiRepo.findByKode(body.kode_iki);
      if (existing) {
        return { message: `Kode IKI ${body.kode_iki} sudah digunakan` };
      }

      const iki = await ikiRepo.create(body);

      await logActivitySimple({
        context: { headers, request, path },
        aktivitas: 'CREATE',
        modul: 'IKI',
        deskripsi: `Membuat IKI baru: ${body.nama_iki} (${body.kode_iki})`,
        data_baru: iki,
      });

      return successResponse('IKI berhasil ditambahkan', iki);
    } catch (error) {
      console.error('Error creating IKI:', error);

      await logActivitySimple({
        context: { headers, request, path },
        aktivitas: 'CREATE',
        modul: 'IKI',
        deskripsi: `Gagal membuat IKI: ${error instanceof Error ? error.message : 'Unknown error'}`,
        status: 'ERROR',
        error_message: error instanceof Error ? error.message : 'Unknown error',
      });

      throw new Error('Gagal menambahkan IKI');
    }
  },

  async update({ params, body, headers, request, path }: Context<{ params: { id: string }; body: any }>) {
    try {
      const id = parseInt(params.id);
      if (isNaN(id)) {
        return { message: 'ID tidak valid' };
      }

      const existing = await ikiRepo.findById(id);
      if (!existing) {
        return { message: 'IKI tidak ditemukan' };
      }

      if (body.iku_id) {
        const iku = await ikuRepo.findById(body.iku_id);
        if (!iku) {
          return { message: 'IKU tidak ditemukan' };
        }
      }

      if (body.kode_iki && body.kode_iki !== existing.kode_iki) {
        const duplicate = await ikiRepo.findByKode(body.kode_iki);
        if (duplicate) {
          return { message: `Kode IKI ${body.kode_iki} sudah digunakan` };
        }
      }

      const iki = await ikiRepo.update(id, body);

      await logActivitySimple({
        context: { headers, request, path },
        aktivitas: 'UPDATE',
        modul: 'IKI',
        deskripsi: `Mengupdate IKI: ${existing.nama_iki} (${existing.kode_iki})`,
        data_lama: existing,
        data_baru: iki,
      });

      return successResponse('IKI berhasil diupdate', iki);
    } catch (error) {
      console.error('Error updating IKI:', error);

      await logActivitySimple({
        context: { headers, request, path },
        aktivitas: 'UPDATE',
        modul: 'IKI',
        deskripsi: `Gagal mengupdate IKI: ${error instanceof Error ? error.message : 'Unknown error'}`,
        status: 'ERROR',
        error_message: error instanceof Error ? error.message : 'Unknown error',
      });

      throw new Error('Gagal mengupdate IKI');
    }
  },

  async delete({ params, headers, request, path }: Context<{ params: { id: string } }>) {
    try {
      const id = parseInt(params.id);
      if (isNaN(id)) {
        return { message: 'ID tidak valid' };
      }

      const existing = await ikiRepo.findById(id);
      if (!existing) {
        return { message: 'IKI tidak ditemukan' };
      }

      await ikiRepo.delete(id);

      await logActivitySimple({
        context: { headers, request, path },
        aktivitas: 'DELETE',
        modul: 'IKI',
        deskripsi: `Menghapus IKI: ${existing.nama_iki} (${existing.kode_iki})`,
        data_lama: existing,
      });

      return successResponse('IKI berhasil dihapus');
    } catch (error) {
      console.error('Error deleting IKI:', error);

      await logActivitySimple({
        context: { headers, request, path },
        aktivitas: 'DELETE',
        modul: 'IKI',
        deskripsi: `Gagal menghapus IKI: ${error instanceof Error ? error.message : 'Unknown error'}`,
        status: 'ERROR',
        error_message: error instanceof Error ? error.message : 'Unknown error',
      });

      throw new Error('Gagal menghapus IKI');
    }
  },
};
