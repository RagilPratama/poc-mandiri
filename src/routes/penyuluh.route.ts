import { Elysia, t } from 'elysia';
import { penyuluhHandler } from '../handlers/penyuluh.handler';
import {
  CreatePenyuluhSchema,
  UpdatePenyuluhSchema,
  PenyuluhQuerySchema,
} from '../types/penyuluh';

export const penyuluhRoute = new Elysia({ prefix: '/penyuluh' })
  .get('/', async (context) => {
    return await penyuluhHandler.getAll(context);
  }, {
    query: PenyuluhQuerySchema,
    detail: {
      tags: ['Penyuluh'],
      summary: 'Get all penyuluh',
      description: 'Get all penyuluh with pagination, search, and filters',
    },
  })
  .get('/:id', async (context) => {
    return await penyuluhHandler.getById(context);
  }, {
    params: t.Object({
      id: t.String()
    }),
    detail: {
      tags: ['Penyuluh'],
      summary: 'Get penyuluh by ID',
      description: 'Get penyuluh detail by ID with pegawai, UPT, and province relations',
    },
  })
  .post('/', async (context) => {
    return await penyuluhHandler.create(context);
  }, {
    body: CreatePenyuluhSchema,
    detail: {
      tags: ['Penyuluh'],
      summary: 'Create new penyuluh',
      description: 'Create a new penyuluh record',
    },
  })
  .put('/:id', async (context) => {
    return await penyuluhHandler.update(context);
  }, {
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
  .delete('/:id', async (context) => {
    return await penyuluhHandler.delete(context);
  }, {
    params: t.Object({
      id: t.String()
    }),
    detail: {
      tags: ['Penyuluh'],
      summary: 'Delete penyuluh',
      description: 'Delete penyuluh by ID',
    },
  });
