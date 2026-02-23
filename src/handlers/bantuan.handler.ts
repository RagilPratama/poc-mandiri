import { BantuanRepository } from '../repositories/bantuan.repository';
import { successResponse, successResponseWithPagination } from '../utils/response';
import { logActivitySimple } from '../utils/activity-logger';

const bantuanRepo = new BantuanRepository();

export const bantuanHandler = {
  async getAll({ query }: any) {
    try {
      const result = await bantuanRepo.findAll(query);
      return successResponseWithPagination(
        'Data bantuan berhasil diambil',
        result.data,
        result.pagination
      );
    } catch (error) {
      console.error('Error getting bantuan:', error);
      throw new Error('Gagal mengambil data bantuan');
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

      const bantuan = await bantuanRepo.findById(id);
      if (!bantuan) {
        return {
          message: 'Data bantuan tidak ditemukan',
        };
      }

      return successResponse('Data bantuan berhasil diambil', bantuan);
    } catch (error) {
      console.error('Error getting bantuan by id:', error);
      throw new Error('Gagal mengambil data bantuan');
    }
  },

  async create({ body, headers, request, path }: any) {
    try {
      // Validate required fields
      if (!body.no_bantuan || !body.jenis_bantuan_id || !body.kelompok_nelayan_id || !body.penyuluh_id || 
          !body.tanggal_penyaluran || !body.jumlah || !body.satuan || !body.nilai_bantuan || !body.tahun_anggaran) {
        return {
          message: 'Semua field wajib diisi',
        };
      }

      const bantuan = await bantuanRepo.create(body);

      await logActivitySimple({
        context: { headers, request, path },
        aktivitas: 'CREATE',
        modul: 'BANTUAN',
        deskripsi: `Membuat bantuan baru: ${body.no_bantuan}`,
        data_baru: bantuan,
      });

      return successResponse('Data bantuan berhasil ditambahkan', bantuan);
    } catch (error) {
      console.error('Error creating bantuan:', error);
      
      await logActivitySimple({
        context: { headers, request, path },
        aktivitas: 'CREATE',
        modul: 'BANTUAN',
        deskripsi: `Gagal membuat bantuan: ${error instanceof Error ? error.message : 'Unknown error'}`,
        status: 'ERROR',
        error_message: error instanceof Error ? error.message : 'Unknown error',
      });
      
      throw new Error('Gagal menambahkan data bantuan');
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

      const existing = await bantuanRepo.findById(id);
      if (!existing) {
        return {
          message: 'Data bantuan tidak ditemukan',
        };
      }

      const bantuan = await bantuanRepo.update(id, body);

      await logActivitySimple({
        context: { headers, request, path },
        aktivitas: 'UPDATE',
        modul: 'BANTUAN',
        deskripsi: `Mengupdate bantuan: ${existing.no_bantuan}`,
        data_lama: existing,
        data_baru: bantuan,
      });

      return successResponse('Data bantuan berhasil diupdate', bantuan);
    } catch (error) {
      console.error('Error updating bantuan:', error);
      
      await logActivitySimple({
        context: { headers, request, path },
        aktivitas: 'UPDATE',
        modul: 'BANTUAN',
        deskripsi: `Gagal mengupdate bantuan: ${error instanceof Error ? error.message : 'Unknown error'}`,
        status: 'ERROR',
        error_message: error instanceof Error ? error.message : 'Unknown error',
      });
      
      throw new Error('Gagal mengupdate data bantuan');
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

      const existing = await bantuanRepo.findById(id);
      if (!existing) {
        return {
          message: 'Data bantuan tidak ditemukan',
        };
      }

      await bantuanRepo.delete(id);

      await logActivitySimple({
        context: { headers, request, path },
        aktivitas: 'DELETE',
        modul: 'BANTUAN',
        deskripsi: `Menghapus bantuan: ${existing.no_bantuan}`,
        data_lama: existing,
      });

      return successResponse('Data bantuan berhasil dihapus');
    } catch (error) {
      console.error('Error deleting bantuan:', error);
      
      await logActivitySimple({
        context: { headers, request, path },
        aktivitas: 'DELETE',
        modul: 'BANTUAN',
        deskripsi: `Gagal menghapus bantuan: ${error instanceof Error ? error.message : 'Unknown error'}`,
        status: 'ERROR',
        error_message: error instanceof Error ? error.message : 'Unknown error',
      });
      
      throw new Error('Gagal menghapus data bantuan');
    }
  },
};
