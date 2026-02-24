import { Static, Type } from '@sinclair/typebox';

export const KelompokNelayanSchema = Type.Object({
  id: Type.Number(),
  nib_kelompok: Type.String({ minLength: 1, maxLength: 50 }),
  no_registrasi: Type.String({ minLength: 1, maxLength: 50 }),
  nama_kelompok: Type.String({ minLength: 1, maxLength: 255 }),
  nik_ketua: Type.String({ minLength: 1, maxLength: 50 }),
  nama_ketua: Type.String({ minLength: 1, maxLength: 255 }),
  jenis_kelamin_ketua: Type.Optional(Type.String({ maxLength: 20 })),
  upt_id: Type.Number(),
  province_id: Type.Number(),
  penyuluh_id: Type.Number(),
  no_hp_penyuluh: Type.Optional(Type.String({ maxLength: 20 })),
  status_penyuluh: Type.Optional(Type.String({ maxLength: 50 })),
  kelas_kelompok: Type.Optional(Type.String({ maxLength: 50 })),
  jenis_usaha_id: Type.Optional(Type.Union([Type.Number(), Type.Null()])),
  alamat: Type.Optional(Type.String()),
  no_hp_ketua: Type.Optional(Type.String({ maxLength: 20 })),
  jumlah_anggota: Type.Number({ minimum: 1 }),
  tanggal_pembentukan_kelompok: Type.Optional(Type.String({ format: 'date' })),
  tanggal_peningkatan_kelas_kelompok: Type.Optional(Type.String({ format: 'date' })),
  tanggal_pembentukan_gapokan: Type.Optional(Type.String({ format: 'date' })),
  profil_kelompok_photo_url: Type.Optional(Type.String({ maxLength: 500 })),
  profil_kelompok_photo_id: Type.Optional(Type.String({ maxLength: 100 })),
  created_at: Type.Optional(Type.String()),
  updated_at: Type.Optional(Type.String()),
});

export const CreateKelompokNelayanSchema = Type.Object({
  nib_kelompok: Type.String({ minLength: 1, maxLength: 50 }),
  no_registrasi: Type.String({ minLength: 1, maxLength: 50 }),
  nama_kelompok: Type.String({ minLength: 1, maxLength: 255 }),
  nik_ketua: Type.String({ minLength: 1, maxLength: 50 }),
  nama_ketua: Type.String({ minLength: 1, maxLength: 255 }),
  jenis_kelamin_ketua: Type.Optional(Type.String({ maxLength: 20 })),
  upt_id: Type.Number(),
  province_id: Type.Number(),
  penyuluh_id: Type.Number(),
  no_hp_penyuluh: Type.Optional(Type.String({ maxLength: 20 })),
  status_penyuluh: Type.Optional(Type.String({ maxLength: 50 })),
  kelas_kelompok: Type.Optional(Type.String({ maxLength: 50 })),
  jenis_usaha_id: Type.Optional(Type.Union([Type.Number(), Type.Null()])),
  alamat: Type.Optional(Type.String()),
  no_hp_ketua: Type.Optional(Type.String({ maxLength: 20 })),
  jumlah_anggota: Type.Number({ minimum: 1 }),
  tanggal_pembentukan_kelompok: Type.Optional(Type.String({ format: 'date' })),
  tanggal_peningkatan_kelas_kelompok: Type.Optional(Type.String({ format: 'date' })),
  tanggal_pembentukan_gapokan: Type.Optional(Type.String({ format: 'date' })),
});

export const UpdateKelompokNelayanSchema = Type.Partial(CreateKelompokNelayanSchema);

export const KelompokNelayanQuerySchema = Type.Object({
  page: Type.Optional(Type.Number({ minimum: 1 })),
  limit: Type.Optional(Type.Number({ minimum: 1, maximum: 100 })),
  search: Type.Optional(Type.String()),
  upt_id: Type.Optional(Type.Number()),
  province_id: Type.Optional(Type.Number()),
  penyuluh_id: Type.Optional(Type.Number()),
});

export type KelompokNelayanType = Static<typeof KelompokNelayanSchema>;
export type CreateKelompokNelayanType = Static<typeof CreateKelompokNelayanSchema>;
export type UpdateKelompokNelayanType = Static<typeof UpdateKelompokNelayanSchema>;
export type KelompokNelayanQueryType = Static<typeof KelompokNelayanQuerySchema>;
