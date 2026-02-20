import { Context } from 'elysia';
import { KapalRepository } from '../repositories/kapal.repository';
import { successResponse, successResponseWithPagination } from '../utils/response';
import { logActivitySimple } from '../utils/activity-logger';

const kapalRepo = new KapalRepository();

export const kapalHandler = {
  async getAll({ query }: Context<{ query: any }>) {
    try {
      const result = await kapalRepo.findAll(query);
      return successResponseWithPagination(
        'Data kapal berhasil diambil',
        result.data,
        result.pagination
      );
    } catch (error) {
      console.error('Error getting kapal:', error);
      throw new Error('Gagal mengambil data kapal');
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

      const kapal = await kapalRepo.findById(id);
      if (!kapal) {
        return {
          message: 'Kapal tidak ditemukan',
        };
      }

      return successResponse('Data kapal berhasil diambil', kapal);
    } catch (error) {
      console.error('Error getting kapal by id:', error);
      throw new Error('Gagal mengambil data kapal');
    }
  },

  async create({ body, headers, request, path }: Context<{ body: any }>) {
    try {
      // Validate required fields
      if (!body.kelompok_nelayan_id || !body.no_registrasi_kapal || !body.nama_kapal || !body.jenis_kapal) {
        return {
          message: 'Kelompok nelayan, nomor registrasi, nama kapal, dan jenis kapal wajib diisi',
        };
      }

      const kapal = await kapalRepo.create(body);

      await logActivitySimple({
        context: { headers, request, path },
        aktivitas: 'CREATE',
        modul: 'KAPAL',
        deskripsi: `Membuat kapal baru: ${body.nama_kapal} (${body.no_registrasi_kapal})`,
        data_baru: kapal,
      });

      return successResponse('Kapal berhasil ditambahkan', kapal);
    } catch (error) {
      console.error('Error creating kapal:', error);
      
      await logActivitySimple({
        context: { headers, request, path },
        aktivitas: 'CREATE',
        modul: 'KAPAL',
        deskripsi: `Gagal membuat kapal: ${error instanceof Error ? error.message : 'Unknown error'}`,
        status: 'ERROR',
        error_message: error instanceof Error ? error.message : 'Unknown error',
      });
      
      throw new Error('Gagal menambahkan kapal');
    }
  },

  async update({ params, body, headers, request, path }: Context<{ params: { id: string }; body: any }>) {
    try {
      const id = parseInt(params.id);
      if (isNaN(id)) {
        return {
          message: 'ID tidak valid',
        };
      }

      const existing = await kapalRepo.findById(id);
      if (!existing) {
        return {
          message: 'Kapal tidak ditemukan',
        };
      }

      const kapal = await kapalRepo.update(id, body);

      await logActivitySimple({
        context: { headers, request, path },
        aktivitas: 'UPDATE',
        modul: 'KAPAL',
        deskripsi: `Mengupdate kapal: ${existing.nama_kapal} (${existing.no_registrasi_kapal})`,
        data_lama: existing,
        data_baru: kapal,
      });

      return successResponse('Kapal berhasil diupdate', kapal);
    } catch (error) {
      console.error('Error updating kapal:', error);
      
      await logActivitySimple({
        context: { headers, request, path },
        aktivitas: 'UPDATE',
        modul: 'KAPAL',
        deskripsi: `Gagal mengupdate kapal: ${error instanceof Error ? error.message : 'Unknown error'}`,
        status: 'ERROR',
        error_message: error instanceof Error ? error.message : 'Unknown error',
      });
      
      throw new Error('Gagal mengupdate kapal');
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

      const existing = await kapalRepo.findById(id);
      if (!existing) {
        return {
          message: 'Kapal tidak ditemukan',
        };
      }

      await kapalRepo.delete(id);

      await logActivitySimple({
        context: { headers, request, path },
        aktivitas: 'DELETE',
        modul: 'KAPAL',
        deskripsi: `Menghapus kapal: ${existing.nama_kapal} (${existing.no_registrasi_kapal})`,
        data_lama: existing,
      });

      return successResponse('Kapal berhasil dihapus');
    } catch (error) {
      console.error('Error deleting kapal:', error);
      
      await logActivitySimple({
        context: { headers, request, path },
        aktivitas: 'DELETE',
        modul: 'KAPAL',
        deskripsi: `Gagal menghapus kapal: ${error instanceof Error ? error.message : 'Unknown error'}`,
        status: 'ERROR',
        error_message: error instanceof Error ? error.message : 'Unknown error',
      });
      
      throw new Error('Gagal menghapus kapal');
    }
  },
};
