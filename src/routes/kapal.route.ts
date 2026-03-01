import { Elysia, t } from 'elysia';
import { kapalHandler } from '../handlers/kapal.handler';

export const kapalRoute = new Elysia({ prefix: '/kapal' })
  .get('/', async (context) => {
    return await kapalHandler.getAll(context);
  }, {
    query: t.Object({
      page: t.Optional(t.Numeric({ minimum: 1 })),
      limit: t.Optional(t.Numeric({ minimum: 1, maximum: 100 })),
      search: t.Optional(t.String()),
      status_kapal: t.Optional(t.String()),
      kelompok_nelayan_id: t.Optional(t.Numeric()),
    }),
    detail: {
      tags: ['Kapal'],
      summary: 'Get all kapal',
      description: 'Get all kapal with pagination and filters',
    },
  })
  .get('/:id', async (context) => {
    return await kapalHandler.getById(context);
  }, {
    params: t.Object({
      id: t.String()
    }),
    detail: {
      tags: ['Kapal'],
      summary: 'Get kapal by ID',
      description: 'Get kapal detail by ID with kelompok nelayan relation',
    },
  })
  .post('/', async (context) => {
    return await kapalHandler.create(context);
  }, {
    body: t.Object({
      kelompok_nelayan_id: t.Numeric(),
      no_registrasi_kapal: t.String(),
      nama_kapal: t.String(),
      jenis_kapal: t.String(),
      ukuran_gt: t.Optional(t.Numeric()),
      ukuran_panjang: t.Optional(t.Numeric()),
      ukuran_lebar: t.Optional(t.Numeric()),
      mesin_pk: t.Optional(t.Numeric()),
      tahun_pembuatan: t.Optional(t.Numeric()),
      pelabuhan_pangkalan: t.Optional(t.String()),
      status_kapal: t.Optional(t.String()),
    }),
    detail: {
      tags: ['Kapal'],
      summary: 'Create new kapal',
      description: 'Create a new kapal record',
    },
  })
  .put('/:id', async (context) => {
    return await kapalHandler.update(context);
  }, {
    params: t.Object({
      id: t.String()
    }),
    body: t.Object({
      kelompok_nelayan_id: t.Optional(t.Numeric()),
      no_registrasi_kapal: t.Optional(t.String()),
      nama_kapal: t.Optional(t.String()),
      jenis_kapal: t.Optional(t.String()),
      ukuran_gt: t.Optional(t.Numeric()),
      ukuran_panjang: t.Optional(t.Numeric()),
      ukuran_lebar: t.Optional(t.Numeric()),
      mesin_pk: t.Optional(t.Numeric()),
      tahun_pembuatan: t.Optional(t.Numeric()),
      pelabuhan_pangkalan: t.Optional(t.String()),
      status_kapal: t.Optional(t.String()),
    }),
    detail: {
      tags: ['Kapal'],
      summary: 'Update kapal',
      description: 'Update kapal by ID',
    },
  })
  .delete('/:id', async (context) => {
    return await kapalHandler.delete(context);
  }, {
    params: t.Object({
      id: t.String()
    }),
    detail: {
      tags: ['Kapal'],
      summary: 'Delete kapal',
      description: 'Delete kapal by ID',
    },
  });
