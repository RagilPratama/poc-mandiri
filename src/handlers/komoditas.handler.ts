import { Context } from 'elysia';
import { KomoditasRepository } from '../repositories/komoditas.repository';
import { successResponse, successResponseWithPagination } from '../utils/response';
import { logActivitySimple } from '../utils/activity-logger';

const komoditasRepo = new KomoditasRepository();

export const komoditasHandler = {
  async getAll({ query }: Context<{ query: { page?: number; limit?: number; search?: string; kategori?: string } }>) {
    try {
      const result = await komoditasRepo.findAll(query);
      return successResponseWithPagination(
        'Data komoditas berhasil diambil',
        result.data,
        result.pagination
      );
    } catch (error) {
      console.error('Error getting komoditas:', error);
      throw new Error('Gagal mengambil data komoditas');
    }
  },

  async getById({ params }: Context<{ params: { id: number } }>) {
    try {
      const id = params.id;

      const komoditas = await komoditasRepo.findById(id);
      if (!komoditas) {
        return {
          message: 'Komoditas tidak ditemukan',
        };
      }

      return successResponse('Data komoditas berhasil diambil', komoditas);
    } catch (error) {
      console.error('Error getting komoditas by id:', error);
      throw new Error('Gagal mengambil data komoditas');
    }
  },

  async create({ body, headers, request, path }: Context<{ body: any }>) {
    try {
      if (!body.kode_komoditas || !body.nama_komoditas || !body.kategori || !body.satuan) {
        return {
          message: 'Kode komoditas, nama komoditas, kategori, dan satuan wajib diisi',
        };
      }

      const komoditas = await komoditasRepo.create(body);

      await logActivitySimple({
        context: { headers, request, path },
        aktivitas: 'CREATE',
        modul: 'KOMODITAS',
        deskripsi: `Membuat komoditas baru: ${body.nama_komoditas} (${body.kode_komoditas})`,
        data_baru: komoditas,
      });

      return successResponse('Komoditas berhasil ditambahkan', komoditas);
    } catch (error) {
      console.error('Error creating komoditas:', error);
      await logActivitySimple({
        context: { headers, request, path },
        aktivitas: 'CREATE',
        modul: 'KOMODITAS',
        deskripsi: `Gagal membuat komoditas: ${error instanceof Error ? error.message : 'Unknown error'}`,
        status: 'ERROR',
        error_message: error instanceof Error ? error.message : 'Unknown error',
      });
      
      throw new Error('Gagal menambahkan komoditas');
    }
  },

  async update({ params, body, headers, request, path }: Context<{ params: { id: number }; body: any }>) {
    try {
      const id = params.id;

      const oldData = await komoditasRepo.findById(id);
      if (!oldData) {
        return {
          message: 'Komoditas tidak ditemukan',
        };
      }

      const newData = await komoditasRepo.update(id, body);

      await logActivitySimple({
        context: { headers, request, path },
        aktivitas: 'UPDATE',
        modul: 'KOMODITAS',
        deskripsi: `Mengupdate komoditas: ${oldData.nama_komoditas} (${oldData.kode_komoditas})`,
        data_lama: oldData,
        data_baru: newData,
      });

      return successResponse('Komoditas berhasil diupdate', newData);
    } catch (error) {
      console.error('Error updating komoditas:', error);
      
      await logActivitySimple({
        context: { headers, request, path },
        aktivitas: 'UPDATE',
        modul: 'KOMODITAS',
        deskripsi: `Gagal mengupdate komoditas: ${error instanceof Error ? error.message : 'Unknown error'}`,
        status: 'ERROR',
        error_message: error instanceof Error ? error.message : 'Unknown error',
      });
      
      throw new Error('Gagal mengupdate komoditas');
    }
  },

  async delete({ params, headers, request, path }: Context<{ params: { id: number } }>) {
    try {
      const id = params.id;

      const dataToDelete = await komoditasRepo.findById(id);
      if (!dataToDelete) {
        return {
          message: 'Komoditas tidak ditemukan',
        };
      }

      await komoditasRepo.delete(id);

      await logActivitySimple({
        context: { headers, request, path },
        aktivitas: 'DELETE',
        modul: 'KOMODITAS',
        deskripsi: `Menghapus komoditas: ${dataToDelete.nama_komoditas} (${dataToDelete.kode_komoditas})`,
        data_lama: dataToDelete,
      });

      return successResponse('Komoditas berhasil dihapus');
    } catch (error) {
      console.error('Error deleting komoditas:', error);
      
      await logActivitySimple({
        context: { headers, request, path },
        aktivitas: 'DELETE',
        modul: 'KOMODITAS',
        deskripsi: `Gagal menghapus komoditas: ${error instanceof Error ? error.message : 'Unknown error'}`,
        status: 'ERROR',
        error_message: error instanceof Error ? error.message : 'Unknown error',
      });
      
      throw new Error('Gagal menghapus komoditas');
    }
  },
};
