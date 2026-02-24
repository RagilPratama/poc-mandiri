import { eq, ilike, and, or, sql, desc } from 'drizzle-orm';
import { db } from '../db';
import { mstIki, mstIku } from '../db/schema';

export interface IkiQueryType {
  page?: number;
  limit?: number;
  search?: string;
  iku_id?: number;
  is_active?: boolean;
}

export class IkiRepository {
  async findAll(query: IkiQueryType) {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const offset = (page - 1) * limit;

    const conditions = [];

    if (query.search) {
      conditions.push(
        or(
          ilike(mstIki.kode_iki, `%${query.search}%`),
          ilike(mstIki.nama_iki, `%${query.search}%`)
        )
      );
    }

    if (query.iku_id) {
      conditions.push(eq(mstIki.iku_id, query.iku_id));
    }

    if (query.is_active !== undefined) {
      conditions.push(eq(mstIki.is_active, query.is_active));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const [data, countResult] = await Promise.all([
      db
        .select({
          id: mstIki.id,
          iku_id: mstIki.iku_id,
          iku_kode: mstIku.kode_iku,
          iku_nama: mstIku.nama_iku,
          kode_iki: mstIki.kode_iki,
          nama_iki: mstIki.nama_iki,
          deskripsi: mstIki.deskripsi,
          target: mstIki.target,
          satuan: mstIki.satuan,
          is_active: mstIki.is_active,
          created_at: mstIki.created_at,
          updated_at: mstIki.updated_at,
        })
        .from(mstIki)
        .leftJoin(mstIku, eq(mstIki.iku_id, mstIku.id))
        .where(whereClause)
        .orderBy(mstIki.kode_iki)
        .limit(limit)
        .offset(offset),
      db
        .select({ count: sql<number>`count(*)::int` })
        .from(mstIki)
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
      .select({
        id: mstIki.id,
        iku_id: mstIki.iku_id,
        iku_kode: mstIku.kode_iku,
        iku_nama: mstIku.nama_iku,
        kode_iki: mstIki.kode_iki,
        nama_iki: mstIki.nama_iki,
        deskripsi: mstIki.deskripsi,
        target: mstIki.target,
        satuan: mstIki.satuan,
        is_active: mstIki.is_active,
        created_at: mstIki.created_at,
        updated_at: mstIki.updated_at,
      })
      .from(mstIki)
      .leftJoin(mstIku, eq(mstIki.iku_id, mstIku.id))
      .where(eq(mstIki.id, id))
      .limit(1);

    return result[0] || null;
  }

  async findByKode(kode: string) {
    const result = await db
      .select()
      .from(mstIki)
      .where(eq(mstIki.kode_iki, kode))
      .limit(1);

    return result[0] || null;
  }

  async create(data: typeof mstIki.$inferInsert) {
    const result = await db
      .insert(mstIki)
      .values({
        ...data,
        is_active: data.is_active ?? true,
      })
      .returning();

    return result[0];
  }

  async update(id: number, data: Partial<typeof mstIki.$inferInsert>) {
    const result = await db
      .update(mstIki)
      .set({
        ...data,
        updated_at: new Date(),
      })
      .where(eq(mstIki.id, id))
      .returning();

    return result[0] || null;
  }

  async delete(id: number) {
    const result = await db
      .delete(mstIki)
      .where(eq(mstIki.id, id))
      .returning();

    return result[0] || null;
  }
}
