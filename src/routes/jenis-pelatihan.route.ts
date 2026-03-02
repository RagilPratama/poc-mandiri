import { Elysia, t } from 'elysia';
import { jenisPelatihanHandler } from '../handlers/jenis-pelatihan.handler';

export const jenisPelatihanRoute = new Elysia({ prefix: '/jenis-pelatihan' })
  .get('/', async (context) => {
    return await jenisPelatihanHandler.getAll(context);
  }, {
    query: t.Object({
      page: t.Optional(t.Numeric({ minimum: 1 })),
      limit: t.Optional(t.Numeric({ minimum: 1, maximum: 100 })),
      search: t.Optional(t.String()),
      kategori: t.Optional(t.String()),
    }),
    detail: {
      tags: ['Jenis Pelatihan'],
      summary: 'Get all jenis pelatihan',
      description: 'Get all jenis pelatihan with pagination and filters',
    },
  })
  .get('/:id', async (context) => {
    return await jenisPelatihanHandler.getById(context);
  }, {
    params: t.Object({
      id: t.String()
    }),
    detail: {
      tags: ['Jenis Pelatihan'],
      summary: 'Get jenis pelatihan by ID',
      description: 'Get jenis pelatihan detail by ID',
    },
  })
  .post('/', async (context) => {
    return await jenisPelatihanHandler.create(context);
  }, {
    body: t.Object({
      nama_pelatihan: t.String(),
      kategori: t.String(),
      durasi_hari: t.Numeric(),
      deskripsi: t.Optional(t.String()),
    }),
    detail: {
      tags: ['Jenis Pelatihan'],
      summary: 'Create new jenis pelatihan',
      description: 'Create a new jenis pelatihan record',
    },
  })
  .put('/:id', async (context) => {
    return await jenisPelatihanHandler.update(context);
  }, {
    params: t.Object({
      id: t.String()
    }),
    body: t.Object({
      nama_pelatihan: t.Optional(t.String()),
      kategori: t.Optional(t.String()),
      durasi_hari: t.Optional(t.Numeric()),
      deskripsi: t.Optional(t.String()),
    }),
    detail: {
      tags: ['Jenis Pelatihan'],
      summary: 'Update jenis pelatihan',
      description: 'Update jenis pelatihan by ID',
    },
  })
  .delete('/:id', async (context) => {
    return await jenisPelatihanHandler.delete(context);
  }, {
    params: t.Object({
      id: t.String()
    }),
    detail: {
      tags: ['Jenis Pelatihan'],
      summary: 'Delete jenis pelatihan',
      description: 'Delete jenis pelatihan by ID',
    },
  });
