import { eq, and, gte, lte, sql, desc, or, ilike } from 'drizzle-orm';
import { db } from '../db';
import { trxAbsensi, mstPegawai, mstKabupaten } from '../db/schema';
import { findNearestKabupaten } from '../utils/reverse-geocoding';
import type { CreateAbsensiType, CheckoutAbsensiType, UpdateAbsensiType, AbsensiQueryType } from '../types/absensi';

export class AbsensiRepository {
  async findAll(query: AbsensiQueryType) {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const offset = (page - 1) * limit;

    const conditions = [];

    if (query.date_from) {
      conditions.push(gte(trxAbsensi.date, query.date_from));
    }

    if (query.date_to) {
      conditions.push(lte(trxAbsensi.date, query.date_to));
    }

    if (query.search) {
      const searchCondition = or(
        ilike(mstPegawai.nama, `%${query.search}%`),
        ilike(trxAbsensi.nip, `%${query.search}%`)
      );
      conditions.push(searchCondition);
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const [data, countResult] = await Promise.all([
      db
        .select({
          id: trxAbsensi.id,
          date: trxAbsensi.date,
          nip: trxAbsensi.nip,
          nama: mstPegawai.nama,
          checkin: trxAbsensi.checkin,
          ci_latitude: trxAbsensi.ci_latitude,
          ci_longitude: trxAbsensi.ci_longitude,
          checkin_photo_url: trxAbsensi.checkin_photo_url,
          checkin_photo_id: trxAbsensi.checkin_photo_id,
          checkout: trxAbsensi.checkout,
          co_latitude: trxAbsensi.co_latitude,
          co_longitude: trxAbsensi.co_longitude,
          working_hours: trxAbsensi.working_hours,
          status: trxAbsensi.status,
          total_overtime: trxAbsensi.total_overtime,
          keterangan: trxAbsensi.keterangan,
          created_at: trxAbsensi.created_at,
          updated_at: trxAbsensi.updated_at,
        })
        .from(trxAbsensi)
        .leftJoin(mstPegawai, eq(trxAbsensi.nip, mstPegawai.nip))
        .where(whereClause)
        .orderBy(desc(trxAbsensi.date), desc(trxAbsensi.checkin))
        .limit(limit)
        .offset(offset),
      db
        .select({ count: sql<number>`count(*)::int` })
        .from(trxAbsensi)
        .leftJoin(mstPegawai, eq(trxAbsensi.nip, mstPegawai.nip))
        .where(whereClause),
    ]);

    // Add lokasi_checkin (kabupaten name) for each record
    const dataWithLokasi = await Promise.all(
      data.map(async (record) => {
        const nearest = await findNearestKabupaten(
          parseFloat(record.ci_latitude as any),
          parseFloat(record.ci_longitude as any)
        );
        const nearestCheckout = record.co_latitude && record.co_longitude
          ? await findNearestKabupaten(
              parseFloat(record.co_latitude as any),
              parseFloat(record.co_longitude as any)
            )
          : null;
        
        return {
          ...record,
          lokasi_checkin: nearest?.name || null,
          lokasi_checkout: nearestCheckout?.name || null,
        };
      })
    );

    const total = countResult[0]?.count || 0;
    const totalPages = Math.ceil(total / limit);

    return {
      data: dataWithLokasi,
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
        id: trxAbsensi.id,
        date: trxAbsensi.date,
        nip: trxAbsensi.nip,
        nama: mstPegawai.nama,
        checkin: trxAbsensi.checkin,
        ci_latitude: trxAbsensi.ci_latitude,
        ci_longitude: trxAbsensi.ci_longitude,
        checkin_photo_url: trxAbsensi.checkin_photo_url,
        checkin_photo_id: trxAbsensi.checkin_photo_id,
        checkout: trxAbsensi.checkout,
        co_latitude: trxAbsensi.co_latitude,
        co_longitude: trxAbsensi.co_longitude,
        working_hours: trxAbsensi.working_hours,
        status: trxAbsensi.status,
        total_overtime: trxAbsensi.total_overtime,
        keterangan: trxAbsensi.keterangan,
        created_at: trxAbsensi.created_at,
        updated_at: trxAbsensi.updated_at,
      })
      .from(trxAbsensi)
      .leftJoin(mstPegawai, eq(trxAbsensi.nip, mstPegawai.nip))
      .where(eq(trxAbsensi.id, id))
      .limit(1);

    if (!result[0]) return null;

    const record = result[0];
    const nearest = await findNearestKabupaten(
      parseFloat(record.ci_latitude as any),
      parseFloat(record.ci_longitude as any)
    );

    const nearestCheckout = record.co_latitude && record.co_longitude
      ? await findNearestKabupaten(
          parseFloat(record.co_latitude as any),
          parseFloat(record.co_longitude as any)
        )
      : null;

    return {
      ...record,
      lokasi_checkin: nearest?.name || null,
      lokasi_checkout: nearestCheckout?.name || null,
    };
  }

  async findByNipAndDate(nip: string, date: string) {
    const result = await db
      .select()
      .from(trxAbsensi)
      .where(and(eq(trxAbsensi.nip, nip), eq(trxAbsensi.date, date)))
      .limit(1);

    return result[0] || null;
  }

  async create(data: CreateAbsensiType & { checkin_photo_url?: string; checkin_photo_id?: string }) {
    const result = await db
      .insert(trxAbsensi)
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
      .select({ checkin: trxAbsensi.checkin })
      .from(trxAbsensi)
      .where(eq(trxAbsensi.id, id))
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
      .update(trxAbsensi)
      .set({
        checkout: checkoutTime,
        co_latitude: data.co_latitude,
        co_longitude: data.co_longitude,
        working_hours: workingHours,
        status: status,
        total_overtime: totalOvertime,
        updated_at: new Date(),
      })
      .where(eq(trxAbsensi.id, id))
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
    if (data.keterangan !== undefined) updateData.keterangan = data.keterangan;

    const result = await db
      .update(trxAbsensi)
      .set(updateData)
      .where(eq(trxAbsensi.id, id))
      .returning();

    return result[0] || null;
  }

  async delete(id: number) {
    const result = await db
      .delete(trxAbsensi)
      .where(eq(trxAbsensi.id, id))
      .returning();

    return result[0] || null;
  }

  async deleteByDate(nip: string, date: string) {
    const result = await db
      .delete(trxAbsensi)
      .where(and(eq(trxAbsensi.nip, nip), eq(trxAbsensi.date, date)))
      .returning();

    return result;
  }

  async deleteAllByDate(date: string) {
    const result = await db
      .delete(trxAbsensi)
      .where(eq(trxAbsensi.date, date))
      .returning();

    return result;
  }
}
