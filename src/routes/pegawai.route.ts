import { Elysia, t } from 'elysia';
import { pegawaiHandler } from '../handlers/pegawai.handler';
import {
  PegawaiSchema,
  CreatePegawaiSchema,
  UpdatePegawaiSchema,
  PegawaiQuerySchema,
} from '../types/pegawai';

export const pegawaiRoute = new Elysia({ prefix: '/pegawai' })
  .get('/', pegawaiHandler.getAll, {
    query: PegawaiQuerySchema,
    detail: {
      tags: ['Pegawai'],
      summary: 'Get all pegawai',
      description: 'Get all pegawai with pagination, search, and filters',
    },
  })
  .get('/:id', pegawaiHandler.getById, {
    params: t.Object({
      id: t.String()
    }),
    detail: {
      tags: ['Pegawai'],
      summary: 'Get pegawai by ID',
      description: 'Get pegawai detail by ID with organisasi and role relations',
    },
  })
  .get('/email/:email', pegawaiHandler.getByEmail, {
    params: t.Object({
      email: t.String({ format: 'email' })
    }),
    detail: {
      tags: ['Pegawai'],
      summary: 'Get pegawai by email',
      description: 'Get pegawai detail by email with organisasi and role relations',
    },
  })
  .post('/', pegawaiHandler.create, {
    body: CreatePegawaiSchema,
    detail: {
      tags: ['Pegawai'],
      summary: 'Create new pegawai',
      description: 'Create a new pegawai record',
    },
  })
  .put('/:id', pegawaiHandler.update, {
    params: t.Object({
      id: t.String()
    }),
    body: UpdatePegawaiSchema,
    detail: {
      tags: ['Pegawai'],
      summary: 'Update pegawai',
      description: 'Update pegawai by ID',
    },
  })
  .delete('/:id', pegawaiHandler.delete, {
    params: t.Object({
      id: t.String()
    }),
    detail: {
      tags: ['Pegawai'],
      summary: 'Delete pegawai',
      description: 'Delete pegawai by ID',
    },
  });
