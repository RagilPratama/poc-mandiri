import { RoleRepository } from '../repositories/role.repository';
import { successResponse, successResponseWithPagination } from '../utils/response';
import { logActivitySimple } from '../utils/activity-logger';
import type { CreateRoleDTO, UpdateRoleDTO } from '../types/role';

const roleRepo = new RoleRepository();

export const roleHandlers = {
  async getAll({ query }: { query: { page?: string; limit?: string; search?: string } }) {
    try {
      const page = query.page ? parseInt(query.page) : 1;
      const limit = query.limit ? parseInt(query.limit) : 10;
      const search = query.search;

      const result = await roleRepo.findAll(page, limit, search);
      return successResponseWithPagination(
        "Data role berhasil diambil",
        result.data,
        result.pagination
      );
    } catch (error) {
      console.error('Error fetching roles:', error);
      throw error;
    }
  },

  async getById({ params }: { params: { id: number } }) {
    try {
      const role = await roleRepo.findById(params.id);
      
      if (!role) {
        throw new Error("Role not found");
      }

      return successResponse("Data role berhasil diambil", role);
    } catch (error) {
      console.error('Error fetching role:', error);
      throw error;
    }
  },

  async create({ body, headers, request, path }: { body: CreateRoleDTO; headers: any; request: any; path: any }) {
    try {
      const role = await roleRepo.create(body);

      await logActivitySimple({
        context: { headers, request, path },
        aktivitas: 'CREATE',
        modul: 'ROLE',
        deskripsi: `Membuat role baru: ${body.nama_role}`,
        data_baru: role,
      });
      
      return successResponse("Role berhasil ditambahkan", role);
    } catch (error) {
      console.error('Error creating role:', error);
      
      await logActivitySimple({
        context: { headers, request, path },
        aktivitas: 'CREATE',
        modul: 'ROLE',
        deskripsi: `Gagal membuat role: ${error instanceof Error ? error.message : 'Unknown error'}`,
        status: 'ERROR',
        error_message: error instanceof Error ? error.message : 'Unknown error',
      });
      
      throw error;
    }
  },

  async update({ params, body, headers, request, path }: { params: { id: number }; body: UpdateRoleDTO; headers: any; request: any; path: any }) {
    try {
      const existing = await roleRepo.findById(params.id);
      if (!existing) {
        throw new Error("Role not found");
      }

      const role = await roleRepo.update(params.id, body);

      await logActivitySimple({
        context: { headers, request, path },
        aktivitas: 'UPDATE',
        modul: 'ROLE',
        deskripsi: `Mengupdate role: ${existing.nama_role}`,
        data_lama: existing,
        data_baru: role,
      });

      return successResponse("Role berhasil diupdate", role);
    } catch (error) {
      console.error('Error updating role:', error);
      
      await logActivitySimple({
        context: { headers, request, path },
        aktivitas: 'UPDATE',
        modul: 'ROLE',
        deskripsi: `Gagal mengupdate role: ${error instanceof Error ? error.message : 'Unknown error'}`,
        status: 'ERROR',
        error_message: error instanceof Error ? error.message : 'Unknown error',
      });
      
      throw error;
    }
  },

  async delete({ params, headers, request, path }: { params: { id: number }; headers: any; request: any; path: any }) {
    try {
      const existing = await roleRepo.findById(params.id);
      if (!existing) {
        throw new Error("Role not found");
      }

      const role = await roleRepo.delete(params.id);

      await logActivitySimple({
        context: { headers, request, path },
        aktivitas: 'DELETE',
        modul: 'ROLE',
        deskripsi: `Menghapus role: ${existing.nama_role}`,
        data_lama: existing,
      });

      return successResponse("Role berhasil dihapus");
    } catch (error) {
      console.error('Error deleting role:', error);
      
      await logActivitySimple({
        context: { headers, request, path },
        aktivitas: 'DELETE',
        modul: 'ROLE',
        deskripsi: `Gagal menghapus role: ${error instanceof Error ? error.message : 'Unknown error'}`,
        status: 'ERROR',
        error_message: error instanceof Error ? error.message : 'Unknown error',
      });
      
      throw error;
    }
  },
};
