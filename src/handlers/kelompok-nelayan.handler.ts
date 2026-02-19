import { Context } from 'elysia';
import { KelompokNelayanRepository } from '../repositories/kelompok-nelayan.repository';
import { successResponse, successResponseWithPagination } from '../utils/response';
import type { CreateKelompokNelayanType, UpdateKelompokNelayanType, KelompokNelayanQueryType } from '../types/kelompok-nelayan';

const kelompokNelayanRepo = new KelompokNelayanRepository();

export const kelompokNelayanHandler = {
  async getAll({ query }: Context<{ query: KelompokNelayanQueryType }>) {
    try {
      const result = await kelompokNelayanRepo.findAll(query);
      return successResponseWithPagination(
        "Data kelompok nelayan berhasil diambil",
        result.data,
        result.pagination
      );
    } catch (error) {
      console.error('Error getting kelompok nelayan:', error);
      throw new Error('Gagal mengambil data kelompok nelayan');
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

      const kelompok = await kelompokNelayanRepo.findById(id);
      if (!kelompok) {
        return {
          message: 'Kelompok nelayan tidak ditemukan',
        };
      }

      return successResponse("Data kelompok nelayan berhasil diambil", kelompok);
    } catch (error) {
      console.error('Error getting kelompok nelayan by id:', error);
      throw new Error('Gagal mengambil data kelompok nelayan');
    }
  },

  async create({ body }: Context<{ body: CreateKelompokNelayanType }>) {
    try {
      // Check if NIB Kelompok already exists
      const existingNib = await kelompokNelayanRepo.findByNibKelompok(body.nib_kelompok);
      if (existingNib) {
        return {
          message: 'NIB Kelompok sudah terdaftar',
        };
      }

      // Check if No Registrasi already exists
      const existingNoReg = await kelompokNelayanRepo.findByNoRegistrasi(body.no_registrasi);
      if (existingNoReg) {
        return {
          message: 'Nomor Registrasi sudah terdaftar',
        };
      }

      const kelompok = await kelompokNelayanRepo.create(body);
      return successResponse("Kelompok nelayan berhasil ditambahkan", kelompok);
    } catch (error) {
      console.error('Error creating kelompok nelayan:', error);
      throw new Error('Gagal menambahkan kelompok nelayan');
    }
  },

  async update({ params, body }: Context<{ params: { id: string }; body: UpdateKelompokNelayanType }>) {
    try {
      const id = parseInt(params.id);
      if (isNaN(id)) {
        return {
          message: 'ID tidak valid',
        };
      }

      const existing = await kelompokNelayanRepo.findById(id);
      if (!existing) {
        return {
          message: 'Kelompok nelayan tidak ditemukan',
        };
      }

      // Check if NIB Kelompok is being updated and already exists
      if (body.nib_kelompok && body.nib_kelompok !== existing.nib_kelompok) {
        const existingNib = await kelompokNelayanRepo.findByNibKelompok(body.nib_kelompok);
        if (existingNib) {
          return {
            message: 'NIB Kelompok sudah terdaftar',
          };
        }
      }

      // Check if No Registrasi is being updated and already exists
      if (body.no_registrasi && body.no_registrasi !== existing.no_registrasi) {
        const existingNoReg = await kelompokNelayanRepo.findByNoRegistrasi(body.no_registrasi);
        if (existingNoReg) {
          return {
            message: 'Nomor Registrasi sudah terdaftar',
          };
        }
      }

      const kelompok = await kelompokNelayanRepo.update(id, body);
      return successResponse("Kelompok nelayan berhasil diupdate", kelompok);
    } catch (error) {
      console.error('Error updating kelompok nelayan:', error);
      throw new Error('Gagal mengupdate kelompok nelayan');
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

      const existing = await kelompokNelayanRepo.findById(id);
      if (!existing) {
        return {
          message: 'Kelompok nelayan tidak ditemukan',
        };
      }

      await kelompokNelayanRepo.delete(id);
      return successResponse("Kelompok nelayan berhasil dihapus");
    } catch (error) {
      console.error('Error deleting kelompok nelayan:', error);
      throw new Error('Gagal menghapus kelompok nelayan');
    }
  },
};
