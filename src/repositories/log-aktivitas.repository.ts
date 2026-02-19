import { db } from '../db';
import { trxLogAktivitas } from '../db/schema';
import { desc, eq, and, gte, lte, like, or, sql } from 'drizzle-orm';

export class LogAktivitasRepository {
  async findAll(query: any) {
    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 10;
    const offset = (page - 1) * limit;

    let conditions = [];

    // Filter by modul
    if (query.modul) {
      conditions.push(eq(trxLogAktivitas.modul, query.modul));
    }

    // Filter by aktivitas
    if (query.aktivitas) {
      conditions.push(eq(trxLogAktivitas.aktivitas, query.aktivitas));
    }

    // Filter by status
    if (query.status) {
      conditions.push(eq(trxLogAktivitas.status, query.status));
    }

    // Filter by pegawai_id
    if (query.pegawai_id) {
      conditions.push(eq(trxLogAktivitas.pegawai_id, parseInt(query.pegawai_id)));
    }

    // Filter by user_id
    if (query.user_id) {
      conditions.push(eq(trxLogAktivitas.user_id, query.user_id));
    }

    // Filter by date range
    if (query.start_date) {
      conditions.push(gte(trxLogAktivitas.created_at, new Date(query.start_date)));
    }
    if (query.end_date) {
      conditions.push(lte(trxLogAktivitas.created_at, new Date(query.end_date)));
    }

    // Search
    if (query.search) {
      conditions.push(
        or(
          like(trxLogAktivitas.deskripsi, `%${query.search}%`),
          like(trxLogAktivitas.username, `%${query.search}%`),
          like(trxLogAktivitas.email, `%${query.search}%`)
        )
      );
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const [data, totalResult] = await Promise.all([
      db
        .select()
        .from(trxLogAktivitas)
        .where(whereClause)
        .orderBy(desc(trxLogAktivitas.created_at))
        .limit(limit)
        .offset(offset),
      db
        .select({ count: sql<number>`count(*)` })
        .from(trxLogAktivitas)
        .where(whereClause),
    ]);

    const total = Number(totalResult[0]?.count || 0);

    return {
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findById(id: number) {
    const result = await db
      .select()
      .from(trxLogAktivitas)
      .where(eq(trxLogAktivitas.id, id))
      .limit(1);

    return result[0] || null;
  }

  async getStatistics(query: any) {
    // Get activity statistics by modul
    const byModul = await db
      .select({
        modul: trxLogAktivitas.modul,
        count: sql<number>`count(*)`,
      })
      .from(trxLogAktivitas)
      .groupBy(trxLogAktivitas.modul)
      .orderBy(desc(sql`count(*)`));

    // Get activity statistics by aktivitas
    const byAktivitas = await db
      .select({
        aktivitas: trxLogAktivitas.aktivitas,
        count: sql<number>`count(*)`,
      })
      .from(trxLogAktivitas)
      .groupBy(trxLogAktivitas.aktivitas)
      .orderBy(desc(sql`count(*)`));

    // Get activity statistics by status
    const byStatus = await db
      .select({
        status: trxLogAktivitas.status,
        count: sql<number>`count(*)`,
      })
      .from(trxLogAktivitas)
      .groupBy(trxLogAktivitas.status);

    return {
      byModul,
      byAktivitas,
      byStatus,
    };
  }
}
