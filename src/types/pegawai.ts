import { Static, Type } from '@sinclair/typebox';

export const PegawaiSchema = Type.Object({
  id: Type.Number(),
  nip: Type.String({ minLength: 1, maxLength: 50 }),
  nama: Type.String({ minLength: 1, maxLength: 255 }),
  email: Type.String({ format: 'email', maxLength: 255 }),
  jabatan: Type.String({ minLength: 1, maxLength: 255 }),
  organisasi_id: Type.Number(),
  role_id: Type.Number(),
  status_aktif: Type.Boolean(),
  last_login: Type.Optional(Type.Union([Type.String(), Type.Null()])),
  created_at: Type.Optional(Type.String()),
  updated_at: Type.Optional(Type.String()),
});

export const CreatePegawaiSchema = Type.Object({
  nip: Type.String({ minLength: 1, maxLength: 50 }),
  nama: Type.String({ minLength: 1, maxLength: 255 }),
  email: Type.String({ format: 'email', maxLength: 255 }),
  jabatan: Type.String({ minLength: 1, maxLength: 255 }),
  organisasi_id: Type.Number(),
  role_id: Type.Number(),
  status_aktif: Type.Optional(Type.Boolean()),
});

export const UpdatePegawaiSchema = Type.Partial(CreatePegawaiSchema);

export const PegawaiQuerySchema = Type.Object({
  page: Type.Optional(Type.Number({ minimum: 1 })),
  limit: Type.Optional(Type.Number({ minimum: 1, maximum: 100 })),
  search: Type.Optional(Type.String()),
  organisasi_id: Type.Optional(Type.Number()),
  role_id: Type.Optional(Type.Number()),
  status_aktif: Type.Optional(Type.Boolean()),
});

export type PegawaiType = Static<typeof PegawaiSchema>;
export type CreatePegawaiType = Static<typeof CreatePegawaiSchema>;
export type UpdatePegawaiType = Static<typeof UpdatePegawaiSchema>;
export type PegawaiQueryType = Static<typeof PegawaiQuerySchema>;
