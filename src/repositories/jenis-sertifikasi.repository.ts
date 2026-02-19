import { eq, ilike, and, or, sql, desc } from 'drizzle-orm';
import { db } from '../db';
import { mstJenisSertifikasi } from '../db/schema';

export interface JenisSertifikasiQueryType {
  page?: number;
  limit?: number;
  search?: string;
  kategori?: string;
  status_aktif?: boolean;
}

export class JenisSertifikasiRepository {
  async findAll(query: JenisSertifikasiQueryType) {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const offset = (page - 1) * limit;

    const conditions = [];

    if (query.search) {
      conditions.push(
        or(
          ilike(mstJenisSertifikasi.kode_jenis_sertifikasi, `%${query.search}%`),
          ilike(mstJenisSertifikasi.nama_jenis_sertifikasi, `%${query.search}%`)
        )
      );
    }

    if (query.kategori) {
      conditions.push(eq(mstJenisSertifikasi.kategori, query.kategori));
    }

    if (query.status_aktif !== undefined) {
      conditions.push(eq(mstJenisSertifikasi.status_aktif, query.status_aktif));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const [data, countResult] = await Promise.all([
      db
        .select()
        .from(mstJenisSertifikasi)
        .where(whereClause)
        .orderBy(desc(mstJenisSertifikasi.created_at))
        .limit(limit)
        .offset(offset),
      db
        .select({ count: sql<number>`count(*)::int` })
        .from(mstJenisSertifikasi)
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
      .from(mstJenisSertifikasi)
      .where(eq(mstJenisSertifikasi.id, id))
      .limit(1);

    return result[0] || null;
  }

  async findByKode(kode: string) {
    const result = await db
      .select()
      .from(mstJenisSertifikasi)
      .where(eq(mstJenisSertifikasi.kode_jenis_sertifikasi, kode))
      .limit(1);

    return result[0] || null;
  }

  async create(data: typeof mstJenisSertifikasi.$inferInsert) {
    const result = await db
      .insert(mstJenisSertifikasi)
      .values({
        ...data,
        status_aktif: data.status_aktif ?? true,
      })
      .returning();

    return result[0];
  }

  async update(id: number, data: Partial<typeof mstJenisSertifikasi.$inferInsert>) {
    const result = await db
      .update(mstJenisSertifikasi)
      .set({
        ...data,
        updated_at: new Date(),
      })
      .where(eq(mstJenisSertifikasi.id, id))
      .returning();

    return result[0] || null;
  }

  async delete(id: number) {
    const result = await db
      .delete(mstJenisSertifikasi)
      .where(eq(mstJenisSertifikasi.id, id))
      .returning();

    return result[0] || null;
  }
}
