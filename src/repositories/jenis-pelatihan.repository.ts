import { eq, ilike, and, or, sql, desc } from 'drizzle-orm';
import { db } from '../db';
import { mstJenisPelatihan } from '../db/schema';

export interface JenisPelatihanQueryType {
  page?: number;
  limit?: number;
  search?: string;
  kategori?: string;
  status_aktif?: boolean;
}

export class JenisPelatihanRepository {
  async findAll(query: JenisPelatihanQueryType) {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const offset = (page - 1) * limit;

    const conditions = [];

    if (query.search) {
      conditions.push(
        or(
          ilike(mstJenisPelatihan.kode_jenis_pelatihan, `%${query.search}%`),
          ilike(mstJenisPelatihan.nama_jenis_pelatihan, `%${query.search}%`)
        )
      );
    }

    if (query.kategori) {
      conditions.push(eq(mstJenisPelatihan.kategori, query.kategori));
    }

    if (query.status_aktif !== undefined) {
      conditions.push(eq(mstJenisPelatihan.status_aktif, query.status_aktif));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const [data, countResult] = await Promise.all([
      db
        .select()
        .from(mstJenisPelatihan)
        .where(whereClause)
        .orderBy(desc(mstJenisPelatihan.created_at))
        .limit(limit)
        .offset(offset),
      db
        .select({ count: sql<number>`count(*)::int` })
        .from(mstJenisPelatihan)
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
      .from(mstJenisPelatihan)
      .where(eq(mstJenisPelatihan.id, id))
      .limit(1);

    return result[0] || null;
  }

  async findByKode(kode: string) {
    const result = await db
      .select()
      .from(mstJenisPelatihan)
      .where(eq(mstJenisPelatihan.kode_jenis_pelatihan, kode))
      .limit(1);

    return result[0] || null;
  }

  async create(data: typeof mstJenisPelatihan.$inferInsert) {
    const result = await db
      .insert(mstJenisPelatihan)
      .values({
        ...data,
        status_aktif: data.status_aktif ?? true,
      })
      .returning();

    return result[0];
  }

  async update(id: number, data: Partial<typeof mstJenisPelatihan.$inferInsert>) {
    const result = await db
      .update(mstJenisPelatihan)
      .set({
        ...data,
        updated_at: new Date(),
      })
      .where(eq(mstJenisPelatihan.id, id))
      .returning();

    return result[0] || null;
  }

  async delete(id: number) {
    const result = await db
      .delete(mstJenisPelatihan)
      .where(eq(mstJenisPelatihan.id, id))
      .returning();

    return result[0] || null;
  }
}
