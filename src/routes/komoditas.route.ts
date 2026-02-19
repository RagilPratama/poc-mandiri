import { Elysia, t } from 'elysia';
import { komoditasHandler } from '../handlers/komoditas.handler';

export const komoditasRoute = new Elysia({ prefix: '/komoditas' })
  .get('/', komoditasHandler.getAll, {
    query: t.Object({
      page: t.Optional(t.Numeric({ minimum: 1 })),
      limit: t.Optional(t.Numeric({ minimum: 1, maximum: 100 })),
      search: t.Optional(t.String()),
      kategori: t.Optional(t.String()),
    }),
    detail: {
      tags: ['Komoditas'],
      summary: 'Get all komoditas',
      description: 'Get all komoditas with pagination and filters',
    },
  })
  .get('/:id', komoditasHandler.getById, {
    params: t.Object({
      id: t.Numeric()
    }),
    detail: {
      tags: ['Komoditas'],
      summary: 'Get komoditas by ID',
      description: 'Get komoditas detail by ID',
    },
  })
  .post('/', komoditasHandler.create, {
    body: t.Object({
      nama_komoditas: t.String(),
      kategori: t.String(),
      nama_ilmiah: t.Optional(t.String()),
      deskripsi: t.Optional(t.String()),
    }),
    detail: {
      tags: ['Komoditas'],
      summary: 'Create new komoditas',
      description: 'Create a new komoditas record',
    },
  })
  .put('/:id', komoditasHandler.update, {
    params: t.Object({
      id: t.Numeric()
    }),
    body: t.Object({
      nama_komoditas: t.Optional(t.String()),
      kategori: t.Optional(t.String()),
      nama_ilmiah: t.Optional(t.String()),
      deskripsi: t.Optional(t.String()),
    }),
    detail: {
      tags: ['Komoditas'],
      summary: 'Update komoditas',
      description: 'Update komoditas by ID',
    },
  })
  .delete('/:id', komoditasHandler.delete, {
    params: t.Object({
      id: t.Numeric()
    }),
    detail: {
      tags: ['Komoditas'],
      summary: 'Delete komoditas',
      description: 'Delete komoditas by ID',
    },
  });
