import { Elysia, t } from 'elysia';
import { produksiHasilTangkapanHandler } from '../handlers/produksi-hasil-tangkapan.handler';

export const produksiHasilTangkapanRoute = new Elysia({ prefix: '/produksi-hasil-tangkapan' })
  .get('/', produksiHasilTangkapanHandler.getAll, {
    query: t.Object({
      page: t.Optional(t.Numeric({ minimum: 1 })),
      limit: t.Optional(t.Numeric({ minimum: 1, maximum: 100 })),
      search: t.Optional(t.String()),
      kelompok_nelayan_id: t.Optional(t.String()),
      komoditas_id: t.Optional(t.Numeric()),
      tanggal_mulai: t.Optional(t.String()),
      tanggal_akhir: t.Optional(t.String()),
    }),
    detail: {
      tags: ['Produksi Hasil Tangkapan'],
      summary: 'Get all produksi hasil tangkapan',
      description: 'Get all produksi hasil tangkapan with pagination and date filtering',
    },
  })
  .get('/:id', produksiHasilTangkapanHandler.getById, {
    params: t.Object({
      id: t.String()
    }),
    detail: {
      tags: ['Produksi Hasil Tangkapan'],
      summary: 'Get produksi hasil tangkapan by ID',
      description: 'Get produksi hasil tangkapan detail by ID with relations',
    },
  })
  .post('/', produksiHasilTangkapanHandler.create, {
    body: t.Object({
      kelompok_nelayan_id: t.String(),
      kapal_id: t.Optional(t.Numeric()),
      komoditas_id: t.Numeric(),
      alat_tangkap_id: t.Optional(t.Numeric()),
      tanggal_produksi: t.String(),
      jumlah_tangkapan_kg: t.Numeric(),
      nilai_jual_rp: t.Optional(t.Numeric()),
      lokasi_penangkapan: t.Optional(t.String()),
      koordinat_latitude: t.Optional(t.Numeric()),
      koordinat_longitude: t.Optional(t.Numeric()),
    }),
    detail: {
      tags: ['Produksi Hasil Tangkapan'],
      summary: 'Create new produksi hasil tangkapan',
      description: 'Create a new produksi hasil tangkapan record',
    },
  })
  .put('/:id', produksiHasilTangkapanHandler.update, {
    params: t.Object({
      id: t.String()
    }),
    body: t.Object({
      kelompok_nelayan_id: t.Optional(t.String()),
      kapal_id: t.Optional(t.Numeric()),
      komoditas_id: t.Optional(t.Numeric()),
      alat_tangkap_id: t.Optional(t.Numeric()),
      tanggal_produksi: t.Optional(t.String()),
      jumlah_tangkapan_kg: t.Optional(t.Numeric()),
      nilai_jual_rp: t.Optional(t.Numeric()),
      lokasi_penangkapan: t.Optional(t.String()),
      koordinat_latitude: t.Optional(t.Numeric()),
      koordinat_longitude: t.Optional(t.Numeric()),
    }),
    detail: {
      tags: ['Produksi Hasil Tangkapan'],
      summary: 'Update produksi hasil tangkapan',
      description: 'Update produksi hasil tangkapan by ID',
    },
  })
  .delete('/:id', produksiHasilTangkapanHandler.delete, {
    params: t.Object({
      id: t.String()
    }),
    detail: {
      tags: ['Produksi Hasil Tangkapan'],
      summary: 'Delete produksi hasil tangkapan',
      description: 'Delete produksi hasil tangkapan by ID',
    },
  });
