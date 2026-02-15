import { t } from 'elysia';

export interface CreateAbsensiType {
  date: string;
  nip: string;
  checkin: Date | string;
  latitude: string;
  longitude: string;
}

export interface CheckoutAbsensiType {
  checkout: Date | string;
  latitude: string;
  longitude: string;
}

export interface UpdateAbsensiType {
  date?: string;
  checkin?: Date | string;
  checkout?: Date | string;
  latitude?: string;
  longitude?: string;
}

export interface AbsensiQueryType {
  page?: number;
  limit?: number;
  nip?: string;
  date_from?: string;
  date_to?: string;
}

export const CreateAbsensiSchema = t.Object({
  date: t.String({ format: 'date', description: 'Tanggal absensi (YYYY-MM-DD)' }),
  nip: t.String({ minLength: 1, description: 'NIP pegawai' }),
  checkin: t.String({ format: 'date-time', description: 'Waktu check-in (ISO 8601)' }),
  latitude: t.String({ description: 'Latitude lokasi check-in' }),
  longitude: t.String({ description: 'Longitude lokasi check-in' }),
});

export const CheckoutAbsensiSchema = t.Object({
  checkout: t.String({ format: 'date-time', description: 'Waktu check-out (ISO 8601)' }),
  latitude: t.String({ description: 'Latitude lokasi check-out' }),
  longitude: t.String({ description: 'Longitude lokasi check-out' }),
});

export const UpdateAbsensiSchema = t.Object({
  date: t.Optional(t.String({ format: 'date', description: 'Tanggal absensi (YYYY-MM-DD)' })),
  checkin: t.Optional(t.String({ format: 'date-time', description: 'Waktu check-in (ISO 8601)' })),
  checkout: t.Optional(t.String({ format: 'date-time', description: 'Waktu check-out (ISO 8601)' })),
  latitude: t.Optional(t.String({ description: 'Latitude lokasi' })),
  longitude: t.Optional(t.String({ description: 'Longitude lokasi' })),
});

export const AbsensiQuerySchema = t.Object({
  page: t.Optional(t.Numeric({ minimum: 1, description: 'Page number' })),
  limit: t.Optional(t.Numeric({ minimum: 1, maximum: 100, description: 'Items per page' })),
  nip: t.Optional(t.String({ description: 'Filter by NIP' })),
  date_from: t.Optional(t.String({ format: 'date', description: 'Filter from date (YYYY-MM-DD)' })),
  date_to: t.Optional(t.String({ format: 'date', description: 'Filter to date (YYYY-MM-DD)' })),
});
