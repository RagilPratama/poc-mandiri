import { eq, ilike, and, or, sql, desc } from 'drizzle-orm';
import { db } from '../db';
import { mstAlatTangkap } from '../db/schema';

export interface AlatTangkapQueryType {
  page?: number;
  limit?: number;
  search?: string;
  jenis?: string;
  status_aktif?: boolean;
}

export class AlatTangkapRepository {
  async findAll(query: AlatTangkapQueryType) {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const offset = (page - 1) * limit;

    const conditions = [];

    if (query.search) {
      conditions.push(
        or(
          ilike(mstAlatTangkap.kode_alat_tangkap, `%${query.search}%`),
          ilike(mstAlatTangkap.nama_alat_tangkap, `%${query.search}%`)
        )
      );
    }

    if (query.jenis) {
      conditions.push(eq(mstAlatTangkap.jenis, query.jenis));
    }

    if (query.status_aktif !== undefined) {
      conditions.push(eq(mstAlatTangkap.status_aktif, query.status_aktif));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const [data, countResult] = await Promise.all([
      db
        .select()
        .from(mstAlatTangkap)
        .where(whereClause)
        .orderBy(desc(mstAlatTangkap.created_at))
        .limit(limit)
        .offset(offset),
      db
        .select({ count: sql<number>`count(*)::int` })
        .from(mstAlatTangkap)
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
      .from(mstAlatTangkap)
      .where(eq(mstAlatTangkap.id, id))
      .limit(1);

    return result[0] || null;
  }

  async findByKode(kode: string) {
    const result = await db
      .select()
      .from(mstAlatTangkap)
      .where(eq(mstAlatTangkap.kode_alat_tangkap, kode))
      .limit(1);

    return result[0] || null;
  }

  async create(data: typeof mstAlatTangkap.$inferInsert) {
    const result = await db
      .insert(mstAlatTangkap)
      .values({
        ...data,
        status_aktif: data.status_aktif ?? true,
      })
      .returning();

    return result[0];
  }

  async update(id: number, data: Partial<typeof mstAlatTangkap.$inferInsert>) {
    const result = await db
      .update(mstAlatTangkap)
      .set({
        ...data,
        updated_at: new Date(),
      })
      .where(eq(mstAlatTangkap.id, id))
      .returning();

    return result[0] || null;
  }

  async delete(id: number) {
    const result = await db
      .delete(mstAlatTangkap)
      .where(eq(mstAlatTangkap.id, id))
      .returning();

    return result[0] || null;
  }
}
