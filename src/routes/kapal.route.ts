import { Elysia, t } from 'elysia';
import { kapalHandler } from '../handlers/kapal.handler';

export const kapalRoute = new Elysia({ prefix: '/kapal' })
  .get('/', kapalHandler.getAll, {
    query: t.Object({
      page: t.Optional(t.Numeric({ minimum: 1 })),
      limit: t.Optional(t.Numeric({ minimum: 1, maximum: 100 })),
      search: t.Optional(t.String()),
      status_kapal: t.Optional(t.String()),
      kelompok_nelayan_id: t.Optional(t.String()),
    }),
    detail: {
      tags: ['Kapal'],
      summary: 'Get all kapal',
      description: 'Get all kapal with pagination and filters',
    },
  })
  .get('/:id', kapalHandler.getById, {
    params: t.Object({
      id: t.Numeric()
    }),
    detail: {
      tags: ['Kapal'],
      summary: 'Get kapal by ID',
      description: 'Get kapal detail by ID with kelompok nelayan relation',
    },
  })
  .post('/', kapalHandler.create, {
    body: t.Object({
      kelompok_nelayan_id: t.String(),
      nama_kapal: t.String(),
      jenis_kapal: t.String(),
      ukuran_kapal: t.Numeric(),
      tahun_pembuatan: t.Optional(t.Numeric()),
      nomor_registrasi: t.Optional(t.String()),
      status_kapal: t.String(),
    }),
    detail: {
      tags: ['Kapal'],
      summary: 'Create new kapal',
      description: 'Create a new kapal record',
    },
  })
  .put('/:id', kapalHandler.update, {
    params: t.Object({
      id: t.Numeric()
    }),
    body: t.Object({
      kelompok_nelayan_id: t.Optional(t.String()),
      nama_kapal: t.Optional(t.String()),
      jenis_kapal: t.Optional(t.String()),
      ukuran_kapal: t.Optional(t.Numeric()),
      tahun_pembuatan: t.Optional(t.Numeric()),
      nomor_registrasi: t.Optional(t.String()),
      status_kapal: t.Optional(t.String()),
    }),
    detail: {
      tags: ['Kapal'],
      summary: 'Update kapal',
      description: 'Update kapal by ID',
    },
  })
  .delete('/:id', kapalHandler.delete, {
    params: t.Object({
      id: t.Numeric()
    }),
    detail: {
      tags: ['Kapal'],
      summary: 'Delete kapal',
      description: 'Delete kapal by ID',
    },
  });
