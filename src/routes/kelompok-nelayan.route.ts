import { Elysia, t } from 'elysia';
import { kelompokNelayanHandler } from '../handlers/kelompok-nelayan.handler';
import {
  CreateKelompokNelayanSchema,
  UpdateKelompokNelayanSchema,
  KelompokNelayanQuerySchema,
} from '../types/kelompok-nelayan';

export const kelompokNelayanRoute = new Elysia({ prefix: '/kelompok-nelayan' })
  .get('/', kelompokNelayanHandler.getAll, {
    query: KelompokNelayanQuerySchema,
    detail: {
      tags: ['Kelompok Nelayan'],
      summary: 'Get all kelompok nelayan',
      description: 'Get all kelompok nelayan with pagination, search, and filters',
    },
  })
  .get('/:id', kelompokNelayanHandler.getById, {
    params: t.Object({
      id: t.String()
    }),
    detail: {
      tags: ['Kelompok Nelayan'],
      summary: 'Get kelompok nelayan by ID',
      description: 'Get kelompok nelayan detail by ID with UPT, province, and penyuluh relations',
    },
  })
  .post('/', kelompokNelayanHandler.create, {
    body: CreateKelompokNelayanSchema,
    detail: {
      tags: ['Kelompok Nelayan'],
      summary: 'Create new kelompok nelayan',
      description: 'Create a new kelompok nelayan record',
    },
  })
  .put('/:id', kelompokNelayanHandler.update, {
    params: t.Object({
      id: t.String()
    }),
    body: UpdateKelompokNelayanSchema,
    detail: {
      tags: ['Kelompok Nelayan'],
      summary: 'Update kelompok nelayan',
      description: 'Update kelompok nelayan by ID',
    },
  })
  .delete('/:id', kelompokNelayanHandler.delete, {
    params: t.Object({
      id: t.String()
    }),
    detail: {
      tags: ['Kelompok Nelayan'],
      summary: 'Delete kelompok nelayan',
      description: 'Delete kelompok nelayan by ID',
    },
  });
