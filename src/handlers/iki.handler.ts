import { Elysia, t } from 'elysia';
import { IkiRepository } from '../repositories/iki.repository';
import type { CreateIkiType, UpdateIkiType, IkiQueryType } from '../types/iki';
import { successResponse, errorResponse } from '../utils/response';
import { logActivitySimple } from '../utils/activity-logger';

const ikiRepository = new IkiRepository();

export const ikiHandler = new Elysia({ prefix: '/iki' })
  .get('/', async ({ query, request }) => {
    try {
      const result = await ikiRepository.findAll(query as IkiQueryType);
      return successResponse(result);
    } catch (error: any) {
      await logActivitySimple(request, 'ERROR', 'GET', '/iki', null, null, error.message);
      return errorResponse(error.message);
    }
  })
  .get('/:id', async ({ params, request }) => {
    try {
      const iki = await ikiRepository.findById(Number(params.id));
      if (!iki) {
        return errorResponse('IKI tidak ditemukan');
      }
      return successResponse(iki);
    } catch (error: any) {
      await logActivitySimple(request, 'ERROR', 'GET', `/iki/${params.id}`, null, null, error.message);
      return errorResponse(error.message);
    }
  })
  .post('/', async ({ body, request }) => {
    try {
      const iki = await ikiRepository.create(body as CreateIkiType);
      await logActivitySimple(request, 'SUCCESS', 'POST', '/iki', null, iki);
      return successResponse(iki);
    } catch (error: any) {
      await logActivitySimple(request, 'ERROR', 'POST', '/iki', null, null, error.message);
      return errorResponse(error.message);
    }
  })
  .put('/:id', async ({ params, body, request }) => {
    try {
      const oldData = await ikiRepository.findById(Number(params.id));
      if (!oldData) {
        return errorResponse('IKI tidak ditemukan');
      }

      const iki = await ikiRepository.update(Number(params.id), body as UpdateIkiType);
      await logActivitySimple(request, 'SUCCESS', 'PUT', `/iki/${params.id}`, oldData, iki);
      return successResponse(iki);
    } catch (error: any) {
      await logActivitySimple(request, 'ERROR', 'PUT', `/iki/${params.id}`, null, null, error.message);
      return errorResponse(error.message);
    }
  })
  .delete('/:id', async ({ params, request }) => {
    try {
      const oldData = await ikiRepository.findById(Number(params.id));
      if (!oldData) {
        return errorResponse('IKI tidak ditemukan');
      }

      const iki = await ikiRepository.delete(Number(params.id));
      await logActivitySimple(request, 'SUCCESS', 'DELETE', `/iki/${params.id}`, oldData, null);
      return successResponse(iki);
    } catch (error: any) {
      await logActivitySimple(request, 'ERROR', 'DELETE', `/iki/${params.id}`, null, null, error.message);
      return errorResponse(error.message);
    }
  });
