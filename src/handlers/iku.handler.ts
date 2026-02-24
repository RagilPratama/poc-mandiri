import { Elysia, t } from 'elysia';
import { IkuRepository } from '../repositories/iku.repository';
import type { CreateIkuType, UpdateIkuType, IkuQueryType } from '../types/iku';
import { successResponse, errorResponse } from '../utils/response';
import { logActivitySimple } from '../utils/activity-logger';

const ikuRepository = new IkuRepository();

export const ikuHandler = new Elysia({ prefix: '/iku' })
  .get('/', async ({ query, request }) => {
    try {
      const result = await ikuRepository.findAll(query as IkuQueryType);
      return successResponse(result);
    } catch (error: any) {
      await logActivitySimple(request, 'ERROR', 'GET', '/iku', null, null, error.message);
      return errorResponse(error.message);
    }
  })
  .get('/:id', async ({ params, request }) => {
    try {
      const iku = await ikuRepository.findById(Number(params.id));
      if (!iku) {
        return errorResponse('IKU tidak ditemukan');
      }
      return successResponse(iku);
    } catch (error: any) {
      await logActivitySimple(request, 'ERROR', 'GET', `/iku/${params.id}`, null, null, error.message);
      return errorResponse(error.message);
    }
  })
  .post('/', async ({ body, request }) => {
    try {
      const iku = await ikuRepository.create(body as CreateIkuType);
      await logActivitySimple(request, 'SUCCESS', 'POST', '/iku', null, iku);
      return successResponse(iku);
    } catch (error: any) {
      await logActivitySimple(request, 'ERROR', 'POST', '/iku', null, null, error.message);
      return errorResponse(error.message);
    }
  })
  .put('/:id', async ({ params, body, request }) => {
    try {
      const oldData = await ikuRepository.findById(Number(params.id));
      if (!oldData) {
        return errorResponse('IKU tidak ditemukan');
      }

      const iku = await ikuRepository.update(Number(params.id), body as UpdateIkuType);
      await logActivitySimple(request, 'SUCCESS', 'PUT', `/iku/${params.id}`, oldData, iku);
      return successResponse(iku);
    } catch (error: any) {
      await logActivitySimple(request, 'ERROR', 'PUT', `/iku/${params.id}`, null, null, error.message);
      return errorResponse(error.message);
    }
  })
  .delete('/:id', async ({ params, request }) => {
    try {
      const oldData = await ikuRepository.findById(Number(params.id));
      if (!oldData) {
        return errorResponse('IKU tidak ditemukan');
      }

      const iku = await ikuRepository.delete(Number(params.id));
      await logActivitySimple(request, 'SUCCESS', 'DELETE', `/iku/${params.id}`, oldData, null);
      return successResponse(iku);
    } catch (error: any) {
      await logActivitySimple(request, 'ERROR', 'DELETE', `/iku/${params.id}`, null, null, error.message);
      return errorResponse(error.message);
    }
  });
