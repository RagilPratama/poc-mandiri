import { Elysia, t } from 'elysia';
import { pelatihanHandler } from '../handlers/pelatihan.handler';

export const pelatihanRoute = new Elysia({ prefix: '/pelatihan' })
  .get('/', async (context) => {
    return await pelatihanHandler.getAll(context);
  }, {
    query: t.Object({
      page: t.Optional(t.Numeric({ minimum: 1 })),
      limit: t.Optional(t.Numeric({ minimum: 1, maximum: 100 })),
      search: t.Optional(t.String()),
      status_pelatihan: t.Optional(t.String()),
      tanggal_mulai: t.Optional(t.String()),
      tanggal_akhir: t.Optional(t.String()),
    }),
    detail: {
      tags: ['Pelatihan'],
      summary: 'Get all pelatihan',
      description: 'Get all pelatihan with pagination and date/status filtering',
    },
  })
  .get('/:id', async (context) => {
    return await pelatihanHandler.getById(context);
  }, {
    params: t.Object({
      id: t.String()
    }),
    detail: {
      tags: ['Pelatihan'],
      summary: 'Get pelatihan by ID',
      description: 'Get pelatihan detail by ID with relations',
    },
  })
  .post('/', async (context) => {
    return await pelatihanHandler.create(context);
  }, {
    body: t.Object({
      jenis_pelatihan_id: t.Numeric(),
      penyuluh_id: t.Optional(t.String()),
      nama_pelatihan: t.String(),
      tanggal_mulai: t.String(),
      tanggal_selesai: t.String(),
      lokasi: t.String(),
      jumlah_peserta: t.Numeric(),
      status_pelatihan: t.String(),
      keterangan: t.Optional(t.String()),
    }),
    detail: {
      tags: ['Pelatihan'],
      summary: 'Create new pelatihan',
      description: 'Create a new pelatihan record',
    },
  })
  .put('/:id', async (context) => {
    return await pelatihanHandler.update(context);
  }, {
    params: t.Object({
      id: t.String()
    }),
    body: t.Object({
      jenis_pelatihan_id: t.Optional(t.Numeric()),
      penyuluh_id: t.Optional(t.String()),
      nama_pelatihan: t.Optional(t.String()),
      tanggal_mulai: t.Optional(t.String()),
      tanggal_selesai: t.Optional(t.String()),
      lokasi: t.Optional(t.String()),
      jumlah_peserta: t.Optional(t.Numeric()),
      status_pelatihan: t.Optional(t.String()),
      keterangan: t.Optional(t.String()),
    }),
    detail: {
      tags: ['Pelatihan'],
      summary: 'Update pelatihan',
      description: 'Update pelatihan by ID',
    },
  })
  .delete('/:id', async (context) => {
    return await pelatihanHandler.delete(context);
  }, {
    params: t.Object({
      id: t.String()
    }),
    detail: {
      tags: ['Pelatihan'],
      summary: 'Delete pelatihan',
      description: 'Delete pelatihan by ID',
    },
  });
