import { Elysia, t } from 'elysia';
import { logAktivitasHandler } from '../handlers/log-aktivitas.handler';

export const logAktivitasRoute = new Elysia({ prefix: '/log-aktivitas' })
  .get('/', logAktivitasHandler.getAll, {
    query: t.Object({
      page: t.Optional(t.Numeric({ minimum: 1 })),
      limit: t.Optional(t.Numeric({ minimum: 1, maximum: 100 })),
      search: t.Optional(t.String()),
      modul: t.Optional(t.String()),
      aktivitas: t.Optional(t.String()),
      status: t.Optional(t.String()),
      pegawai_id: t.Optional(t.Numeric()),
      user_id: t.Optional(t.String()),
      start_date: t.Optional(t.String()),
      end_date: t.Optional(t.String()),
    }),
    detail: {
      tags: ['Log Aktivitas'],
      summary: 'Get all log aktivitas',
      description: 'Get all log aktivitas with pagination and filters',
    },
  })
  .get('/statistics', logAktivitasHandler.getStatistics, {
    detail: {
      tags: ['Log Aktivitas'],
      summary: 'Get log aktivitas statistics',
      description: 'Get statistics of log aktivitas by modul, aktivitas, and status',
    },
  })
  .get('/:id', logAktivitasHandler.getById, {
    params: t.Object({
      id: t.Numeric()
    }),
    detail: {
      tags: ['Log Aktivitas'],
      summary: 'Get log aktivitas by ID',
      description: 'Get log aktivitas detail by ID',
    },
  });
