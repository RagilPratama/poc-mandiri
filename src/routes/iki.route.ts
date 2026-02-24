import { Elysia, t } from 'elysia';
import { ikiHandler } from '../handlers/iki.handler';

export const ikiRoute = new Elysia({ prefix: '/iki' })
  .get('/', ikiHandler.getAll, {
    query: t.Object({
      page: t.Optional(t.Numeric({ minimum: 1 })),
      limit: t.Optional(t.Numeric({ minimum: 1, maximum: 100 })),
      search: t.Optional(t.String()),
      iku_id: t.Optional(t.Numeric()),
      is_active: t.Optional(t.BooleanString()),
    }),
    detail: {
      tags: ['IKI'],
      summary: 'Get all IKI',
      description: 'Get all Indikator Kinerja Individu with pagination and filters',
    },
  })
  .get('/:id', ikiHandler.getById, {
    params: t.Object({
      id: t.Numeric(),
    }),
    detail: {
      tags: ['IKI'],
      summary: 'Get IKI by ID',
      description: 'Get detail Indikator Kinerja Individu by ID',
    },
  })
  .post('/', ikiHandler.create, {
    body: t.Object({
      iku_id: t.Numeric(),
      kode_iki: t.String({ maxLength: 50 }),
      nama_iki: t.String({ maxLength: 255 }),
      deskripsi: t.Optional(t.String()),
      target: t.Optional(t.Numeric()),
      satuan: t.Optional(t.String({ maxLength: 50 })),
      is_active: t.Optional(t.Boolean()),
    }),
    detail: {
      tags: ['IKI'],
      summary: 'Create new IKI',
      description: 'Create a new Indikator Kinerja Individu record',
    },
  })
  .put('/:id', ikiHandler.update, {
    params: t.Object({
      id: t.Numeric(),
    }),
    body: t.Object({
      iku_id: t.Optional(t.Numeric()),
      kode_iki: t.Optional(t.String({ maxLength: 50 })),
      nama_iki: t.Optional(t.String({ maxLength: 255 })),
      deskripsi: t.Optional(t.String()),
      target: t.Optional(t.Numeric()),
      satuan: t.Optional(t.String({ maxLength: 50 })),
      is_active: t.Optional(t.Boolean()),
    }),
    detail: {
      tags: ['IKI'],
      summary: 'Update IKI',
      description: 'Update Indikator Kinerja Individu by ID',
    },
  })
  .delete('/:id', ikiHandler.delete, {
    params: t.Object({
      id: t.Numeric(),
    }),
    detail: {
      tags: ['IKI'],
      summary: 'Delete IKI',
      description: 'Delete Indikator Kinerja Individu by ID',
    },
  });
