import { Elysia, t } from 'elysia';
import { kegiatanGabunganHandler } from '../handlers/kegiatan-gabungan.handler';

export const kegiatanGabunganRoute = new Elysia({ prefix: '/kegiatan' })
  .get('/by-date', kegiatanGabunganHandler.getByDate, {
    query: t.Object({
      pegawai_id: t.Optional(t.Numeric()),
      tanggal: t.Optional(t.String()), // YYYY-MM-DD
      bulan: t.Optional(t.String()), // YYYY-MM
      tahun: t.Optional(t.String()), // YYYY
      group_by_date: t.Optional(t.Boolean()),
    }),
    detail: {
      tags: ['Kegiatan Gabungan'],
      summary: 'Get kegiatan harian dan prioritas by date',
      description: 'Get combined kegiatan harian and kegiatan prioritas filtered by tanggal/bulan/tahun. Returns only rencana_kerja and detail_keterangan. Use group_by_date=true to group activities by date.',
    },
  });
