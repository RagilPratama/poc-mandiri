import { Elysia, t } from 'elysia';
import { jenisUsahaHandler } from '../handlers/jenis-usaha.handler';

export const jenisUsahaRoute = new Elysia({ prefix: '/jenis-usaha' })
  .get('/', async (context) => {
    return await jenisUsahaHandler.getAll(context);
  }, {
    query: t.Object({
      page: t.Optional(t.Numeric({ minimum: 1 })),
      limit: t.Optional(t.Numeric({ minimum: 1, maximum: 100 })),
      search: t.Optional(t.String()),
      kategori: t.Optional(t.String()),
    }),
    detail: {
      tags: ['Jenis Usaha'],
      summary: 'Get all jenis usaha',
      description: 'Get all jenis usaha with pagination and filters',
    },
  })
  .get('/:id', async (context) => {
    return await jenisUsahaHandler.getById(context);
  }, {
    params: t.Object({
      id: t.String()
    }),
    detail: {
      tags: ['Jenis Usaha'],
      summary: 'Get jenis usaha by ID',
      description: 'Get jenis usaha detail by ID',
    },
  })
  .post('/', async (context) => {
    return await jenisUsahaHandler.create(context);
  }, {
    body: t.Object({
      kode_jenis_usaha: t.String(),
      nama_jenis_usaha: t.String(),
      kategori: t.String(),
      keterangan: t.Optional(t.String()),
    }),
    detail: {
      tags: ['Jenis Usaha'],
      summary: 'Create new jenis usaha',
      description: 'Create a new jenis usaha record',
    },
  })
  .put('/:id', async (context) => {
    return await jenisUsahaHandler.update(context);
  }, {
    params: t.Object({
      id: t.String()
    }),
    body: t.Object({
      kode_jenis_usaha: t.Optional(t.String()),
      nama_jenis_usaha: t.Optional(t.String()),
      kategori: t.Optional(t.String()),
      keterangan: t.Optional(t.String()),
    }),
    detail: {
      tags: ['Jenis Usaha'],
      summary: 'Update jenis usaha',
      description: 'Update jenis usaha by ID',
    },
  })
  .delete('/:id', async (context) => {
    return await jenisUsahaHandler.delete(context);
  }, {
    params: t.Object({
      id: t.String()
    }),
    detail: {
      tags: ['Jenis Usaha'],
      summary: 'Delete jenis usaha',
      description: 'Delete jenis usaha by ID',
    },
  });
