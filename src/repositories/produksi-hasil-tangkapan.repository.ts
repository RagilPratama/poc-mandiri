import { eq, and, gte, lte, sql, desc, or, ilike } from 'drizzle-orm';
import { db } from '../db';
import { trxProduksiHasilTangkapan, mstKelompokNelayan, mstKapal, mstKomoditas, mstAlatTangkap } from '../db/schema';

export interface ProduksiHasilTangkapanQueryType {
  page?: number;
  limit?: number;
  search?: string;
  kelompok_nelayan_id?: number;
  komoditas_id?: number;
  tanggal_from?: string;
  tanggal_to?: string;
}

export class ProduksiHasilTangkapanRepository {
  async findAll(query: ProduksiHasilTangkapanQueryType) {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const offset = (page - 1) * limit;

    const conditions = [];

    if (query.search) {
      conditions.push(
        or(
          ilike(mstKelompokNelayan.nama_kelompok, `%${query.search}%`),
          ilike(mstKomoditas.nama_komoditas, `%${query.search}%`)
        )
      );
    }

    if (query.kelompok_nelayan_id) {
      conditions.push(eq(trxProduksiHasilTangkapan.kelompok_nelayan_id, query.kelompok_nelayan_id));
    }

    if (query.komoditas_id) {
      conditions.push(eq(trxProduksiHasilTangkapan.komoditas_id, query.komoditas_id));
    }

    if (query.tanggal_from) {
      conditions.push(gte(trxProduksiHasilTangkapan.tanggal_produksi, query.tanggal_from));
    }

    if (query.tanggal_to) {
      conditions.push(lte(trxProduksiHasilTangkapan.tanggal_produksi, query.tanggal_to));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const [data, countResult] = await Promise.all([
      db
        .select({
          id: trxProduksiHasilTangkapan.id,
          kelompok_nelayan_id: trxProduksiHasilTangkapan.kelompok_nelayan_id,
          kelompok_nelayan_nama: mstKelompokNelayan.nama_kelompok,
          kapal_id: trxProduksiHasilTangkapan.kapal_id,
          kapal_nama: mstKapal.nama_kapal,
          tanggal_produksi: trxProduksiHasilTangkapan.tanggal_produksi,
          komoditas_id: trxProduksiHasilTangkapan.komoditas_id,
          komoditas_nama: mstKomoditas.nama_komoditas,
          alat_tangkap_id: trxProduksiHasilTangkapan.alat_tangkap_id,
          alat_tangkap_nama: mstAlatTangkap.nama_alat_tangkap,
          jumlah_produksi: trxProduksiHasilTangkapan.jumlah_produksi,
          satuan: trxProduksiHasilTangkapan.satuan,
          harga_jual: trxProduksiHasilTangkapan.harga_jual,
          total_nilai: trxProduksiHasilTangkapan.total_nilai,
          lokasi_penangkapan: trxProduksiHasilTangkapan.lokasi_penangkapan,
          koordinat_latitude: trxProduksiHasilTangkapan.koordinat_latitude,
          koordinat_longitude: trxProduksiHasilTangkapan.koordinat_longitude,
          keterangan: trxProduksiHasilTangkapan.keterangan,
          created_at: trxProduksiHasilTangkapan.created_at,
          updated_at: trxProduksiHasilTangkapan.updated_at,
        })
        .from(trxProduksiHasilTangkapan)
        .leftJoin(mstKelompokNelayan, eq(trxProduksiHasilTangkapan.kelompok_nelayan_id, mstKelompokNelayan.id))
        .leftJoin(mstKapal, eq(trxProduksiHasilTangkapan.kapal_id, mstKapal.id))
        .leftJoin(mstKomoditas, eq(trxProduksiHasilTangkapan.komoditas_id, mstKomoditas.id))
        .leftJoin(mstAlatTangkap, eq(trxProduksiHasilTangkapan.alat_tangkap_id, mstAlatTangkap.id))
        .where(whereClause)
        .orderBy(desc(trxProduksiHasilTangkapan.tanggal_produksi))
        .limit(limit)
        .offset(offset),
      db
        .select({ count: sql<number>`count(*)::int` })
        .from(trxProduksiHasilTangkapan)
        .leftJoin(mstKelompokNelayan, eq(trxProduksiHasilTangkapan.kelompok_nelayan_id, mstKelompokNelayan.id))
        .leftJoin(mstKomoditas, eq(trxProduksiHasilTangkapan.komoditas_id, mstKomoditas.id))
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
        id: trxProduksiHasilTangkapan.id,
        kelompok_nelayan_id: trxProduksiHasilTangkapan.kelompok_nelayan_id,
        kelompok_nelayan_nama: mstKelompokNelayan.nama_kelompok,
        kapal_id: trxProduksiHasilTangkapan.kapal_id,
        kapal_nama: mstKapal.nama_kapal,
        tanggal_produksi: trxProduksiHasilTangkapan.tanggal_produksi,
        komoditas_id: trxProduksiHasilTangkapan.komoditas_id,
        komoditas_nama: mstKomoditas.nama_komoditas,
        alat_tangkap_id: trxProduksiHasilTangkapan.alat_tangkap_id,
        alat_tangkap_nama: mstAlatTangkap.nama_alat_tangkap,
        jumlah_produksi: trxProduksiHasilTangkapan.jumlah_produksi,
        satuan: trxProduksiHasilTangkapan.satuan,
        harga_jual: trxProduksiHasilTangkapan.harga_jual,
        total_nilai: trxProduksiHasilTangkapan.total_nilai,
        lokasi_penangkapan: trxProduksiHasilTangkapan.lokasi_penangkapan,
        koordinat_latitude: trxProduksiHasilTangkapan.koordinat_latitude,
        koordinat_longitude: trxProduksiHasilTangkapan.koordinat_longitude,
        keterangan: trxProduksiHasilTangkapan.keterangan,
        created_at: trxProduksiHasilTangkapan.created_at,
        updated_at: trxProduksiHasilTangkapan.updated_at,
      })
      .from(trxProduksiHasilTangkapan)
      .leftJoin(mstKelompokNelayan, eq(trxProduksiHasilTangkapan.kelompok_nelayan_id, mstKelompokNelayan.id))
      .leftJoin(mstKapal, eq(trxProduksiHasilTangkapan.kapal_id, mstKapal.id))
      .leftJoin(mstKomoditas, eq(trxProduksiHasilTangkapan.komoditas_id, mstKomoditas.id))
      .leftJoin(mstAlatTangkap, eq(trxProduksiHasilTangkapan.alat_tangkap_id, mstAlatTangkap.id))
      .where(eq(trxProduksiHasilTangkapan.id, id))
      .limit(1);

    return result[0] || null;
  }

  async findByKelompokNelayan(kelompokNelayanId: number) {
    const result = await db
      .select()
      .from(trxProduksiHasilTangkapan)
      .where(eq(trxProduksiHasilTangkapan.kelompok_nelayan_id, kelompokNelayanId))
      .orderBy(desc(trxProduksiHasilTangkapan.tanggal_produksi));

    return result;
  }

  async create(data: typeof trxProduksiHasilTangkapan.$inferInsert) {
    const result = await db
      .insert(trxProduksiHasilTangkapan)
      .values(data)
      .returning();

    return result[0];
  }

  async update(id: number, data: Partial<typeof trxProduksiHasilTangkapan.$inferInsert>) {
    const result = await db
      .update(trxProduksiHasilTangkapan)
      .set({
        ...data,
        updated_at: new Date(),
      })
      .where(eq(trxProduksiHasilTangkapan.id, id))
      .returning();

    return result[0] || null;
  }

  async delete(id: number) {
    const result = await db
      .delete(trxProduksiHasilTangkapan)
      .where(eq(trxProduksiHasilTangkapan.id, id))
      .returning();

    return result[0] || null;
  }
}
