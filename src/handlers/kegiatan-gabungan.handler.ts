import { Context } from 'elysia';
import { KegiatanGabunganRepository } from '../repositories/kegiatan-gabungan.repository';
import { successResponse } from '../utils/response';

const kegiatanGabunganRepo = new KegiatanGabunganRepository();

interface KegiatanGabunganQuery {
  pegawai_id?: number;
  tanggal?: string;
  bulan?: string;
  tahun?: string;
  group_by_date?: boolean;
}

export const kegiatanGabunganHandler = {
  async getByDate({ query }: Context<{ query: KegiatanGabunganQuery }>) {
    try {
      // Validate at least one filter is provided
      if (!query.tanggal && !query.bulan && !query.tahun) {
        return {
          message: 'Minimal satu filter (tanggal, bulan, atau tahun) wajib diisi',
        };
      }

      // Check if should group by date
      if (query.group_by_date) {
        const result = await kegiatanGabunganRepo.groupByDate(query);
        return successResponse('Data kegiatan berhasil diambil (grouped by date)', result);
      }

      const result = await kegiatanGabunganRepo.findByDate(query);
      return successResponse('Data kegiatan berhasil diambil', result);
    } catch (error) {
      console.error('Error getting kegiatan gabungan:', error);
      throw new Error('Gagal mengambil data kegiatan');
    }
  },
};
