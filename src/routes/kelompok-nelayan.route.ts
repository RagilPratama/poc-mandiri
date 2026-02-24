import { Elysia, t } from 'elysia';
import { kelompokNelayanHandler } from '../handlers/kelompok-nelayan.handler';
import { KelompokNelayanQuerySchema } from '../types/kelompok-nelayan';

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
    body: t.Object({
      nib_kelompok: t.String(),
      no_registrasi: t.String(),
      nama_kelompok: t.String(),
      nik_ketua: t.String(),
      nama_ketua: t.String(),
      jenis_kelamin_ketua: t.Optional(t.String()),
      upt_id: t.Number(),
      province_id: t.Number(),
      penyuluh_id: t.Number(),
      no_hp_penyuluh: t.Optional(t.String()),
      status_penyuluh: t.Optional(t.String()),
      jumlah_anggota: t.Number(),
      jenis_usaha_id: t.Optional(t.Union([t.Number(), t.Null()])),
      kelas_kelompok: t.Optional(t.String()),
      alamat: t.Optional(t.String()),
      no_hp_ketua: t.Optional(t.String()),
      tanggal_pembentukan_kelompok: t.Optional(t.String({ format: 'date' })),
      tanggal_peningkatan_kelas_kelompok: t.Optional(t.String({ format: 'date' })),
      tanggal_pembentukan_gapokan: t.Optional(t.String({ format: 'date' })),
      profil_kelompok_photo: t.Optional(t.File()),
    }),
    type: 'multipart/form-data',
    detail: {
      tags: ['Kelompok Nelayan'],
      summary: 'Create new kelompok nelayan',
      description: `Create a new kelompok nelayan record with optional profile photo.

**Request Body (multipart/form-data):**
- Basic fields: nib_kelompok, no_registrasi, nama_kelompok, etc.
- Date fields: tanggal_pembentukan_kelompok, tanggal_peningkatan_kelas_kelompok, tanggal_pembentukan_gapokan (format: YYYY-MM-DD)
- profil_kelompok_photo: Optional photo file (JPG/PNG, max 5MB)`,
    },
  })
  .put('/:id', kelompokNelayanHandler.update, {
    params: t.Object({
      id: t.String()
    }),
    body: t.Object({
      nib_kelompok: t.Optional(t.String()),
      no_registrasi: t.Optional(t.String()),
      nama_kelompok: t.Optional(t.String()),
      nik_ketua: t.Optional(t.String()),
      nama_ketua: t.Optional(t.String()),
      jenis_kelamin_ketua: t.Optional(t.String()),
      upt_id: t.Optional(t.Number()),
      province_id: t.Optional(t.Number()),
      penyuluh_id: t.Optional(t.Number()),
      no_hp_penyuluh: t.Optional(t.String()),
      status_penyuluh: t.Optional(t.String()),
      jumlah_anggota: t.Optional(t.Number()),
      jenis_usaha_id: t.Optional(t.Union([t.Number(), t.Null()])),
      kelas_kelompok: t.Optional(t.String()),
      alamat: t.Optional(t.String()),
      no_hp_ketua: t.Optional(t.String()),
      tanggal_pembentukan_kelompok: t.Optional(t.String({ format: 'date' })),
      tanggal_peningkatan_kelas_kelompok: t.Optional(t.String({ format: 'date' })),
      tanggal_pembentukan_gapokan: t.Optional(t.String({ format: 'date' })),
      profil_kelompok_photo: t.Optional(t.File()),
    }),
    type: 'multipart/form-data',
    detail: {
      tags: ['Kelompok Nelayan'],
      summary: 'Update kelompok nelayan',
      description: `Update kelompok nelayan by ID with optional profile photo update.

**Request Body (multipart/form-data):**
- All fields are optional
- Date fields: tanggal_pembentukan_kelompok, tanggal_peningkatan_kelas_kelompok, tanggal_pembentukan_gapokan (format: YYYY-MM-DD)
- profil_kelompok_photo: Optional photo file to update/replace (JPG/PNG, max 5MB)`,
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
