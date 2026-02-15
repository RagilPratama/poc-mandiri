import { AbsensiRepository } from '../repositories/absensi.repository';
import type { CreateAbsensiType, CheckoutAbsensiType, UpdateAbsensiType, AbsensiQueryType } from '../types/absensi';

const absensiRepo = new AbsensiRepository();

export const absensiHandler = {
  async getAll({ query }: any) {
    try {
      const result = await absensiRepo.findAll(query);
      return {
        success: true,
        message: 'Data absensi berhasil diambil',
        ...result,
      };
    } catch (error) {
      console.error('Error getting absensi:', error);
      throw new Error('Gagal mengambil data absensi');
    }
  },

  async getById({ params }: any) {
    try {
      const id = parseInt(params.id);
      if (isNaN(id)) {
        return {
          success: false,
          message: 'ID tidak valid',
        };
      }

      const absensi = await absensiRepo.findById(id);
      if (!absensi) {
        return {
          success: false,
          message: 'Data absensi tidak ditemukan',
        };
      }

      return {
        success: true,
        message: 'Data absensi berhasil diambil',
        data: absensi,
      };
    } catch (error) {
      console.error('Error getting absensi by id:', error);
      throw new Error('Gagal mengambil data absensi');
    }
  },

  async checkin({ body }: any) {
    try {
      // Check if already checked in today
      const existing = await absensiRepo.findByNipAndDate(body.nip, body.date);
      if (existing) {
        return {
          success: false,
          message: 'Sudah melakukan check-in hari ini',
        };
      }

      const absensi = await absensiRepo.create({
        ...body,
        checkin: new Date(body.checkin),
      });
      return {
        success: true,
        message: 'Check-in berhasil',
        data: absensi,
      };
    } catch (error) {
      console.error('Error check-in:', error);
      throw new Error('Gagal melakukan check-in');
    }
  },

  async checkout({ params, body }: any) {
    try {
      const id = parseInt(params.id);
      if (isNaN(id)) {
        return {
          success: false,
          message: 'ID tidak valid',
        };
      }

      const existing = await absensiRepo.findById(id);
      if (!existing) {
        return {
          success: false,
          message: 'Data absensi tidak ditemukan',
        };
      }

      if (existing.checkout) {
        return {
          success: false,
          message: 'Sudah melakukan check-out',
        };
      }

      const absensi = await absensiRepo.checkout(id, {
        ...body,
        checkout: new Date(body.checkout),
      });
      return {
        success: true,
        message: 'Check-out berhasil',
        data: absensi,
      };
    } catch (error) {
      console.error('Error check-out:', error);
      throw new Error('Gagal melakukan check-out');
    }
  },

  async update({ params, body }: any) {
    try {
      const id = parseInt(params.id);
      if (isNaN(id)) {
        return {
          success: false,
          message: 'ID tidak valid',
        };
      }

      const existing = await absensiRepo.findById(id);
      if (!existing) {
        return {
          success: false,
          message: 'Data absensi tidak ditemukan',
        };
      }

      const absensi = await absensiRepo.update(id, body);
      return {
        success: true,
        message: 'Data absensi berhasil diupdate',
        data: absensi,
      };
    } catch (error) {
      console.error('Error updating absensi:', error);
      throw new Error('Gagal mengupdate data absensi');
    }
  },

  async delete({ params }: any) {
    try {
      const id = parseInt(params.id);
      if (isNaN(id)) {
        return {
          success: false,
          message: 'ID tidak valid',
        };
      }

      const existing = await absensiRepo.findById(id);
      if (!existing) {
        return {
          success: false,
          message: 'Data absensi tidak ditemukan',
        };
      }

      await absensiRepo.delete(id);
      return {
        success: true,
        message: 'Data absensi berhasil dihapus',
      };
    } catch (error) {
      console.error('Error deleting absensi:', error);
      throw new Error('Gagal menghapus data absensi');
    }
  },
};
