import { eq, ilike, and, or, sql, desc } from 'drizzle-orm';
import { db } from '../db';
import { mstJenisUsaha } from '../db/schema';

export interface JenisUsahaQueryType {
  page?: number;
  limit?: number;
  search?: string;
  kategori?: string;
  status_aktif?: boolean;
}

export class JenisUsahaRepository {
  async findAll(query: JenisUsahaQueryType) {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const offset = (page - 1) * limit;

    const conditions = [];

    if (query.search) {
      conditions.push(
        or(
          ilike(mstJenisUsaha.kode_jenis_usaha, `%${query.search}%`),
          ilike(mstJenisUsaha.nama_jenis_usaha, `%${query.search}%`)
        )
      );
    }

    if (query.kategori) {
      conditions.push(eq(mstJenisUsaha.kategori, query.kategori));
    }

    if (query.status_aktif !== undefined) {
      conditions.push(eq(mstJenisUsaha.status_aktif, query.status_aktif));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const [data, countResult] = await Promise.all([
      db
        .select()
        .from(mstJenisUsaha)
        .where(whereClause)
        .orderBy(desc(mstJenisUsaha.created_at))
        .limit(limit)
        .offset(offset),
      db
        .select({ count: sql<number>`count(*)::int` })
        .from(mstJenisUsaha)
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
      .from(mstJenisUsaha)
      .where(eq(mstJenisUsaha.id, id))
      .limit(1);

    return result[0] || null;
  }

  async findByKode(kode: string) {
    const result = await db
      .select()
      .from(mstJenisUsaha)
      .where(eq(mstJenisUsaha.kode_jenis_usaha, kode))
      .limit(1);

    return result[0] || null;
  }

  async create(data: typeof mstJenisUsaha.$inferInsert) {
    const result = await db
      .insert(mstJenisUsaha)
      .values({
        ...data,
        status_aktif: data.status_aktif ?? true,
      })
      .returning();

    return result[0];
  }

  async update(id: number, data: Partial<typeof mstJenisUsaha.$inferInsert>) {
    const result = await db
      .update(mstJenisUsaha)
      .set({
        ...data,
        updated_at: new Date(),
      })
      .where(eq(mstJenisUsaha.id, id))
      .returning();

    return result[0] || null;
  }

  async delete(id: number) {
    const result = await db
      .delete(mstJenisUsaha)
      .where(eq(mstJenisUsaha.id, id))
      .returning();

    return result[0] || null;
  }
}
