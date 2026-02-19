import { eq, ilike, and, or, sql, desc } from 'drizzle-orm';
import { db } from '../db';
import { mstJenisBantuan } from '../db/schema';

export interface JenisBantuanQueryType {
  page?: number;
  limit?: number;
  search?: string;
  kategori?: string;
  status_aktif?: boolean;
}

export class JenisBantuanRepository {
  async findAll(query: JenisBantuanQueryType) {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const offset = (page - 1) * limit;

    const conditions = [];

    if (query.search) {
      conditions.push(
        or(
          ilike(mstJenisBantuan.kode_jenis_bantuan, `%${query.search}%`),
          ilike(mstJenisBantuan.nama_jenis_bantuan, `%${query.search}%`)
        )
      );
    }

    if (query.kategori) {
      conditions.push(eq(mstJenisBantuan.kategori, query.kategori));
    }

    if (query.status_aktif !== undefined) {
      conditions.push(eq(mstJenisBantuan.status_aktif, query.status_aktif));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const [data, countResult] = await Promise.all([
      db
        .select()
        .from(mstJenisBantuan)
        .where(whereClause)
        .orderBy(desc(mstJenisBantuan.created_at))
        .limit(limit)
        .offset(offset),
      db
        .select({ count: sql<number>`count(*)::int` })
        .from(mstJenisBantuan)
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
      .select()
      .from(mstJenisBantuan)
      .where(eq(mstJenisBantuan.id, id))
      .limit(1);

    return result[0] || null;
  }

  async findByKode(kode: string) {
    const result = await db
      .select()
      .from(mstJenisBantuan)
      .where(eq(mstJenisBantuan.kode_jenis_bantuan, kode))
      .limit(1);

    return result[0] || null;
  }

  async create(data: typeof mstJenisBantuan.$inferInsert) {
    const result = await db
      .insert(mstJenisBantuan)
      .values({
        ...data,
        status_aktif: data.status_aktif ?? true,
      })
      .returning();

    return result[0];
  }

  async update(id: number, data: Partial<typeof mstJenisBantuan.$inferInsert>) {
    const result = await db
      .update(mstJenisBantuan)
      .set({
        ...data,
        updated_at: new Date(),
      })
      .where(eq(mstJenisBantuan.id, id))
      .returning();

    return result[0] || null;
  }

  async delete(id: number) {
    const result = await db
      .delete(mstJenisBantuan)
      .where(eq(mstJenisBantuan.id, id))
      .returning();

    return result[0] || null;
  }
}
