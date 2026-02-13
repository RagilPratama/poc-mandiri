import { Static, Type } from '@sinclair/typebox';

export const KelompokNelayanSchema = Type.Object({
  id: Type.Number(),
  nib_kelompok: Type.String({ minLength: 1, maxLength: 50 }),
  no_registrasi: Type.String({ minLength: 1, maxLength: 50 }),
  nama_kelompok: Type.String({ minLength: 1, maxLength: 255 }),
  nik_ketua: Type.String({ minLength: 1, maxLength: 50 }),
  nama_ketua: Type.String({ minLength: 1, maxLength: 255 }),
  upt_id: Type.Number(),
  province_id: Type.Number(),
  penyuluh_id: Type.Number(),
  gabungan_kelompok_id: Type.Optional(Type.Union([Type.Number(), Type.Null()])),
  jumlah_anggota: Type.Number({ minimum: 1 }),
  created_at: Type.Optional(Type.String()),
  updated_at: Type.Optional(Type.String()),
});

export const CreateKelompokNelayanSchema = Type.Object({
  nib_kelompok: Type.String({ minLength: 1, maxLength: 50 }),
  no_registrasi: Type.String({ minLength: 1, maxLength: 50 }),
  nama_kelompok: Type.String({ minLength: 1, maxLength: 255 }),
  nik_ketua: Type.String({ minLength: 1, maxLength: 50 }),
  nama_ketua: Type.String({ minLength: 1, maxLength: 255 }),
  upt_id: Type.Number(),
  province_id: Type.Number(),
  penyuluh_id: Type.Number(),
  gabungan_kelompok_id: Type.Optional(Type.Union([Type.Number(), Type.Null()])),
  jumlah_anggota: Type.Number({ minimum: 1 }),
});

export const UpdateKelompokNelayanSchema = Type.Partial(CreateKelompokNelayanSchema);

export const KelompokNelayanQuerySchema = Type.Object({
  page: Type.Optional(Type.Number({ minimum: 1 })),
  limit: Type.Optional(Type.Number({ minimum: 1, maximum: 100 })),
  search: Type.Optional(Type.String()),
  upt_id: Type.Optional(Type.Number()),
  province_id: Type.Optional(Type.Number()),
  penyuluh_id: Type.Optional(Type.Number()),
  gabungan_kelompok_id: Type.Optional(Type.Number()),
});

export type KelompokNelayanType = Static<typeof KelompokNelayanSchema>;
export type CreateKelompokNelayanType = Static<typeof CreateKelompokNelayanSchema>;
export type UpdateKelompokNelayanType = Static<typeof UpdateKelompokNelayanSchema>;
export type KelompokNelayanQueryType = Static<typeof KelompokNelayanQuerySchema>;
