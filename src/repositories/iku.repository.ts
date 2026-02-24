import { eq, ilike, and, or, sql, desc } from 'drizzle-orm';
import { db } from '../db';
import { mstIku } from '../db/schema';

export interface IkuQueryType {
  page?: number;
  limit?: number;
  search?: string;
  tahun?: number;
  is_active?: boolean;
}

export class IkuRepository {
  async findAll(query: IkuQueryType) {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const offset = (page - 1) * limit;

    const conditions = [];

    if (query.search) {
      conditions.push(
        or(
          ilike(mstIku.kode_iku, `%${query.search}%`),
          ilike(mstIku.nama_iku, `%${query.search}%`)
        )
      );
    }

    if (query.tahun) {
      conditions.push(eq(mstIku.tahun, query.tahun));
    }

    if (query.is_active !== undefined) {
      conditions.push(eq(mstIku.is_active, query.is_active));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const [data, countResult] = await Promise.all([
      db
        .select()
        .from(mstIku)
        .where(whereClause)
        .orderBy(desc(mstIku.tahun), mstIku.kode_iku)
        .limit(limit)
        .offset(offset),
      db
        .select({ count: sql<number>`count(*)::int` })
        .from(mstIku)
        .where(whereClause),
    ]);

    const total = countResult[0]?.count || 0;

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
      .from(mstIku)
      .where(eq(mstIku.id, id))
      .limit(1);

    return result[0] || null;
  }

  async findByKode(kode: string) {
    const result = await db
      .select()
      .from(mstIku)
      .where(eq(mstIku.kode_iku, kode))
      .limit(1);

    return result[0] || null;
  }

  async create(data: typeof mstIku.$inferInsert) {
    const result = await db
      .insert(mstIku)
      .values({
        ...data,
        is_active: data.is_active ?? true,
      })
      .returning();

    return result[0];
  }

  async update(id: number, data: Partial<typeof mstIku.$inferInsert>) {
    const result = await db
      .update(mstIku)
      .set({
        ...data,
        updated_at: new Date(),
      })
      .where(eq(mstIku.id, id))
      .returning();

    return result[0] || null;
  }

  async delete(id: number) {
    const result = await db
      .delete(mstIku)
      .where(eq(mstIku.id, id))
      .returning();

    return result[0] || null;
  }
}
