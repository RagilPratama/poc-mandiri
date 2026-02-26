import { Context } from 'elysia';
import { PegawaiRepository } from '../repositories/pegawai.repository';
import { successResponse, successResponseWithPagination } from '../utils/response';
import { logActivityAsync } from '../utils/activity-logger';
import type { CreatePegawaiType, UpdatePegawaiType, PegawaiQueryType } from '../types/pegawai';

const pegawaiRepo = new PegawaiRepository();

export const pegawaiHandler = {
  async getAll({ query }: Context<{ query: PegawaiQueryType }>) {
    try {
      const result = await pegawaiRepo.findAll(query);
      return successResponseWithPagination(
        'Data pegawai berhasil diambil',
        result.data,
        result.pagination
      );
    } catch (error) {
      console.error('Error getting pegawai:', error);
      throw new Error('Gagal mengambil data pegawai');
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

      const pegawai = await pegawaiRepo.findById(id);
      if (!pegawai) {
        return {
          message: 'Pegawai tidak ditemukan',
        };
      }

      return successResponse('Data pegawai berhasil diambil', pegawai);
    } catch (error) {
      console.error('Error getting pegawai by id:', error);
      throw new Error('Gagal mengambil data pegawai');
    }
  },

  async getByEmail({ params }: Context<{ params: { email: string } }>) {
    try {
      const { email } = params;
      
      const pegawai = await pegawaiRepo.getByEmail(email);
      if (!pegawai) {
        return {
          message: 'Pegawai tidak ditemukan',
        };
      }

      return successResponse('Data pegawai berhasil diambil', pegawai);
    } catch (error) {
      console.error('Error getting pegawai by email:', error);
      throw new Error('Gagal mengambil data pegawai');
    }
  },

  async create({ body, headers, request, path }: Context<{ body: CreatePegawaiType }>) {
    try {
      const pegawai = await pegawaiRepo.create(body);

      // Fire-and-forget async logging
      logActivityAsync({
        context: { headers, request, path },
        aktivitas: 'CREATE',
        modul: 'PEGAWAI',
        deskripsi: `Membuat pegawai baru: ${body.nama} (${body.nip})`,
        data_baru: pegawai,
      });

      return successResponse('Pegawai berhasil ditambahkan', pegawai);
    } catch (error) {
      let errorMessage = 'Gagal menambahkan pegawai';
      
      // Handle unique constraint violations
      if (error instanceof Error) {
        if (error.message.includes('nip')) {
          errorMessage = 'NIP sudah terdaftar';
        } else if (error.message.includes('email')) {
          errorMessage = 'Email sudah terdaftar';
        }
      }

      logActivityAsync({
        context: { headers, request, path },
        aktivitas: 'CREATE',
        modul: 'PEGAWAI',
        deskripsi: `Gagal membuat pegawai: ${error instanceof Error ? error.message : 'Unknown error'}`,
        status: 'ERROR',
        error_message: error instanceof Error ? error.message : 'Unknown error',
      });
      
      throw new Error(errorMessage);
    }
  },

  async update({ params, body, headers, request, path }: Context<{ params: { id: string }; body: UpdatePegawaiType }>) {
    try {
      const id = parseInt(params.id);
      if (isNaN(id)) {
        return {
          message: 'ID tidak valid',
        };
      }

      const existing = await pegawaiRepo.findById(id);
      if (!existing) {
        return {
          message: 'Pegawai tidak ditemukan',
        };
      }

      // Check if NIP is being updated and already exists
      if (body.nip && body.nip !== existing.nip) {
        const existingNip = await pegawaiRepo.findByNip(body.nip);
        if (existingNip) {
          return {
            message: 'NIP sudah terdaftar',
          };
        }
      }

      // Check if email is being updated and already exists
      if (body.email && body.email !== existing.email) {
        const existingEmail = await pegawaiRepo.findByEmail(body.email);
        if (existingEmail) {
          return {
            message: 'Email sudah terdaftar',
          };
        }
      }

      const pegawai = await pegawaiRepo.update(id, body);

      // Fire-and-forget async logging
      logActivityAsync({
        context: { headers, request, path },
        aktivitas: 'UPDATE',
        modul: 'PEGAWAI',
        deskripsi: `Mengupdate pegawai: ${existing.nama} (${existing.nip})`,
        data_lama: existing,
        data_baru: pegawai,
      });

      return successResponse('Pegawai berhasil diupdate', pegawai);
    } catch (error) {
      console.error('Error updating pegawai:', error);
      
      logActivityAsync({
        context: { headers, request, path },
        aktivitas: 'UPDATE',
        modul: 'PEGAWAI',
        deskripsi: `Gagal mengupdate pegawai: ${error instanceof Error ? error.message : 'Unknown error'}`,
        status: 'ERROR',
        error_message: error instanceof Error ? error.message : 'Unknown error',
      });
      
      throw new Error('Gagal mengupdate pegawai');
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

      const existing = await pegawaiRepo.findById(id);
      if (!existing) {
        return {
          message: 'Pegawai tidak ditemukan',
        };
      }

      await pegawaiRepo.delete(id);

      // Fire-and-forget async logging
      logActivityAsync({
        context: { headers, request, path },
        aktivitas: 'DELETE',
        modul: 'PEGAWAI',
        deskripsi: `Menghapus pegawai: ${existing.nama} (${existing.nip})`,
        data_lama: existing,
      });

      return successResponse('Pegawai berhasil dihapus');
    } catch (error) {
      console.error('Error deleting pegawai:', error);
      
      logActivityAsync({
        context: { headers, request, path },
        aktivitas: 'DELETE',
        modul: 'PEGAWAI',
        deskripsi: `Gagal menghapus pegawai: ${error instanceof Error ? error.message : 'Unknown error'}`,
        status: 'ERROR',
        error_message: error instanceof Error ? error.message : 'Unknown error',
      });
      
      throw new Error('Gagal menghapus pegawai');
    }
  },
};
