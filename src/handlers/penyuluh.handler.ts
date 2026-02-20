import { Context } from 'elysia';
import { PenyuluhRepository } from '../repositories/penyuluh.repository';
import { successResponse, successResponseWithPagination } from '../utils/response';
import { logActivitySimple } from '../utils/activity-logger';
import type { CreatePenyuluhType, UpdatePenyuluhType, PenyuluhQueryType } from '../types/penyuluh';

const penyuluhRepo = new PenyuluhRepository();

export const penyuluhHandler = {
  async getAll({ query }: Context<{ query: PenyuluhQueryType }>) {
    try {
      const result = await penyuluhRepo.findAll(query);
      return successResponseWithPagination(
        "Data penyuluh berhasil diambil",
        result.data,
        result.pagination
      );
    } catch (error) {
      console.error('Error getting penyuluh:', error);
      throw new Error('Gagal mengambil data penyuluh');
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

      const penyuluh = await penyuluhRepo.findById(id);
      if (!penyuluh) {
        return {
          message: 'Penyuluh tidak ditemukan',
        };
      }

      return successResponse("Data penyuluh berhasil diambil", penyuluh);
    } catch (error) {
      console.error('Error getting penyuluh by id:', error);
      throw new Error('Gagal mengambil data penyuluh');
    }
  },

  async create({ body, headers, request, path }: Context<{ body: CreatePenyuluhType }>) {
    try {
      // Check if pegawai already registered as penyuluh
      const existingPenyuluh = await penyuluhRepo.findByPegawaiId(body.pegawai_id);
      if (existingPenyuluh) {
        return {
          message: 'Pegawai sudah terdaftar sebagai penyuluh',
        };
      }

      const penyuluh = await penyuluhRepo.create(body);

      await logActivitySimple({
        context: { headers, request, path },
        aktivitas: 'CREATE',
        modul: 'PENYULUH',
        deskripsi: `Membuat penyuluh baru dengan pegawai_id: ${body.pegawai_id}`,
        data_baru: penyuluh,
      });

      return successResponse("Penyuluh berhasil ditambahkan", penyuluh);
    } catch (error) {
      console.error('Error creating penyuluh:', error);
      
      await logActivitySimple({
        context: { headers, request, path },
        aktivitas: 'CREATE',
        modul: 'PENYULUH',
        deskripsi: `Gagal membuat penyuluh: ${error instanceof Error ? error.message : 'Unknown error'}`,
        status: 'ERROR',
        error_message: error instanceof Error ? error.message : 'Unknown error',
      });
      
      throw new Error('Gagal menambahkan penyuluh');
    }
  },

  async update({ params, body, headers, request, path }: Context<{ params: { id: string }; body: UpdatePenyuluhType }>) {
    try {
      const id = parseInt(params.id);
      if (isNaN(id)) {
        return {
          message: 'ID tidak valid',
        };
      }

      const existing = await penyuluhRepo.findById(id);
      if (!existing) {
        return {
          message: 'Penyuluh tidak ditemukan',
        };
      }

      // Check if pegawai_id is being updated and already exists
      if (body.pegawai_id && body.pegawai_id !== existing.pegawai_id) {
        const existingPenyuluh = await penyuluhRepo.findByPegawaiId(body.pegawai_id);
        if (existingPenyuluh) {
          return {
            message: 'Pegawai sudah terdaftar sebagai penyuluh',
          };
        }
      }

      const penyuluh = await penyuluhRepo.update(id, body);

      await logActivitySimple({
        context: { headers, request, path },
        aktivitas: 'UPDATE',
        modul: 'PENYULUH',
        deskripsi: `Mengupdate penyuluh ID: ${id}`,
        data_lama: existing,
        data_baru: penyuluh,
      });

      return successResponse("Penyuluh berhasil diupdate", penyuluh);
    } catch (error) {
      console.error('Error updating penyuluh:', error);
      
      await logActivitySimple({
        context: { headers, request, path },
        aktivitas: 'UPDATE',
        modul: 'PENYULUH',
        deskripsi: `Gagal mengupdate penyuluh: ${error instanceof Error ? error.message : 'Unknown error'}`,
        status: 'ERROR',
        error_message: error instanceof Error ? error.message : 'Unknown error',
      });
      
      throw new Error('Gagal mengupdate penyuluh');
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

      const existing = await penyuluhRepo.findById(id);
      if (!existing) {
        return {
          message: 'Penyuluh tidak ditemukan',
        };
      }

      await penyuluhRepo.delete(id);

      await logActivitySimple({
        context: { headers, request, path },
        aktivitas: 'DELETE',
        modul: 'PENYULUH',
        deskripsi: `Menghapus penyuluh ID: ${id}`,
        data_lama: existing,
      });

      return successResponse("Penyuluh berhasil dihapus");
    } catch (error) {
      console.error('Error deleting penyuluh:', error);
      
      await logActivitySimple({
        context: { headers, request, path },
        aktivitas: 'DELETE',
        modul: 'PENYULUH',
        deskripsi: `Gagal menghapus penyuluh: ${error instanceof Error ? error.message : 'Unknown error'}`,
        status: 'ERROR',
        error_message: error instanceof Error ? error.message : 'Unknown error',
      });
      
      throw new Error('Gagal menghapus penyuluh');
    }
  },
};
