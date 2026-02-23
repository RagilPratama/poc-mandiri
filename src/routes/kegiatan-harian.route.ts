import { Elysia, t } from 'elysia';
import { kegiatanHarianHandler } from '../handlers/kegiatan-harian.handler';

export const kegiatanHarianRoute = new Elysia({ prefix: '/kegiatan-harian' })
  .get('/', kegiatanHarianHandler.getAll, {
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
      tags: ['Kegiatan Harian'],
      summary: 'Get all kegiatan harian',
      description: 'Get all kegiatan harian with pagination and filters',
    },
  })
  .get('/by-month', kegiatanHarianHandler.getKegiatanByMonth, {
    query: t.Object({
      pegawai_id: t.Numeric(),
      year: t.Numeric(),
      month: t.Numeric({ minimum: 1, maximum: 12 }),
    }),
    detail: {
      tags: ['Kegiatan Harian'],
      summary: 'Get kegiatan harian by month',
      description: 'Get kegiatan harian count per day for calendar view',
    },
  })
  .get('/:id', kegiatanHarianHandler.getById, {
    params: t.Object({
      id: t.Numeric()
    }),
    detail: {
      tags: ['Kegiatan Harian'],
      summary: 'Get kegiatan harian by ID',
      description: 'Get kegiatan harian detail by ID',
    },
  })
  .post('/', kegiatanHarianHandler.create, {
    body: t.Object({
      pegawai_id: t.Numeric(),
      kelompok_nelayan_id: t.Optional(t.Numeric()),
      tanggal: t.String(), // YYYY-MM-DD
      lokasi_kegiatan: t.Optional(t.String()),
      iki: t.Optional(t.String()),
      rencana_kerja: t.Optional(t.String({ maxLength: 1000 })),
      detail_keterangan: t.Optional(t.String()),
      foto_kegiatan: t.Optional(t.Files({ maxItems: 5 })),
    }),
    detail: {
      tags: ['Kegiatan Harian'],
      summary: 'Create new kegiatan harian',
      description: 'Create a new kegiatan harian record with photo upload support (max 5 photos)',
    },
  })
  .put('/:id', kegiatanHarianHandler.update, {
    params: t.Object({
      id: t.Numeric()
    }),
    body: t.Object({
      pegawai_id: t.Optional(t.Numeric()),
      kelompok_nelayan_id: t.Optional(t.Numeric()),
      tanggal: t.Optional(t.String()),
      lokasi_kegiatan: t.Optional(t.String()),
      iki: t.Optional(t.String()),
      rencana_kerja: t.Optional(t.String({ maxLength: 1000 })),
      detail_keterangan: t.Optional(t.String()),
      foto_kegiatan: t.Optional(t.Files({ maxItems: 5 })),
      is_active: t.Optional(t.Boolean()),
    }),
    detail: {
      tags: ['Kegiatan Harian'],
      summary: 'Update kegiatan harian',
      description: 'Update kegiatan harian by ID with photo upload support',
    },
  })
  .delete('/:id', kegiatanHarianHandler.delete, {
    params: t.Object({
      id: t.Numeric()
    }),
    detail: {
      tags: ['Kegiatan Harian'],
      summary: 'Delete kegiatan harian',
      description: 'Soft delete kegiatan harian by ID',
    },
  });
