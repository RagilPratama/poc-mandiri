import { Elysia, t } from 'elysia';
import { sertifikasiHandler } from '../handlers/sertifikasi.handler';

export const sertifikasiRoute = new Elysia({ prefix: '/sertifikasi' })
  .get('/', async (context) => {
    return await sertifikasiHandler.getAll(context);
  }, {
    query: t.Object({
      page: t.Optional(t.Numeric({ minimum: 1 })),
      limit: t.Optional(t.Numeric({ minimum: 1, maximum: 100 })),
      search: t.Optional(t.String()),
      kelompok_nelayan_id: t.Optional(t.String()),
      status_sertifikat: t.Optional(t.String()),
    }),
    detail: {
      tags: ['Sertifikasi'],
      summary: 'Get all sertifikasi',
      description: 'Get all sertifikasi with pagination and status filtering',
    },
  })
  .get('/:id', async (context) => {
    return await sertifikasiHandler.getById(context);
  }, {
    params: t.Object({
      id: t.String()
    }),
    detail: {
      tags: ['Sertifikasi'],
      summary: 'Get sertifikasi by ID',
      description: 'Get sertifikasi detail by ID with relations',
    },
  })
  .post('/', async (context) => {
    return await sertifikasiHandler.create(context);
  }, {
    body: t.Object({
      jenis_sertifikasi_id: t.Numeric(),
      kelompok_nelayan_id: t.String(),
      penyuluh_id: t.Optional(t.String()),
      nomor_sertifikat: t.String(),
      tanggal_terbit: t.String(),
      tanggal_kadaluarsa: t.String(),
      status_sertifikat: t.String(),
      keterangan: t.Optional(t.String()),
    }),
    detail: {
      tags: ['Sertifikasi'],
      summary: 'Create new sertifikasi',
      description: 'Create a new sertifikasi record',
    },
  })
  .put('/:id', async (context) => {
    return await sertifikasiHandler.update(context);
  }, {
    params: t.Object({
      id: t.String()
    }),
    body: t.Object({
      jenis_sertifikasi_id: t.Optional(t.Numeric()),
      kelompok_nelayan_id: t.Optional(t.String()),
      penyuluh_id: t.Optional(t.String()),
      nomor_sertifikat: t.Optional(t.String()),
      tanggal_terbit: t.Optional(t.String()),
      tanggal_kadaluarsa: t.Optional(t.String()),
      status_sertifikat: t.Optional(t.String()),
      keterangan: t.Optional(t.String()),
    }),
    detail: {
      tags: ['Sertifikasi'],
      summary: 'Update sertifikasi',
      description: 'Update sertifikasi by ID',
    },
  })
  .delete('/:id', async (context) => {
    return await sertifikasiHandler.delete(context);
  }, {
    params: t.Object({
      id: t.String()
    }),
    detail: {
      tags: ['Sertifikasi'],
      summary: 'Delete sertifikasi',
      description: 'Delete sertifikasi by ID',
    },
  });
