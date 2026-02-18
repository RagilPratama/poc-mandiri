import { Context } from 'elysia';
import { PegawaiRepository } from '../repositories/pegawai.repository';
import { successResponse, successResponseWithPagination } from '../utils/response';
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
      
      const pegawai = await pegawaiRepo.findByEmail(email);
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

  async create({ body }: Context<{ body: CreatePegawaiType }>) {
    try {
      // Check if NIP already exists
      const existingNip = await pegawaiRepo.findByNip(body.nip);
      if (existingNip) {
        return {
          message: 'NIP sudah terdaftar',
        };
      }

      // Check if email already exists
      const existingEmail = await pegawaiRepo.findByEmail(body.email);
      if (existingEmail) {
        return {
          message: 'Email sudah terdaftar',
        };
      }

      const pegawai = await pegawaiRepo.create(body);
      return successResponse('Pegawai berhasil ditambahkan', pegawai);
    } catch (error) {
      console.error('Error creating pegawai:', error);
      throw new Error('Gagal menambahkan pegawai');
    }
  },

  async update({ params, body }: Context<{ params: { id: string }; body: UpdatePegawaiType }>) {
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
      return successResponse('Pegawai berhasil diupdate', pegawai);
    } catch (error) {
      console.error('Error updating pegawai:', error);
      throw new Error('Gagal mengupdate pegawai');
    }
  },

  async delete({ params }: Context<{ params: { id: string } }>) {
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
      return successResponse('Pegawai berhasil dihapus');
    } catch (error) {
      console.error('Error deleting pegawai:', error);
      throw new Error('Gagal menghapus pegawai');
    }
  },
};
