import { Static, Type } from '@sinclair/typebox';

export const PenyuluhSchema = Type.Object({
  id: Type.Number(),
  pegawai_id: Type.Number(),
  upt_id: Type.Number(),
  province_id: Type.Number(),
  jumlah_kelompok: Type.Number({ minimum: 0 }),
  program_prioritas: Type.Optional(Type.Union([Type.String({ maxLength: 255 }), Type.Null()])),
  status_aktif: Type.Boolean(),
  created_at: Type.Optional(Type.String()),
  updated_at: Type.Optional(Type.String()),
});

export const CreatePenyuluhSchema = Type.Object({
  pegawai_id: Type.Number(),
  upt_id: Type.Number(),
  province_id: Type.Number(),
  jumlah_kelompok: Type.Optional(Type.Number({ minimum: 0 })),
  program_prioritas: Type.Optional(Type.Union([Type.String({ maxLength: 255 }), Type.Null()])),
  status_aktif: Type.Optional(Type.Boolean()),
});

export const UpdatePenyuluhSchema = Type.Partial(CreatePenyuluhSchema);

export const PenyuluhQuerySchema = Type.Object({
  page: Type.Optional(Type.Number({ minimum: 1 })),
  limit: Type.Optional(Type.Number({ minimum: 1, maximum: 100 })),
  search: Type.Optional(Type.String()),
  upt_id: Type.Optional(Type.Number()),
  province_id: Type.Optional(Type.Number()),
  status_aktif: Type.Optional(Type.Boolean()),
});

export type PenyuluhType = Static<typeof PenyuluhSchema>;
export type CreatePenyuluhType = Static<typeof CreatePenyuluhSchema>;
export type UpdatePenyuluhType = Static<typeof UpdatePenyuluhSchema>;
export type PenyuluhQueryType = Static<typeof PenyuluhQuerySchema>;
