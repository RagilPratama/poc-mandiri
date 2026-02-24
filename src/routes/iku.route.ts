import { Elysia, t } from 'elysia';
import { ikuHandler } from '../handlers/iku.handler';

export const ikuRoute = new Elysia()
  .use(ikuHandler);
