import { Elysia, t } from 'elysia';
import { jenisBantuanHandler } from '../handlers/jenis-bantuan.handler';

export const jenisBantuanRoute = new Elysia({ prefix: '/jenis-bantuan' })
  .get('/', jenisBantuanHandler.getAll, {
    query: t.Object({
      page: t.Optional(t.Numeric({ minimum: 1 })),
      limit: t.Optional(t.Numeric({ minimum: 1, maximum: 100 })),
      search: t.Optional(t.String()),
      kategori: t.Optional(t.String()),
    }),
    detail: {
      tags: ['Jenis Bantuan'],
      summary: 'Get all jenis bantuan',
      description: 'Get all jenis bantuan with pagination and filters',
    },
  })
  .get('/:id', jenisBantuanHandler.getById, {
    params: t.Object({
      id: t.Numeric()
    }),
    detail: {
      tags: ['Jenis Bantuan'],
      summary: 'Get jenis bantuan by ID',
      description: 'Get jenis bantuan detail by ID',
    },
  })
  .post('/', jenisBantuanHandler.create, {
    body: t.Object({
      nama_bantuan: t.String(),
      kategori: t.String(),
      deskripsi: t.Optional(t.String()),
    }),
    detail: {
      tags: ['Jenis Bantuan'],
      summary: 'Create new jenis bantuan',
      description: 'Create a new jenis bantuan record',
    },
  })
  .put('/:id', jenisBantuanHandler.update, {
    params: t.Object({
      id: t.Numeric()
    }),
    body: t.Object({
      nama_bantuan: t.Optional(t.String()),
      kategori: t.Optional(t.String()),
      deskripsi: t.Optional(t.String()),
    }),
    detail: {
      tags: ['Jenis Bantuan'],
      summary: 'Update jenis bantuan',
      description: 'Update jenis bantuan by ID',
    },
  })
  .delete('/:id', jenisBantuanHandler.delete, {
    params: t.Object({
      id: t.Numeric()
    }),
    detail: {
      tags: ['Jenis Bantuan'],
      summary: 'Delete jenis bantuan',
      description: 'Delete jenis bantuan by ID',
    },
  });
