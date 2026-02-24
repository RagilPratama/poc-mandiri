import { db } from '../db';
import { mstIki } from '../db/schema';
import { eq, and, like, sql, or } from 'drizzle-orm';
import type { CreateIkiType, UpdateIkiType, IkiQueryType } from '../types/iki';

export class IkiRepository {
  async findAll(query: IkiQueryType) {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const offset = (page - 1) * limit;

    const conditions = [];

    if (query.kategori_iki) {
      conditions.push(eq(mstIki.kategori_iki, query.kategori_iki));
    }

    if (query.search) {
      const searchConditions = [];
      searchConditions.push(like(mstIki.kategori_iki, `%${query.search}%`));
      searchConditions.push(like(mstIki.detail_iki, `%${query.search}%`));
      if (searchConditions.length > 0) {
        conditions.push(or(...searchConditions));
      }
    }

    conditions.push(eq(mstIki.is_active, true));

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const data = await db
      .select()
      .from(mstIki)
      .where(whereClause)
      .orderBy(mstIki.kategori_iki)
      .limit(limit)
      .offset(offset);

    const countResult = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(mstIki)
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
      .from(mstIki)
      .where(eq(mstIki.id, id))
      .limit(1);

    return result[0] || null;
  }

  async create(data: CreateIkiType) {
    const result = await db
      .insert(mstIki)
      .values(data)
      .returning();

    return result[0];
  }

  async update(id: number, data: UpdateIkiType) {
    const result = await db
      .update(mstIki)
      .set({
        ...data,
        updated_at: new Date(),
      })
      .where(eq(mstIki.id, id))
      .returning();

    return result[0];
  }

  async delete(id: number) {
    const result = await db
      .update(mstIki)
      .set({
        is_active: false,
        updated_at: new Date(),
      })
      .where(eq(mstIki.id, id))
      .returning();

    return result[0];
  }
}
