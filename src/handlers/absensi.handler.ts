import { sql, eq } from 'drizzle-orm';
import { db } from '../db';
import { absensi } from '../db/schema/absensi';
import { AbsensiRepository } from '../repositories/absensi.repository';
import { uploadImage } from '../utils/imagekit';
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

      // Validate photo
      if (!body.checkin_photo) {
        return {
          success: false,
          message: 'Foto check-in wajib diupload',
        };
      }

      // Upload photo to ImageKit
      const photoFile = body.checkin_photo;
      const photoBuffer = Buffer.from(await photoFile.arrayBuffer());
      const fileName = `checkin_${body.nip}_${body.date}_${Date.now()}.jpg`;
      const folder = `/absensi/${body.nip}/${body.date}`;

      const uploadResult = await uploadImage(photoBuffer, fileName, folder);

      const checkinDate = new Date(body.checkin);
      const absensi = await absensiRepo.create({
        date: body.date,
        nip: body.nip,
        checkin: checkinDate,
        ci_latitude: body.ci_latitude,
        ci_longitude: body.ci_longitude,
        checkin_photo_url: uploadResult.url,
        checkin_photo_id: uploadResult.fileId,
      });

      // Format jam check-in (HH:MM)
      const checkinTime = checkinDate.toLocaleTimeString('id-ID', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false 
      });

      return {
        success: true,
        message: 'Check-in berhasil',
        data: {
          ...absensi,
          checkin_time: checkinTime,
        },
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

      const checkoutDate = new Date(body.checkout);
      const absensi = await absensiRepo.checkout(id, {
        ...body,
        checkout: checkoutDate,
      });

      // Format jam check-in dan check-out (HH:MM)
      const checkinTime = new Date(existing.checkin).toLocaleTimeString('id-ID', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false 
      });
      
      const checkoutTime = checkoutDate.toLocaleTimeString('id-ID', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false 
      });

      // Format working hours (X jam Y menit)
      const workingHoursDecimal = parseFloat(absensi?.working_hours || '0');
      const hours = Math.floor(workingHoursDecimal);
      const minutes = Math.round((workingHoursDecimal % 1) * 60);
      const workingHoursFormatted = `${hours} jam ${minutes} menit`;

      // Format overtime (X jam Y menit)
      let overtimeFormatted = '0 jam 0 menit';
      if (absensi?.total_overtime) {
        const overtimeDecimal = parseFloat(absensi.total_overtime);
        const overtimeHours = Math.floor(overtimeDecimal);
        const overtimeMinutes = Math.round((overtimeDecimal % 1) * 60);
        overtimeFormatted = `${overtimeHours} jam ${overtimeMinutes} menit`;
      }

      return {
        success: true,
        message: 'Check-out berhasil',
        data: {
          ...absensi,
          checkin_time: checkinTime,
          checkout_time: checkoutTime,
          working_hours_formatted: workingHoursFormatted,
          total_overtime_formatted: overtimeFormatted,
        },
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

  async deleteByDate({ body }: any) {
    try {
      const { date } = body;

      // Check if any records exist for this date
      const existing = await db
        .select({ count: sql<number>`count(*)::int` })
        .from(absensi)
        .where(eq(absensi.date, date));

      const count = existing[0]?.count || 0;
      
      if (count === 0) {
        return {
          success: false,
          message: 'Tidak ada data absensi pada tanggal tersebut',
        };
      }

      const deleted = await absensiRepo.deleteAllByDate(date);
      return {
        success: true,
        message: `Berhasil menghapus ${deleted.length} data absensi`,
        data: {
          deleted_count: deleted.length,
          date: date,
        },
      };
    } catch (error) {
      console.error('Error deleting absensi by date:', error);
      throw new Error('Gagal menghapus data absensi');
    }
  },
};
