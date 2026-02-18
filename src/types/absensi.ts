import { t } from 'elysia';

export interface CreateAbsensiType {
  date: string;
  nip: string;
  checkin: Date | string;
  ci_latitude: string;
  ci_longitude: string;
  checkin_photo?: File | Blob;
}

export interface CheckoutAbsensiType {
  checkout: Date | string;
  co_latitude: string;
  co_longitude: string;
}

export interface UpdateAbsensiType {
  date?: string;
  checkin?: Date | string;
  ci_latitude?: string;
  ci_longitude?: string;
  checkout?: Date | string;
  co_latitude?: string;
  co_longitude?: string;
}

export interface AbsensiQueryType {
  page?: number;
  limit?: number;
  date_from?: string;
  date_to?: string;
  search?: string;
}

export const CreateAbsensiSchema = t.Object({
  date: t.String({ format: 'date', description: 'Tanggal absensi (YYYY-MM-DD)' }),
  nip: t.String({ minLength: 1, description: 'NIP pegawai' }),
  checkin: t.String({ format: 'date-time', description: 'Waktu check-in (ISO 8601)' }),
  ci_latitude: t.String({ description: 'Latitude lokasi check-in' }),
  ci_longitude: t.String({ description: 'Longitude lokasi check-in' }),
  checkin_photo: t.File({ description: 'Foto selfie saat check-in (JPG/PNG, max 5MB)' }),
});

export const CheckoutAbsensiSchema = t.Object({
  checkout: t.String({ format: 'date-time', description: 'Waktu check-out (ISO 8601)' }),
  co_latitude: t.String({ description: 'Latitude lokasi check-out' }),
  co_longitude: t.String({ description: 'Longitude lokasi check-out' }),
});

export const UpdateAbsensiSchema = t.Object({
  date: t.Optional(t.String({ format: 'date', description: 'Tanggal absensi (YYYY-MM-DD)' })),
  checkin: t.Optional(t.String({ format: 'date-time', description: 'Waktu check-in (ISO 8601)' })),
  ci_latitude: t.Optional(t.String({ description: 'Latitude lokasi check-in' })),
  ci_longitude: t.Optional(t.String({ description: 'Longitude lokasi check-in' })),
  checkout: t.Optional(t.String({ format: 'date-time', description: 'Waktu check-out (ISO 8601)' })),
  co_latitude: t.Optional(t.String({ description: 'Latitude lokasi check-out' })),
  co_longitude: t.Optional(t.String({ description: 'Longitude lokasi check-out' })),
});

export const AbsensiQuerySchema = t.Object({
  page: t.Optional(t.Numeric({ minimum: 1, description: 'Page number' })),
  limit: t.Optional(t.Numeric({ minimum: 1, maximum: 100, description: 'Items per page' })),
  date_from: t.Optional(t.String({ format: 'date', description: 'Filter from date (YYYY-MM-DD)' })),
  date_to: t.Optional(t.String({ format: 'date', description: 'Filter to date (YYYY-MM-DD)' })),
  search: t.Optional(t.String({ description: 'Search by nama or NIP (LIKE)' })),
});
