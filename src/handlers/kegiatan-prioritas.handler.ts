import { Context } from 'elysia';
import { KegiatanPrioritasRepository } from '../repositories/kegiatan-prioritas.repository';
import { successResponse, successResponseWithPagination } from '../utils/response';
import { logActivitySimple } from '../utils/activity-logger';
import { uploadImage } from '../utils/imagekit';
import type { CreateKegiatanPrioritasType, UpdateKegiatanPrioritasType, KegiatanPrioritasQueryType } from '../types/kegiatan-prioritas';

const kegiatanPrioritasRepo = new KegiatanPrioritasRepository();

export const kegiatanPrioritasHandler = {
  async getAll({ query }: Context<{ query: KegiatanPrioritasQueryType }>) {
    try {
      const result = await kegiatanPrioritasRepo.findAll(query);
      return successResponseWithPagination(
        'Data kegiatan prioritas berhasil diambil',
        result.data,
        result.pagination
      );
    } catch (error) {
      console.error('Error getting kegiatan prioritas:', error);
      throw new Error('Gagal mengambil data kegiatan prioritas');
    }
  },

  async getById({ params }: Context<{ params: { id: number } }>) {
    try {
      const kegiatan = await kegiatanPrioritasRepo.findById(params.id);
      if (!kegiatan) {
        return {
          message: 'Data kegiatan prioritas tidak ditemukan',
        };
      }

      return successResponse('Data kegiatan prioritas berhasil diambil', kegiatan);
    } catch (error) {
      console.error('Error getting kegiatan prioritas by id:', error);
      throw new Error('Gagal mengambil data kegiatan prioritas');
    }
  },

  async getKegiatanByMonth({ query }: Context<{ query: { pegawai_id: number; year: number; month: number } }>) {
    try {
      const result = await kegiatanPrioritasRepo.getKegiatanByMonth(query.pegawai_id, query.year, query.month);
      return successResponse('Data kegiatan prioritas per bulan berhasil diambil', result);
    } catch (error) {
      console.error('Error getting kegiatan prioritas by month:', error);
      throw new Error('Gagal mengambil data kegiatan prioritas per bulan');
    }
  },

  async create({ body, headers, request, path }: Context<{ body: CreateKegiatanPrioritasType }>) {
    try {
      if (!body.pegawai_id || !body.tanggal) {
        return {
          message: 'Pegawai dan tanggal wajib diisi',
        };
      }

      // Validate rencana_kerja max 1000 chars
      if (body.rencana_kerja && body.rencana_kerja.length > 1000) {
        return {
          message: 'Rencana kerja maksimal 1000 karakter',
        };
      }

      // Handle photo uploads
      let photoUrls: string[] = [];
      if (body.foto_kegiatan && Array.isArray(body.foto_kegiatan)) {
        // Validate max 5 photos
        if (body.foto_kegiatan.length > 5) {
          return {
            message: 'Maksimal 5 foto kegiatan',
          };
        }

        // Upload each photo to ImageKit
        for (let i = 0; i < body.foto_kegiatan.length; i++) {
          const photoFile = body.foto_kegiatan[i];
          
          // Check if it's a File object
          if (photoFile && typeof photoFile === 'object' && 'arrayBuffer' in photoFile) {
            const photoBuffer = Buffer.from(await photoFile.arrayBuffer());
            const fileName = `kegiatan_harian_${body.pegawai_id}_${body.tanggal}_${Date.now()}_${i + 1}.jpg`;
            const folder = `/kegiatan-prioritas/${body.pegawai_id}/${body.tanggal}`;

            const uploadResult = await uploadImage(photoBuffer, fileName, folder);
            photoUrls.push(uploadResult.url);
          }
        }
      }

      // Create kegiatan with uploaded photo URLs
      const kegiatanData = {
        ...body,
        foto_kegiatan: photoUrls.length > 0 ? photoUrls : undefined,
      };

      const kegiatan = await kegiatanPrioritasRepo.create(kegiatanData);

      await logActivitySimple({
        context: { headers, request, path },
        aktivitas: 'CREATE',
        modul: 'KEGIATAN_PRIORITAS',
        deskripsi: `Membuat kegiatan prioritas pada ${body.tanggal}`,
        data_baru: kegiatan,
      });

      return successResponse('Kegiatan harian berhasil ditambahkan', kegiatan);
    } catch (error) {
      console.error('Error creating kegiatan prioritas:', error);

      await logActivitySimple({
        context: { headers, request, path },
        aktivitas: 'CREATE',
        modul: 'KEGIATAN_PRIORITAS',
        deskripsi: `Gagal membuat kegiatan prioritas: ${error instanceof Error ? error.message : 'Unknown error'}`,
        status: 'ERROR',
        error_message: error instanceof Error ? error.message : 'Unknown error',
      });

      throw new Error('Gagal menambahkan kegiatan prioritas');
    }
  },

  async update({ params, body, headers, request, path }: Context<{ params: { id: number }; body: UpdateKegiatanPrioritasType }>) {
    try {
      const existing = await kegiatanPrioritasRepo.findById(params.id);
      if (!existing) {
        return {
          message: 'Data kegiatan prioritas tidak ditemukan',
        };
      }

      // Validate rencana_kerja max 1000 chars
      if (body.rencana_kerja && body.rencana_kerja.length > 1000) {
        return {
          message: 'Rencana kerja maksimal 1000 karakter',
        };
      }

      // Handle photo uploads if provided
      let photoUrls: string[] | undefined = undefined;
      if (body.foto_kegiatan && Array.isArray(body.foto_kegiatan)) {
        // Validate max 5 photos
        if (body.foto_kegiatan.length > 5) {
          return {
            message: 'Maksimal 5 foto kegiatan',
          };
        }

        photoUrls = [];
        // Upload each photo to ImageKit
        for (let i = 0; i < body.foto_kegiatan.length; i++) {
          const photoFile = body.foto_kegiatan[i];
          
          // Check if it's a File object (new upload) or string (existing URL)
          if (typeof photoFile === 'string') {
            // Keep existing URL
            photoUrls.push(photoFile);
          } else if (photoFile && typeof photoFile === 'object' && 'arrayBuffer' in photoFile) {
            // Upload new photo
            const photoBuffer = Buffer.from(await photoFile.arrayBuffer());
            const fileName = `kegiatan_harian_${existing.pegawai_id}_${existing.tanggal}_${Date.now()}_${i + 1}.jpg`;
            const folder = `/kegiatan-prioritas/${existing.pegawai_id}/${existing.tanggal}`;

            const uploadResult = await uploadImage(photoBuffer, fileName, folder);
            photoUrls.push(uploadResult.url);
          }
        }
      }

      // Update kegiatan with uploaded photo URLs
      const updateData = {
        ...body,
        foto_kegiatan: photoUrls !== undefined ? photoUrls : body.foto_kegiatan,
      };

      const kegiatan = await kegiatanPrioritasRepo.update(params.id, updateData);

      await logActivitySimple({
        context: { headers, request, path },
        aktivitas: 'UPDATE',
        modul: 'KEGIATAN_PRIORITAS',
        deskripsi: `Mengupdate kegiatan prioritas pada ${existing.tanggal}`,
        data_lama: existing,
        data_baru: kegiatan,
      });

      return successResponse('Kegiatan harian berhasil diupdate', kegiatan);
    } catch (error) {
      console.error('Error updating kegiatan prioritas:', error);

      await logActivitySimple({
        context: { headers, request, path },
        aktivitas: 'UPDATE',
        modul: 'KEGIATAN_PRIORITAS',
        deskripsi: `Gagal mengupdate kegiatan prioritas: ${error instanceof Error ? error.message : 'Unknown error'}`,
        status: 'ERROR',
        error_message: error instanceof Error ? error.message : 'Unknown error',
      });

      throw new Error('Gagal mengupdate kegiatan prioritas');
    }
  },

  async delete({ params, headers, request, path }: Context<{ params: { id: number } }>) {
    try {
      const existing = await kegiatanPrioritasRepo.findById(params.id);
      if (!existing) {
        return {
          message: 'Data kegiatan prioritas tidak ditemukan',
        };
      }

      await kegiatanPrioritasRepo.delete(params.id);

      await logActivitySimple({
        context: { headers, request, path },
        aktivitas: 'DELETE',
        modul: 'KEGIATAN_PRIORITAS',
        deskripsi: `Menghapus kegiatan prioritas pada ${existing.tanggal}`,
        data_lama: existing,
      });

      return successResponse('Kegiatan harian berhasil dihapus');
    } catch (error) {
      console.error('Error deleting kegiatan prioritas:', error);

      await logActivitySimple({
        context: { headers, request, path },
        aktivitas: 'DELETE',
        modul: 'KEGIATAN_PRIORITAS',
        deskripsi: `Gagal menghapus kegiatan prioritas: ${error instanceof Error ? error.message : 'Unknown error'}`,
        status: 'ERROR',
        error_message: error instanceof Error ? error.message : 'Unknown error',
      });

      throw new Error('Gagal menghapus kegiatan prioritas');
    }
  },
};
