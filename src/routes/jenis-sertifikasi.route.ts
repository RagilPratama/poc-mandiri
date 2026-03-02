import { Elysia, t } from 'elysia';
import { jenisSertifikasiHandler } from '../handlers/jenis-sertifikasi.handler';

export const jenisSertifikasiRoute = new Elysia({ prefix: '/jenis-sertifikasi' })
  .get('/', async (context) => {
    return await jenisSertifikasiHandler.getAll(context);
  }, {
    query: t.Object({
      page: t.Optional(t.Numeric({ minimum: 1 })),
      limit: t.Optional(t.Numeric({ minimum: 1, maximum: 100 })),
      search: t.Optional(t.String()),
      kategori: t.Optional(t.String()),
    }),
    detail: {
      tags: ['Jenis Sertifikasi'],
      summary: 'Get all jenis sertifikasi',
      description: 'Get all jenis sertifikasi with pagination and filters',
    },
  })
  .get('/:id', async (context) => {
    return await jenisSertifikasiHandler.getById(context);
  }, {
    params: t.Object({
      id: t.String()
    }),
    detail: {
      tags: ['Jenis Sertifikasi'],
      summary: 'Get jenis sertifikasi by ID',
      description: 'Get jenis sertifikasi detail by ID',
    },
  })
  .post('/', async (context) => {
    return await jenisSertifikasiHandler.create(context);
  }, {
    body: t.Object({
      nama_sertifikasi: t.String(),
      kategori: t.String(),
      masa_berlaku_tahun: t.Numeric(),
      deskripsi: t.Optional(t.String()),
    }),
    detail: {
      tags: ['Jenis Sertifikasi'],
      summary: 'Create new jenis sertifikasi',
      description: 'Create a new jenis sertifikasi record',
    },
  })
  .put('/:id', async (context) => {
    return await jenisSertifikasiHandler.update(context);
  }, {
    params: t.Object({
      id: t.String()
    }),
    body: t.Object({
      nama_sertifikasi: t.Optional(t.String()),
      kategori: t.Optional(t.String()),
      masa_berlaku_tahun: t.Optional(t.Numeric()),
      deskripsi: t.Optional(t.String()),
    }),
    detail: {
      tags: ['Jenis Sertifikasi'],
      summary: 'Update jenis sertifikasi',
      description: 'Update jenis sertifikasi by ID',
    },
  })
  .delete('/:id', async (context) => {
    return await jenisSertifikasiHandler.delete(context);
  }, {
    params: t.Object({
      id: t.String()
    }),
    detail: {
      tags: ['Jenis Sertifikasi'],
      summary: 'Delete jenis sertifikasi',
      description: 'Delete jenis sertifikasi by ID',
    },
  });
