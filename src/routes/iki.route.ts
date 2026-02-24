import { Elysia, t } from 'elysia';
import { ikiHandler } from '../handlers/iki.handler';

export const ikiRoute = new Elysia()
  .use(ikiHandler);
