import { eq, ilike, and, or, sql, desc } from 'drizzle-orm';
import { db } from '../db';
import { mstKomoditas } from '../db/schema';

export interface KomoditasQueryType {
  page?: number;
  limit?: number;
  search?: string;
  kategori?: string;
  status_aktif?: boolean;
}

export class KomoditasRepository {
  async findAll(query: KomoditasQueryType) {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const offset = (page - 1) * limit;

    const conditions = [];

    if (query.search) {
      conditions.push(
        or(
          ilike(mstKomoditas.kode_komoditas, `%${query.search}%`),
          ilike(mstKomoditas.nama_komoditas, `%${query.search}%`),
          ilike(mstKomoditas.nama_ilmiah, `%${query.search}%`)
        )
      );
    }

    if (query.kategori) {
      conditions.push(eq(mstKomoditas.kategori, query.kategori));
    }

    if (query.status_aktif !== undefined) {
      conditions.push(eq(mstKomoditas.status_aktif, query.status_aktif));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const [data, countResult] = await Promise.all([
      db
        .select()
        .from(mstKomoditas)
        .where(whereClause)
        .orderBy(desc(mstKomoditas.created_at))
        .limit(limit)
        .offset(offset),
      db
        .select({ count: sql<number>`count(*)::int` })
        .from(mstKomoditas)
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
      .from(mstKomoditas)
      .where(eq(mstKomoditas.id, id))
      .limit(1);

    return result[0] || null;
  }

  async findByKode(kode: string) {
    const result = await db
      .select()
      .from(mstKomoditas)
      .where(eq(mstKomoditas.kode_komoditas, kode))
      .limit(1);

    return result[0] || null;
  }

  async create(data: typeof mstKomoditas.$inferInsert) {
    const result = await db
      .insert(mstKomoditas)
      .values({
        ...data,
        status_aktif: data.status_aktif ?? true,
      })
      .returning();

    return result[0];
  }

  async update(id: number, data: Partial<typeof mstKomoditas.$inferInsert>) {
    const result = await db
      .update(mstKomoditas)
      .set({
        ...data,
        updated_at: new Date(),
      })
      .where(eq(mstKomoditas.id, id))
      .returning();

    return result[0] || null;
  }

  async delete(id: number) {
    const result = await db
      .delete(mstKomoditas)
      .where(eq(mstKomoditas.id, id))
      .returning();

    return result[0] || null;
  }
}
