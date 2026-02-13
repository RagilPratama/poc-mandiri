import { Elysia, t } from 'elysia';
import { penyuluhHandler } from '../handlers/penyuluh.handler';
import {
  CreatePenyuluhSchema,
  UpdatePenyuluhSchema,
  PenyuluhQuerySchema,
} from '../types/penyuluh';

export const penyuluhRoute = new Elysia({ prefix: '/penyuluh' })
  .get('/', penyuluhHandler.getAll, {
    query: PenyuluhQuerySchema,
    detail: {
      tags: ['Penyuluh'],
      summary: 'Get all penyuluh',
      description: 'Get all penyuluh with pagination, search, and filters',
    },
  })
  .get('/:id', penyuluhHandler.getById, {
    params: t.Object({
      id: t.String()
    }),
    detail: {
      tags: ['Penyuluh'],
      summary: 'Get penyuluh by ID',
      description: 'Get penyuluh detail by ID with pegawai, UPT, and province relations',
    },
  })
  .post('/', penyuluhHandler.create, {
    body: CreatePenyuluhSchema,
    detail: {
      tags: ['Penyuluh'],
      summary: 'Create new penyuluh',
      description: 'Create a new penyuluh record',
    },
  })
  .put('/:id', penyuluhHandler.update, {
    params: t.Object({
      id: t.String()
    }),
    body: UpdatePenyuluhSchema,
    detail: {
      tags: ['Penyuluh'],
      summary: 'Update penyuluh',
      description: 'Update penyuluh by ID',
    },
  })
  .delete('/:id', penyuluhHandler.delete, {
    params: t.Object({
      id: t.String()
    }),
    detail: {
      tags: ['Penyuluh'],
      summary: 'Delete penyuluh',
      description: 'Delete penyuluh by ID',
    },
  });
