import { Context } from 'elysia';
import { LogAktivitasRepository } from '../repositories/log-aktivitas.repository';
import { successResponse, successResponseWithPagination } from '../utils/response';

const logAktivitasRepo = new LogAktivitasRepository();

export const logAktivitasHandler = {
  async getAll({ query }: Context<{ query: { 
    page?: number; 
    limit?: number; 
    search?: string; 
    modul?: string;
    aktivitas?: string;
    status?: string;
    pegawai_id?: number;
    user_id?: string;
    start_date?: string;
    end_date?: string;
  } }>) {
    try {
      const result = await logAktivitasRepo.findAll(query);
      return successResponseWithPagination(
        'Data log aktivitas berhasil diambil',
        result.data,
        result.pagination
      );
    } catch (error) {
      console.error('Error getting log aktivitas:', error);
      throw new Error('Gagal mengambil data log aktivitas');
    }
  },

  async getById({ params }: Context<{ params: { id: number } }>) {
    try {
      const id = params.id;

      const log = await logAktivitasRepo.findById(id);
      if (!log) {
        return {
          message: 'Log aktivitas tidak ditemukan',
        };
      }

      return successResponse('Data log aktivitas berhasil diambil', log);
    } catch (error) {
      console.error('Error getting log aktivitas by id:', error);
      throw new Error('Gagal mengambil data log aktivitas');
    }
  },

  async getStatistics({ query }: Context<{ query: any }>) {
    try {
      const stats = await logAktivitasRepo.getStatistics(query);
      return successResponse('Statistik log aktivitas berhasil diambil', stats);
    } catch (error) {
      console.error('Error getting log aktivitas statistics:', error);
      throw new Error('Gagal mengambil statistik log aktivitas');
    }
  },
};
