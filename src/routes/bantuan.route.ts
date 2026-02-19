import { Elysia, t } from 'elysia';
import { bantuanHandler } from '../handlers/bantuan.handler';

export const bantuanRoute = new Elysia({ prefix: '/bantuan' })
  .get('/', bantuanHandler.getAll, {
    query: t.Object({
      page: t.Optional(t.Numeric({ minimum: 1 })),
      limit: t.Optional(t.Numeric({ minimum: 1, maximum: 100 })),
      search: t.Optional(t.String()),
      kelompok_nelayan_id: t.Optional(t.String()),
      status_penyaluran: t.Optional(t.String()),
      tahun_anggaran: t.Optional(t.Numeric()),
    }),
    detail: {
      tags: ['Bantuan'],
      summary: 'Get all bantuan',
      description: 'Get all bantuan with pagination and status filtering',
    },
  })
  .get('/:id', bantuanHandler.getById, {
    params: t.Object({
      id: t.String()
    }),
    detail: {
      tags: ['Bantuan'],
      summary: 'Get bantuan by ID',
      description: 'Get bantuan detail by ID with relations',
    },
  })
  .post('/', bantuanHandler.create, {
    body: t.Object({
      jenis_bantuan_id: t.Numeric(),
      kelompok_nelayan_id: t.String(),
      penyuluh_id: t.Optional(t.String()),
      tanggal_pengajuan: t.String(),
      tanggal_penyaluran: t.Optional(t.String()),
      jumlah_bantuan_rp: t.Numeric(),
      status_penyaluran: t.String(),
      tahun_anggaran: t.Numeric(),
      keterangan: t.Optional(t.String()),
    }),
    detail: {
      tags: ['Bantuan'],
      summary: 'Create new bantuan',
      description: 'Create a new bantuan record',
    },
  })
  .put('/:id', bantuanHandler.update, {
    params: t.Object({
      id: t.String()
    }),
    body: t.Object({
      jenis_bantuan_id: t.Optional(t.Numeric()),
      kelompok_nelayan_id: t.Optional(t.String()),
      penyuluh_id: t.Optional(t.String()),
      tanggal_pengajuan: t.Optional(t.String()),
      tanggal_penyaluran: t.Optional(t.String()),
      jumlah_bantuan_rp: t.Optional(t.Numeric()),
      status_penyaluran: t.Optional(t.String()),
      tahun_anggaran: t.Optional(t.Numeric()),
      keterangan: t.Optional(t.String()),
    }),
    detail: {
      tags: ['Bantuan'],
      summary: 'Update bantuan',
      description: 'Update bantuan by ID',
    },
  })
  .delete('/:id', bantuanHandler.delete, {
    params: t.Object({
      id: t.String()
    }),
    detail: {
      tags: ['Bantuan'],
      summary: 'Delete bantuan',
      description: 'Delete bantuan by ID',
    },
  });
