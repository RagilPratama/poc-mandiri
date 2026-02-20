import { OrganisasiRepository } from '../repositories/organisasi.repository';
import { successResponse, successResponseWithPagination } from '../utils/response';
import { logActivitySimple } from '../utils/activity-logger';
import type { CreateOrganisasiDTO, UpdateOrganisasiDTO } from '../types/organisasi';

const organisasiRepo = new OrganisasiRepository();

export const organisasiHandlers = {
  async getAll({ query }: { query: { page?: string; limit?: string; search?: string } }) {
    try {
      const page = query.page ? parseInt(query.page) : 1;
      const limit = query.limit ? parseInt(query.limit) : 10;
      const search = query.search;

      const result = await organisasiRepo.findAll(page, limit, search);
      return successResponseWithPagination(
        "Data organisasi berhasil diambil",
        result.data,
        result.pagination
      );
    } catch (error) {
      console.error('Error fetching organisasi:', error);
      throw error;
    }
  },

  async getById({ params }: { params: { id: number } }) {
    try {
      const org = await organisasiRepo.findById(params.id);
      
      if (!org) {
        throw new Error("Organisasi not found");
      }

      return successResponse("Data organisasi berhasil diambil", org);
    } catch (error) {
      console.error('Error fetching organisasi:', error);
      throw error;
    }
  },

  async create({ body, headers, request, path }: { body: CreateOrganisasiDTO; headers: any; request: any; path: any }) {
    try {
      const org = await organisasiRepo.create(body);

      await logActivitySimple({
        context: { headers, request, path },
        aktivitas: 'CREATE',
        modul: 'ORGANISASI',
        deskripsi: `Membuat organisasi baru: ${body.nama_organisasi}`,
        data_baru: org,
      });
      
      return successResponse("Organisasi berhasil ditambahkan", org);
    } catch (error) {
      console.error('Error creating organisasi:', error);
      
      await logActivitySimple({
        context: { headers, request, path },
        aktivitas: 'CREATE',
        modul: 'ORGANISASI',
        deskripsi: `Gagal membuat organisasi: ${error instanceof Error ? error.message : 'Unknown error'}`,
        status: 'ERROR',
        error_message: error instanceof Error ? error.message : 'Unknown error',
      });
      
      throw error;
    }
  },

  async update({ params, body, headers, request, path }: { params: { id: number }; body: UpdateOrganisasiDTO; headers: any; request: any; path: any }) {
    try {
      const existing = await organisasiRepo.findById(params.id);
      if (!existing) {
        throw new Error("Organisasi not found");
      }

      const org = await organisasiRepo.update(params.id, body);

      await logActivitySimple({
        context: { headers, request, path },
        aktivitas: 'UPDATE',
        modul: 'ORGANISASI',
        deskripsi: `Mengupdate organisasi: ${existing.nama_organisasi}`,
        data_lama: existing,
        data_baru: org,
      });

      return successResponse("Organisasi berhasil diupdate", org);
    } catch (error) {
      console.error('Error updating organisasi:', error);
      
      await logActivitySimple({
        context: { headers, request, path },
        aktivitas: 'UPDATE',
        modul: 'ORGANISASI',
        deskripsi: `Gagal mengupdate organisasi: ${error instanceof Error ? error.message : 'Unknown error'}`,
        status: 'ERROR',
        error_message: error instanceof Error ? error.message : 'Unknown error',
      });
      
      throw error;
    }
  },

  async delete({ params, headers, request, path }: { params: { id: number }; headers: any; request: any; path: any }) {
    try {
      const existing = await organisasiRepo.findById(params.id);
      if (!existing) {
        throw new Error("Organisasi not found");
      }

      const org = await organisasiRepo.delete(params.id);

      await logActivitySimple({
        context: { headers, request, path },
        aktivitas: 'DELETE',
        modul: 'ORGANISASI',
        deskripsi: `Menghapus organisasi: ${existing.nama_organisasi}`,
        data_lama: existing,
      });

      return successResponse("Organisasi berhasil dihapus");
    } catch (error) {
      console.error('Error deleting organisasi:', error);
      
      await logActivitySimple({
        context: { headers, request, path },
        aktivitas: 'DELETE',
        modul: 'ORGANISASI',
        deskripsi: `Gagal menghapus organisasi: ${error instanceof Error ? error.message : 'Unknown error'}`,
        status: 'ERROR',
        error_message: error instanceof Error ? error.message : 'Unknown error',
      });
      
      throw error;
    }
  },
};
