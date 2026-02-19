import { Elysia, t } from 'elysia';
import { alatTangkapHandler } from '../handlers/alat-tangkap.handler';

export const alatTangkapRoute = new Elysia({ prefix: '/alat-tangkap' })
  .get('/', alatTangkapHandler.getAll, {
    query: t.Object({
      page: t.Optional(t.Numeric({ minimum: 1 })),
      limit: t.Optional(t.Numeric({ minimum: 1, maximum: 100 })),
      search: t.Optional(t.String()),
      jenis: t.Optional(t.String()),
    }),
    detail: {
      tags: ['Alat Tangkap'],
      summary: 'Get all alat tangkap',
      description: 'Get all alat tangkap with pagination and filters',
    },
  })
  .get('/:id', alatTangkapHandler.getById, {
    params: t.Object({
      id: t.String()
    }),
    detail: {
      tags: ['Alat Tangkap'],
      summary: 'Get alat tangkap by ID',
      description: 'Get alat tangkap detail by ID',
    },
  })
  .post('/', alatTangkapHandler.create, {
    body: t.Object({
      nama_alat: t.String(),
      jenis: t.String(),
      deskripsi: t.Optional(t.String()),
    }),
    detail: {
      tags: ['Alat Tangkap'],
      summary: 'Create new alat tangkap',
      description: 'Create a new alat tangkap record',
    },
  })
  .put('/:id', alatTangkapHandler.update, {
    params: t.Object({
      id: t.String()
    }),
    body: t.Object({
      nama_alat: t.Optional(t.String()),
      jenis: t.Optional(t.String()),
      deskripsi: t.Optional(t.String()),
    }),
    detail: {
      tags: ['Alat Tangkap'],
      summary: 'Update alat tangkap',
      description: 'Update alat tangkap by ID',
    },
  })
  .delete('/:id', alatTangkapHandler.delete, {
    params: t.Object({
      id: t.String()
    }),
    detail: {
      tags: ['Alat Tangkap'],
      summary: 'Delete alat tangkap',
      description: 'Delete alat tangkap by ID',
    },
  });
