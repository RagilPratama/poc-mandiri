import { eq, ilike, and, or, sql, desc } from 'drizzle-orm';
import { db } from '../db';
import { mstKapal, mstKelompokNelayan } from '../db/schema';

export interface KapalQueryType {
  page?: number;
  limit?: number;
  search?: string;
  kelompok_nelayan_id?: number;
  status_kapal?: string;
}

export class KapalRepository {
  async findAll(query: KapalQueryType) {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const offset = (page - 1) * limit;

    const conditions = [];

    if (query.search) {
      conditions.push(
        or(
          ilike(mstKapal.no_registrasi_kapal, `%${query.search}%`),
          ilike(mstKapal.nama_kapal, `%${query.search}%`)
        )
      );
    }

    if (query.kelompok_nelayan_id) {
      conditions.push(eq(mstKapal.kelompok_nelayan_id, query.kelompok_nelayan_id));
    }

    if (query.status_kapal) {
      conditions.push(eq(mstKapal.status_kapal, query.status_kapal));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const [data, countResult] = await Promise.all([
      db
        .select({
          id: mstKapal.id,
          kelompok_nelayan_id: mstKapal.kelompok_nelayan_id,
          kelompok_nelayan_nama: mstKelompokNelayan.nama_kelompok,
          no_registrasi_kapal: mstKapal.no_registrasi_kapal,
          nama_kapal: mstKapal.nama_kapal,
          jenis_kapal: mstKapal.jenis_kapal,
          ukuran_gt: mstKapal.ukuran_gt,
          ukuran_panjang: mstKapal.ukuran_panjang,
          ukuran_lebar: mstKapal.ukuran_lebar,
          mesin_pk: mstKapal.mesin_pk,
          tahun_pembuatan: mstKapal.tahun_pembuatan,
          pelabuhan_pangkalan: mstKapal.pelabuhan_pangkalan,
          status_kapal: mstKapal.status_kapal,
          created_at: mstKapal.created_at,
          updated_at: mstKapal.updated_at,
        })
        .from(mstKapal)
        .leftJoin(mstKelompokNelayan, eq(mstKapal.kelompok_nelayan_id, mstKelompokNelayan.id))
        .where(whereClause)
        .orderBy(desc(mstKapal.created_at))
        .limit(limit)
        .offset(offset),
      db
        .select({ count: sql<number>`count(*)::int` })
        .from(mstKapal)
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
      .select({
        id: mstKapal.id,
        kelompok_nelayan_id: mstKapal.kelompok_nelayan_id,
        kelompok_nelayan_nama: mstKelompokNelayan.nama_kelompok,
        no_registrasi_kapal: mstKapal.no_registrasi_kapal,
        nama_kapal: mstKapal.nama_kapal,
        jenis_kapal: mstKapal.jenis_kapal,
        ukuran_gt: mstKapal.ukuran_gt,
        ukuran_panjang: mstKapal.ukuran_panjang,
        ukuran_lebar: mstKapal.ukuran_lebar,
        mesin_pk: mstKapal.mesin_pk,
        tahun_pembuatan: mstKapal.tahun_pembuatan,
        pelabuhan_pangkalan: mstKapal.pelabuhan_pangkalan,
        status_kapal: mstKapal.status_kapal,
        created_at: mstKapal.created_at,
        updated_at: mstKapal.updated_at,
      })
      .from(mstKapal)
      .leftJoin(mstKelompokNelayan, eq(mstKapal.kelompok_nelayan_id, mstKelompokNelayan.id))
      .where(eq(mstKapal.id, id))
      .limit(1);

    return result[0] || null;
  }

  async findByKelompokNelayan(kelompokNelayanId: number) {
    const result = await db
      .select()
      .from(mstKapal)
      .where(eq(mstKapal.kelompok_nelayan_id, kelompokNelayanId))
      .orderBy(desc(mstKapal.created_at));

    return result;
  }

  async findByNoRegistrasi(noRegistrasi: string) {
    const result = await db
      .select()
      .from(mstKapal)
      .where(eq(mstKapal.no_registrasi_kapal, noRegistrasi))
      .limit(1);

    return result[0] || null;
  }

  async create(data: typeof mstKapal.$inferInsert) {
    const result = await db
      .insert(mstKapal)
      .values({
        ...data,
        status_kapal: data.status_kapal ?? 'Aktif',
      })
      .returning();

    return result[0];
  }

  async update(id: number, data: Partial<typeof mstKapal.$inferInsert>) {
    const result = await db
      .update(mstKapal)
      .set({
        ...data,
        updated_at: new Date(),
      })
      .where(eq(mstKapal.id, id))
      .returning();

    return result[0] || null;
  }

  async delete(id: number) {
    const result = await db
      .delete(mstKapal)
      .where(eq(mstKapal.id, id))
      .returning();

    return result[0] || null;
  }
}
