import { db } from '../db';
import { mstIku } from '../db/schema';
import { eq, and, like, sql, desc, or } from 'drizzle-orm';
import type { CreateIkuType, UpdateIkuType, IkuQueryType } from '../types/iku';

export class IkuRepository {
  async findAll(query: IkuQueryType) {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const offset = (page - 1) * limit;

    const conditions = [];

    if (query.tahun) {
      conditions.push(eq(mstIku.tahun, query.tahun));
    }

    if (query.search) {
      const searchConditions = [];
      searchConditions.push(like(mstIku.level, `%${query.search}%`));
      searchConditions.push(like(mstIku.deskripsi, `%${query.search}%`));
      if (searchConditions.length > 0) {
        conditions.push(or(...searchConditions));
      }
    }

    conditions.push(eq(mstIku.is_active, true));

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const data = await db
      .select()
      .from(mstIku)
      .where(whereClause)
      .orderBy(desc(mstIku.tahun), mstIku.level)
      .limit(limit)
      .offset(offset);

    const countResult = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(mstIku)
      .where(whereClause);

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

  async create(data: CreateIkuType) {
    const result = await db
      .insert(mstIku)
      .values(data)
      .returning();

    return result[0];
  }

  async update(id: number, data: UpdateIkuType) {
    const result = await db
      .update(mstIku)
      .set({
        ...data,
        updated_at: new Date(),
      })
      .where(eq(mstIku.id, id))
      .returning();

    return result[0];
  }

  async delete(id: number) {
    const result = await db
      .update(mstIku)
      .set({
        is_active: false,
        updated_at: new Date(),
      })
      .where(eq(mstIku.id, id))
      .returning();

    return result[0];
  }
}
