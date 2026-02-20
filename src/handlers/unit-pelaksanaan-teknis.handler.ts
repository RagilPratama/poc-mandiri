import { unitPelaksanaanTeknisRepository } from '../repositories/unit-pelaksanaan-teknis.repository';
import { successResponse } from '../utils/response';
import { logActivitySimple } from '../utils/activity-logger';
import type { CreateUnitPelaksanaanTeknisDTO, UpdateUnitPelaksanaanTeknisDTO } from '../types/unit-pelaksanaan-teknis';

export const unitPelaksanaanTeknisHandler = {
  async getAll() {
    try {
      const data = await unitPelaksanaanTeknisRepository.findAll();
      return successResponse("Data UPT berhasil diambil", data);
    } catch (error) {
      console.error('Error fetching unit pelaksanaan teknis:', error);
      throw new Error('Failed to fetch unit pelaksanaan teknis');
    }
  },

  async getById({ params }: { params: { id: number } }) {
    try {
      const data = await unitPelaksanaanTeknisRepository.findById(params.id);
      
      if (!data) {
        throw new Error("Unit pelaksanaan teknis not found");
      }

      return successResponse("Data UPT berhasil diambil", data);
    } catch (error) {
      console.error('Error fetching unit pelaksanaan teknis:', error);
      throw error;
    }
  },

  async create({ body, headers, request, path }: { body: CreateUnitPelaksanaanTeknisDTO; headers: any; request: any; path: any }) {
    try {
      const data = await unitPelaksanaanTeknisRepository.create(body);

      await logActivitySimple({
        context: { headers, request, path },
        aktivitas: 'CREATE',
        modul: 'UPT',
        deskripsi: `Membuat UPT baru: ${body.nama_upt}`,
        data_baru: data,
      });
      
      return successResponse("UPT berhasil ditambahkan", data);
    } catch (error) {
      console.error('Error creating unit pelaksanaan teknis:', error);
      
      await logActivitySimple({
        context: { headers, request, path },
        aktivitas: 'CREATE',
        modul: 'UPT',
        deskripsi: `Gagal membuat UPT: ${error instanceof Error ? error.message : 'Unknown error'}`,
        status: 'ERROR',
        error_message: error instanceof Error ? error.message : 'Unknown error',
      });
      
      throw new Error('Failed to create unit pelaksanaan teknis');
    }
  },

  async update({ params, body, headers, request, path }: { params: { id: number }; body: UpdateUnitPelaksanaanTeknisDTO; headers: any; request: any; path: any }) {
    try {
      const existing = await unitPelaksanaanTeknisRepository.findById(params.id);
      if (!existing) {
        throw new Error("Unit pelaksanaan teknis not found");
      }

      const data = await unitPelaksanaanTeknisRepository.update(params.id, body);

      await logActivitySimple({
        context: { headers, request, path },
        aktivitas: 'UPDATE',
        modul: 'UPT',
        deskripsi: `Mengupdate UPT: ${existing.nama_upt}`,
        data_lama: existing,
        data_baru: data,
      });

      return successResponse("UPT berhasil diupdate", data);
    } catch (error) {
      console.error('Error updating unit pelaksanaan teknis:', error);
      
      await logActivitySimple({
        context: { headers, request, path },
        aktivitas: 'UPDATE',
        modul: 'UPT',
        deskripsi: `Gagal mengupdate UPT: ${error instanceof Error ? error.message : 'Unknown error'}`,
        status: 'ERROR',
        error_message: error instanceof Error ? error.message : 'Unknown error',
      });
      
      throw error;
    }
  },

  async delete({ params, headers, request, path }: { params: { id: number }; headers: any; request: any; path: any }) {
    try {
      const existing = await unitPelaksanaanTeknisRepository.findById(params.id);
      if (!existing) {
        throw new Error("Unit pelaksanaan teknis not found");
      }

      const data = await unitPelaksanaanTeknisRepository.delete(params.id);

      await logActivitySimple({
        context: { headers, request, path },
        aktivitas: 'DELETE',
        modul: 'UPT',
        deskripsi: `Menghapus UPT: ${existing.nama_upt}`,
        data_lama: existing,
      });

      return successResponse("UPT berhasil dihapus");
    } catch (error) {
      console.error('Error deleting unit pelaksanaan teknis:', error);
      
      await logActivitySimple({
        context: { headers, request, path },
        aktivitas: 'DELETE',
        modul: 'UPT',
        deskripsi: `Gagal menghapus UPT: ${error instanceof Error ? error.message : 'Unknown error'}`,
        status: 'ERROR',
        error_message: error instanceof Error ? error.message : 'Unknown error',
      });
      
      throw error;
    }
  },
};
