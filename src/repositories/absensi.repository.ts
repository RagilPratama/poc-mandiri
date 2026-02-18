import { eq, and, gte, lte, sql, desc, or, ilike } from 'drizzle-orm';
import { db } from '../db';
import { absensi } from '../db/schema/absensi';
import { pegawai } from '../db/schema/pegawai';
import type { CreateAbsensiType, CheckoutAbsensiType, UpdateAbsensiType, AbsensiQueryType } from '../types/absensi';

export class AbsensiRepository {
  async findAll(query: AbsensiQueryType) {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const offset = (page - 1) * limit;

    const conditions = [];

    if (query.date_from) {
      conditions.push(gte(absensi.date, query.date_from));
    }

    if (query.date_to) {
      conditions.push(lte(absensi.date, query.date_to));
    }

    if (query.search) {
      const searchCondition = or(
        ilike(pegawai.nama, `%${query.search}%`),
        ilike(absensi.nip, `%${query.search}%`)
      );
      conditions.push(searchCondition);
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const [data, countResult] = await Promise.all([
      db
        .select({
          id: absensi.id,
          date: absensi.date,
          nip: absensi.nip,
          nama: pegawai.nama,
          checkin: absensi.checkin,
          ci_latitude: absensi.ci_latitude,
          ci_longitude: absensi.ci_longitude,
          checkout: absensi.checkout,
          co_latitude: absensi.co_latitude,
          co_longitude: absensi.co_longitude,
          working_hours: absensi.working_hours,
          status: absensi.status,
          total_overtime: absensi.total_overtime,
          created_at: absensi.created_at,
          updated_at: absensi.updated_at,
        })
        .from(absensi)
        .leftJoin(pegawai, eq(absensi.nip, pegawai.nip))
        .where(whereClause)
        .orderBy(desc(absensi.date), desc(absensi.checkin))
        .limit(limit)
        .offset(offset),
      db
        .select({ count: sql<number>`count(*)::int` })
        .from(absensi)
        .leftJoin(pegawai, eq(absensi.nip, pegawai.nip))
        .where(whereClause),
    ]);

    const total = countResult[0]?.count || 0;
    const totalPages = Math.ceil(total / limit);

    return {
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    };
  }

  async findById(id: number) {
    const result = await db
      .select({
        id: absensi.id,
        date: absensi.date,
        nip: absensi.nip,
        nama: pegawai.nama,
        checkin: absensi.checkin,
        ci_latitude: absensi.ci_latitude,
        ci_longitude: absensi.ci_longitude,
        checkout: absensi.checkout,
        co_latitude: absensi.co_latitude,
        co_longitude: absensi.co_longitude,
        working_hours: absensi.working_hours,
        status: absensi.status,
        total_overtime: absensi.total_overtime,
        created_at: absensi.created_at,
        updated_at: absensi.updated_at,
      })
      .from(absensi)
      .leftJoin(pegawai, eq(absensi.nip, pegawai.nip))
      .where(eq(absensi.id, id))
      .limit(1);

    return result[0] || null;
  }

  async findByNipAndDate(nip: string, date: string) {
    const result = await db
      .select()
      .from(absensi)
      .where(and(eq(absensi.nip, nip), eq(absensi.date, date)))
      .limit(1);

    return result[0] || null;
  }

  async create(data: CreateAbsensiType & { checkin_photo_url?: string; checkin_photo_id?: string }) {
    const result = await db
      .insert(absensi)
      .values({
        date: data.date,
        nip: data.nip,
        checkin: typeof data.checkin === 'string' ? new Date(data.checkin) : data.checkin,
        ci_latitude: data.ci_latitude,
        ci_longitude: data.ci_longitude,
        checkin_photo_url: data.checkin_photo_url,
        checkin_photo_id: data.checkin_photo_id,
        status: 'Masih Berjalan', // Default status saat check-in
      })
      .returning();

    return result[0];
  }

  async checkout(id: number, data: CheckoutAbsensiType) {
    // Get checkin time first
    const record = await db
      .select({ checkin: absensi.checkin })
      .from(absensi)
      .where(eq(absensi.id, id))
      .limit(1);

    if (!record[0]) return null;

    // Calculate working hours
    const checkinTime = new Date(record[0].checkin);
    const checkoutTime = typeof data.checkout === 'string' ? new Date(data.checkout) : data.checkout;
    const diffMs = checkoutTime.getTime() - checkinTime.getTime();
    const workingHoursDecimal = diffMs / (1000 * 60 * 60);
    const workingHours = workingHoursDecimal.toFixed(2);

    // Determine status and overtime
    let status = 'Tepat Waktu';
    let totalOvertime = '0.00';

    if (workingHoursDecimal < 8) {
      status = 'Pulang Sebelum Waktunya';
    } else if (workingHoursDecimal >= 8 && workingHoursDecimal <= 8.25) {
      status = 'Tepat Waktu';
    } else if (workingHoursDecimal > 8.25) {
      status = 'Lembur';
      // Calculate overtime in hours (lebih dari 8.25 jam)
      const overtimeHours = workingHoursDecimal - 8.25;
      totalOvertime = overtimeHours.toFixed(2);
    }

    const result = await db
      .update(absensi)
      .set({
        checkout: checkoutTime,
        co_latitude: data.co_latitude,
        co_longitude: data.co_longitude,
        working_hours: workingHours,
        status: status,
        total_overtime: totalOvertime,
        updated_at: new Date(),
      })
      .where(eq(absensi.id, id))
      .returning();

    return result[0] || null;
  }

  async update(id: number, data: UpdateAbsensiType) {
    const updateData: any = {
      updated_at: new Date(),
    };

    if (data.date !== undefined) updateData.date = data.date;
    if (data.checkin !== undefined) {
      updateData.checkin = typeof data.checkin === 'string' ? new Date(data.checkin) : data.checkin;
    }
    if (data.ci_latitude !== undefined) updateData.ci_latitude = data.ci_latitude;
    if (data.ci_longitude !== undefined) updateData.ci_longitude = data.ci_longitude;
    if (data.checkout !== undefined) {
      updateData.checkout = typeof data.checkout === 'string' ? new Date(data.checkout) : data.checkout;
    }
    if (data.co_latitude !== undefined) updateData.co_latitude = data.co_latitude;
    if (data.co_longitude !== undefined) updateData.co_longitude = data.co_longitude;

    const result = await db
      .update(absensi)
      .set(updateData)
      .where(eq(absensi.id, id))
      .returning();

    return result[0] || null;
  }

  async delete(id: number) {
    const result = await db
      .delete(absensi)
      .where(eq(absensi.id, id))
      .returning();

    return result[0] || null;
  }

  async deleteByDate(nip: string, date: string) {
    const result = await db
      .delete(absensi)
      .where(and(eq(absensi.nip, nip), eq(absensi.date, date)))
      .returning();

    return result;
  }

  async deleteAllByDate(date: string) {
    const result = await db
      .delete(absensi)
      .where(eq(absensi.date, date))
      .returning();

    return result;
  }
}
