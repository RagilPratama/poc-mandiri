import { ProduksiHasilTangkapanRepository } from '../repositories/produksi-hasil-tangkapan.repository';
import { successResponse, successResponseWithPagination } from '../utils/response';
import { logActivitySimple } from '../utils/activity-logger';

const produksiRepo = new ProduksiHasilTangkapanRepository();

export const produksiHasilTangkapanHandler = {
  async getAll({ query }: any) {
    try {
      const result = await produksiRepo.findAll(query);
      return successResponseWithPagination(
        'Data produksi hasil tangkapan berhasil diambil',
        result.data,
        result.pagination
      );
    } catch (error) {
      console.error('Error getting produksi hasil tangkapan:', error);
      throw new Error('Gagal mengambil data produksi hasil tangkapan');
    }
  },

  async getById({ params }: any) {
    try {
      const id = parseInt(params.id);
      if (isNaN(id)) {
        return {
          message: 'ID tidak valid',
        };
      }

      const produksi = await produksiRepo.findById(id);
      if (!produksi) {
        return {
          message: 'Data produksi hasil tangkapan tidak ditemukan',
        };
      }

      return successResponse('Data produksi hasil tangkapan berhasil diambil', produksi);
    } catch (error) {
      console.error('Error getting produksi hasil tangkapan by id:', error);
      throw new Error('Gagal mengambil data produksi hasil tangkapan');
    }
  },

  async create({ body, headers, request, path }: any) {
    try {
      // Validate required fields
      if (!body.kelompok_nelayan_id || !body.tanggal_produksi || !body.komoditas_id || !body.jumlah_produksi || !body.satuan) {
        return {
          message: 'Kelompok nelayan, tanggal produksi, komoditas, jumlah produksi, dan satuan wajib diisi',
        };
      }

      const produksi = await produksiRepo.create(body);

      await logActivitySimple({
        context: { headers, request, path },
        aktivitas: 'CREATE',
        modul: 'PRODUKSI',
        deskripsi: `Membuat produksi hasil tangkapan baru pada ${body.tanggal_produksi}`,
        data_baru: produksi,
      });

      return successResponse('Data produksi hasil tangkapan berhasil ditambahkan', produksi);
    } catch (error) {
      console.error('Error creating produksi hasil tangkapan:', error);
      
      await logActivitySimple({
        context: { headers, request, path },
        aktivitas: 'CREATE',
        modul: 'PRODUKSI',
        deskripsi: `Gagal membuat produksi: ${error instanceof Error ? error.message : 'Unknown error'}`,
        status: 'ERROR',
        error_message: error instanceof Error ? error.message : 'Unknown error',
      });
      
      throw new Error('Gagal menambahkan data produksi hasil tangkapan');
    }
  },

  async update({ params, body, headers, request, path }: any) {
    try {
      const id = parseInt(params.id);
      if (isNaN(id)) {
        return {
          message: 'ID tidak valid',
        };
      }

      const existing = await produksiRepo.findById(id);
      if (!existing) {
        return {
          message: 'Data produksi hasil tangkapan tidak ditemukan',
        };
      }

      const produksi = await produksiRepo.update(id, body);

      await logActivitySimple({
        context: { headers, request, path },
        aktivitas: 'UPDATE',
        modul: 'PRODUKSI',
        deskripsi: `Mengupdate produksi hasil tangkapan ID: ${id}`,
        data_lama: existing,
        data_baru: produksi,
      });

      return successResponse('Data produksi hasil tangkapan berhasil diupdate', produksi);
    } catch (error) {
      console.error('Error updating produksi hasil tangkapan:', error);
      
      await logActivitySimple({
        context: { headers, request, path },
        aktivitas: 'UPDATE',
        modul: 'PRODUKSI',
        deskripsi: `Gagal mengupdate produksi: ${error instanceof Error ? error.message : 'Unknown error'}`,
        status: 'ERROR',
        error_message: error instanceof Error ? error.message : 'Unknown error',
      });
      
      throw new Error('Gagal mengupdate data produksi hasil tangkapan');
    }
  },

  async delete({ params, headers, request, path }: any) {
    try {
      const id = parseInt(params.id);
      if (isNaN(id)) {
        return {
          message: 'ID tidak valid',
        };
      }

      const existing = await produksiRepo.findById(id);
      if (!existing) {
        return {
          message: 'Data produksi hasil tangkapan tidak ditemukan',
        };
      }

      await produksiRepo.delete(id);

      await logActivitySimple({
        context: { headers, request, path },
        aktivitas: 'DELETE',
        modul: 'PRODUKSI',
        deskripsi: `Menghapus produksi hasil tangkapan ID: ${id}`,
        data_lama: existing,
      });

      return successResponse('Data produksi hasil tangkapan berhasil dihapus');
    } catch (error) {
      console.error('Error deleting produksi hasil tangkapan:', error);
      
      await logActivitySimple({
        context: { headers, request, path },
        aktivitas: 'DELETE',
        modul: 'PRODUKSI',
        deskripsi: `Gagal menghapus produksi: ${error instanceof Error ? error.message : 'Unknown error'}`,
        status: 'ERROR',
        error_message: error instanceof Error ? error.message : 'Unknown error',
      });
      
      throw new Error('Gagal menghapus data produksi hasil tangkapan');
    }
  },
};
