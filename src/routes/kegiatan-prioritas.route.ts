import { Elysia, t } from 'elysia';
import { kegiatanPrioritasHandler } from '../handlers/kegiatan-prioritas.handler';

export const kegiatanPrioritasRoute = new Elysia({ prefix: '/kegiatan-prioritas' })
  .get('/', kegiatanPrioritasHandler.getAll, {
    query: t.Object({
      page: t.Optional(t.Numeric({ minimum: 1 })),
      limit: t.Optional(t.Numeric({ minimum: 1, maximum: 100 })),
      pegawai_id: t.Optional(t.Numeric()),
      kelompok_nelayan_id: t.Optional(t.Numeric()),
      tanggal: t.Optional(t.String()), // YYYY-MM-DD
      bulan: t.Optional(t.String()), // YYYY-MM
      tahun: t.Optional(t.String()), // YYYY
      search: t.Optional(t.String()),
    }),
    detail: {
      tags: ['Kegiatan Prioritas'],
      summary: 'Get all kegiatan prioritas',
      description: 'Get all kegiatan prioritas with pagination and filters',
    },
  })
  .get('/by-month', kegiatanPrioritasHandler.getKegiatanByMonth, {
    query: t.Object({
      pegawai_id: t.Numeric(),
      year: t.Numeric(),
      month: t.Numeric({ minimum: 1, maximum: 12 }),
    }),
    detail: {
      tags: ['Kegiatan Prioritas'],
      summary: 'Get kegiatan prioritas by month',
      description: 'Get kegiatan prioritas count per day for calendar view',
    },
  })
  .get('/:id', kegiatanPrioritasHandler.getById, {
    params: t.Object({
      id: t.Numeric()
    }),
    detail: {
      tags: ['Kegiatan Prioritas'],
      summary: 'Get kegiatan prioritas by ID',
      description: 'Get kegiatan prioritas detail by ID',
    },
  })
  .post('/', kegiatanPrioritasHandler.create, {
    body: t.Object({
      pegawai_id: t.Numeric(),
      kelompok_nelayan_id: t.Optional(t.Numeric()),
      tanggal: t.String(), // YYYY-MM-DD
      lokasi_kegiatan: t.Optional(t.String()),
      iki_id: t.Optional(t.Numeric()),
      rencana_kerja: t.Optional(t.String({ maxLength: 1000 })),
      detail_keterangan: t.Optional(t.String()),
      foto_kegiatan: t.Optional(t.Files({ maxItems: 5 })),
    }),
    detail: {
      tags: ['Kegiatan Prioritas'],
      summary: 'Create new kegiatan prioritas',
      description: 'Create a new kegiatan prioritas record with photo upload support (max 5 photos)',
    },
  })
  .put('/:id', kegiatanPrioritasHandler.update, {
    params: t.Object({
      id: t.Numeric()
    }),
    body: t.Object({
      pegawai_id: t.Optional(t.Numeric()),
      kelompok_nelayan_id: t.Optional(t.Numeric()),
      tanggal: t.Optional(t.String()),
      lokasi_kegiatan: t.Optional(t.String()),
      iki_id: t.Optional(t.Numeric()),
      rencana_kerja: t.Optional(t.String({ maxLength: 1000 })),
      detail_keterangan: t.Optional(t.String()),
      foto_kegiatan: t.Optional(t.Files({ maxItems: 5 })),
      is_active: t.Optional(t.Boolean()),
    }),
    detail: {
      tags: ['Kegiatan Prioritas'],
      summary: 'Update kegiatan prioritas',
      description: 'Update kegiatan prioritas by ID with photo upload support',
    },
  })
  .delete('/:id', kegiatanPrioritasHandler.delete, {
    params: t.Object({
      id: t.Numeric()
    }),
    detail: {
      tags: ['Kegiatan Prioritas'],
      summary: 'Delete kegiatan prioritas',
      description: 'Soft delete kegiatan prioritas by ID',
    },
  });
