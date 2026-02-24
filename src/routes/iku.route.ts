import { Elysia, t } from 'elysia';
import { ikuHandler } from '../handlers/iku.handler';

export const ikuRoute = new Elysia({ prefix: '/iku' })
  .get('/', ikuHandler.getAll, {
    query: t.Object({
      page: t.Optional(t.Numeric({ minimum: 1 })),
      limit: t.Optional(t.Numeric({ minimum: 1, maximum: 100 })),
      search: t.Optional(t.String()),
      tahun: t.Optional(t.Numeric()),
      is_active: t.Optional(t.BooleanString()),
    }),
    detail: {
      tags: ['IKU'],
      summary: 'Get all IKU',
      description: 'Get all Indikator Kinerja Utama with pagination and filters',
    },
  })
  .get('/:id', ikuHandler.getById, {
    params: t.Object({
      id: t.Numeric(),
    }),
    detail: {
      tags: ['IKU'],
      summary: 'Get IKU by ID',
      description: 'Get detail Indikator Kinerja Utama by ID',
    },
  })
  .post('/', ikuHandler.create, {
    body: t.Object({
      kode_iku: t.String({ maxLength: 50 }),
      nama_iku: t.String({ maxLength: 255 }),
      deskripsi: t.Optional(t.String()),
      tahun: t.Numeric(),
      target: t.Optional(t.Numeric()),
      satuan: t.Optional(t.String({ maxLength: 50 })),
      is_active: t.Optional(t.Boolean()),
    }),
    detail: {
      tags: ['IKU'],
      summary: 'Create new IKU',
      description: 'Create a new Indikator Kinerja Utama record',
    },
  })
  .put('/:id', ikuHandler.update, {
    params: t.Object({
      id: t.Numeric(),
    }),
    body: t.Object({
      kode_iku: t.Optional(t.String({ maxLength: 50 })),
      nama_iku: t.Optional(t.String({ maxLength: 255 })),
      deskripsi: t.Optional(t.String()),
      tahun: t.Optional(t.Numeric()),
      target: t.Optional(t.Numeric()),
      satuan: t.Optional(t.String({ maxLength: 50 })),
      is_active: t.Optional(t.Boolean()),
    }),
    detail: {
      tags: ['IKU'],
      summary: 'Update IKU',
      description: 'Update Indikator Kinerja Utama by ID',
    },
  })
  .delete('/:id', ikuHandler.delete, {
    params: t.Object({
      id: t.Numeric(),
    }),
    detail: {
      tags: ['IKU'],
      summary: 'Delete IKU',
      description: 'Delete Indikator Kinerja Utama by ID',
    },
  });
