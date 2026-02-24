import { db } from '../db';
import { trxKegiatanHarian, mstPegawai, mstKelompokNelayan, mstIki } from '../db/schema';
import { eq, and, gte, lte, like, sql, desc, or } from 'drizzle-orm';
import type { CreateKegiatanHarianType, UpdateKegiatanHarianType, KegiatanHarianQueryType } from '../types/kegiatan-harian';

export class KegiatanHarianRepository {
  async findAll(query: KegiatanHarianQueryType) {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const offset = (page - 1) * limit;

    const conditions = [];

    if (query.pegawai_id) {
      conditions.push(eq(trxKegiatanHarian.pegawai_id, query.pegawai_id));
    }

    if (query.kelompok_nelayan_id) {
      conditions.push(eq(trxKegiatanHarian.kelompok_nelayan_id, query.kelompok_nelayan_id));
    }

    if (query.tanggal) {
      conditions.push(eq(trxKegiatanHarian.tanggal, query.tanggal));
    }

    if (query.bulan) {
      const [year, month] = query.bulan.split('-');
      const startDate = `${year}-${month}-01`;
      const endDate = `${year}-${month}-31`;
      conditions.push(gte(trxKegiatanHarian.tanggal, startDate));
      conditions.push(lte(trxKegiatanHarian.tanggal, endDate));
    }

    if (query.tahun) {
      const startDate = `${query.tahun}-01-01`;
      const endDate = `${query.tahun}-12-31`;
      conditions.push(gte(trxKegiatanHarian.tanggal, startDate));
      conditions.push(lte(trxKegiatanHarian.tanggal, endDate));
    }

    if (query.search) {
      const searchConditions = [];
      if (query.search) {
        searchConditions.push(like(trxKegiatanHarian.rencana_kerja, `%${query.search}%`));
        searchConditions.push(like(trxKegiatanHarian.detail_keterangan, `%${query.search}%`));
        searchConditions.push(like(trxKegiatanHarian.lokasi_kegiatan, `%${query.search}%`));
      }
      if (searchConditions.length > 0) {
        conditions.push(or(...searchConditions));
      }
    }

    conditions.push(eq(trxKegiatanHarian.is_active, true));

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const data = await db
      .select({
        id: trxKegiatanHarian.id,
        pegawai_id: trxKegiatanHarian.pegawai_id,
        pegawai_nama: mstPegawai.nama,
        pegawai_nip: mstPegawai.nip,
        kelompok_nelayan_id: trxKegiatanHarian.kelompok_nelayan_id,
        kelompok_nelayan_nama: mstKelompokNelayan.nama_kelompok,
        tanggal: trxKegiatanHarian.tanggal,
        lokasi_kegiatan: trxKegiatanHarian.lokasi_kegiatan,
        iki_id: trxKegiatanHarian.iki_id,
        iki_kategori: mstIki.kategori_iki,
        iki_detail: mstIki.detail_iki,
        rencana_kerja: trxKegiatanHarian.rencana_kerja,
        detail_keterangan: trxKegiatanHarian.detail_keterangan,
        foto_kegiatan: trxKegiatanHarian.foto_kegiatan,
        is_active: trxKegiatanHarian.is_active,
        created_at: trxKegiatanHarian.created_at,
        updated_at: trxKegiatanHarian.updated_at,
      })
      .from(trxKegiatanHarian)
      .leftJoin(mstPegawai, eq(trxKegiatanHarian.pegawai_id, mstPegawai.id))
      .leftJoin(mstKelompokNelayan, eq(trxKegiatanHarian.kelompok_nelayan_id, mstKelompokNelayan.id))
      .leftJoin(mstIki, eq(trxKegiatanHarian.iki_id, mstIki.id))
      .where(whereClause)
      .orderBy(desc(trxKegiatanHarian.tanggal), desc(trxKegiatanHarian.created_at))
      .limit(limit)
      .offset(offset);

    const countResult = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(trxKegiatanHarian)
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
      .select({
        id: trxKegiatanHarian.id,
        pegawai_id: trxKegiatanHarian.pegawai_id,
        pegawai_nama: mstPegawai.nama,
        pegawai_nip: mstPegawai.nip,
        kelompok_nelayan_id: trxKegiatanHarian.kelompok_nelayan_id,
        kelompok_nelayan_nama: mstKelompokNelayan.nama_kelompok,
        tanggal: trxKegiatanHarian.tanggal,
        lokasi_kegiatan: trxKegiatanHarian.lokasi_kegiatan,
        iki_id: trxKegiatanHarian.iki_id,
        iki_kategori: mstIki.kategori_iki,
        iki_detail: mstIki.detail_iki,
        rencana_kerja: trxKegiatanHarian.rencana_kerja,
        detail_keterangan: trxKegiatanHarian.detail_keterangan,
        foto_kegiatan: trxKegiatanHarian.foto_kegiatan,
        is_active: trxKegiatanHarian.is_active,
        created_at: trxKegiatanHarian.created_at,
        updated_at: trxKegiatanHarian.updated_at,
      })
      .from(trxKegiatanHarian)
      .leftJoin(mstPegawai, eq(trxKegiatanHarian.pegawai_id, mstPegawai.id))
      .leftJoin(mstKelompokNelayan, eq(trxKegiatanHarian.kelompok_nelayan_id, mstKelompokNelayan.id))
      .leftJoin(mstIki, eq(trxKegiatanHarian.iki_id, mstIki.id))
      .where(eq(trxKegiatanHarian.id, id))
      .limit(1);

    return result[0] || null;
  }

  async create(data: CreateKegiatanHarianType) {
    const result = await db
      .insert(trxKegiatanHarian)
      .values(data)
      .returning();

    return result[0];
  }

  async update(id: number, data: UpdateKegiatanHarianType) {
    const result = await db
      .update(trxKegiatanHarian)
      .set({
        ...data,
        updated_at: new Date(),
      })
      .where(eq(trxKegiatanHarian.id, id))
      .returning();

    return result[0];
  }

  async delete(id: number) {
    const result = await db
      .update(trxKegiatanHarian)
      .set({
        is_active: false,
        updated_at: new Date(),
      })
      .where(eq(trxKegiatanHarian.id, id))
      .returning();

    return result[0];
  }

  async getKegiatanByMonth(pegawai_id: number, year: number, month: number) {
    // Get last day of month
    const lastDay = new Date(year, month, 0).getDate();
    const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
    const endDate = `${year}-${String(month).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`;

    const result = await db
      .select({
        tanggal: trxKegiatanHarian.tanggal,
        total: sql<number>`count(*)::int`,
      })
      .from(trxKegiatanHarian)
      .where(
        and(
          eq(trxKegiatanHarian.pegawai_id, pegawai_id),
          gte(trxKegiatanHarian.tanggal, startDate),
          lte(trxKegiatanHarian.tanggal, endDate),
          eq(trxKegiatanHarian.is_active, true)
        )
      )
      .groupBy(trxKegiatanHarian.tanggal);

    return result;
  }
}
