import { db } from '../db';
import { trxKegiatanPrioritas, mstPegawai, mstKelompokNelayan, mstIki } from '../db/schema';
import { eq, and, gte, lte, like, sql, desc, or } from 'drizzle-orm';
import type { CreateKegiatanPrioritasType, UpdateKegiatanPrioritasType, KegiatanPrioritasQueryType } from '../types/kegiatan-prioritas';

export class KegiatanPrioritasRepository {
  async findAll(query: KegiatanPrioritasQueryType) {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const offset = (page - 1) * limit;

    const conditions = [];

    if (query.pegawai_id) {
      conditions.push(eq(trxKegiatanPrioritas.pegawai_id, query.pegawai_id));
    }

    if (query.kelompok_nelayan_id) {
      conditions.push(eq(trxKegiatanPrioritas.kelompok_nelayan_id, query.kelompok_nelayan_id));
    }

    if (query.tanggal) {
      conditions.push(eq(trxKegiatanPrioritas.tanggal, query.tanggal));
    }

    if (query.bulan) {
      const [year, month] = query.bulan.split('-');
      const startDate = `${year}-${month}-01`;
      const endDate = `${year}-${month}-31`;
      conditions.push(gte(trxKegiatanPrioritas.tanggal, startDate));
      conditions.push(lte(trxKegiatanPrioritas.tanggal, endDate));
    }

    if (query.tahun) {
      const startDate = `${query.tahun}-01-01`;
      const endDate = `${query.tahun}-12-31`;
      conditions.push(gte(trxKegiatanPrioritas.tanggal, startDate));
      conditions.push(lte(trxKegiatanPrioritas.tanggal, endDate));
    }

    if (query.search) {
      const searchConditions = [];
      if (query.search) {
        searchConditions.push(like(trxKegiatanPrioritas.rencana_kerja, `%${query.search}%`));
        searchConditions.push(like(trxKegiatanPrioritas.detail_keterangan, `%${query.search}%`));
        searchConditions.push(like(trxKegiatanPrioritas.lokasi_kegiatan, `%${query.search}%`));
      }
      if (searchConditions.length > 0) {
        conditions.push(or(...searchConditions));
      }
    }

    conditions.push(eq(trxKegiatanPrioritas.is_active, true));

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const data = await db
      .select({
        id: trxKegiatanPrioritas.id,
        pegawai_id: trxKegiatanPrioritas.pegawai_id,
        pegawai_nama: mstPegawai.nama,
        pegawai_nip: mstPegawai.nip,
        kelompok_nelayan_id: trxKegiatanPrioritas.kelompok_nelayan_id,
        kelompok_nelayan_nama: mstKelompokNelayan.nama_kelompok,
        tanggal: trxKegiatanPrioritas.tanggal,
        lokasi_kegiatan: trxKegiatanPrioritas.lokasi_kegiatan,
        iki_id: trxKegiatanPrioritas.iki_id,
        iki_kategori: mstIki.kategori_iki,
        iki_detail: mstIki.detail_iki,
        rencana_kerja: trxKegiatanPrioritas.rencana_kerja,
        detail_keterangan: trxKegiatanPrioritas.detail_keterangan,
        foto_kegiatan: trxKegiatanPrioritas.foto_kegiatan,
        is_active: trxKegiatanPrioritas.is_active,
        created_at: trxKegiatanPrioritas.created_at,
        updated_at: trxKegiatanPrioritas.updated_at,
      })
      .from(trxKegiatanPrioritas)
      .leftJoin(mstPegawai, eq(trxKegiatanPrioritas.pegawai_id, mstPegawai.id))
      .leftJoin(mstKelompokNelayan, eq(trxKegiatanPrioritas.kelompok_nelayan_id, mstKelompokNelayan.id))
      .leftJoin(mstIki, eq(trxKegiatanPrioritas.iki_id, mstIki.id))
      .where(whereClause)
      .orderBy(desc(trxKegiatanPrioritas.tanggal), desc(trxKegiatanPrioritas.created_at))
      .limit(limit)
      .offset(offset);

    const countResult = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(trxKegiatanPrioritas)
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
        id: trxKegiatanPrioritas.id,
        pegawai_id: trxKegiatanPrioritas.pegawai_id,
        pegawai_nama: mstPegawai.nama,
        pegawai_nip: mstPegawai.nip,
        kelompok_nelayan_id: trxKegiatanPrioritas.kelompok_nelayan_id,
        kelompok_nelayan_nama: mstKelompokNelayan.nama_kelompok,
        tanggal: trxKegiatanPrioritas.tanggal,
        lokasi_kegiatan: trxKegiatanPrioritas.lokasi_kegiatan,
        iki_id: trxKegiatanPrioritas.iki_id,
        iki_kategori: mstIki.kategori_iki,
        iki_detail: mstIki.detail_iki,
        rencana_kerja: trxKegiatanPrioritas.rencana_kerja,
        detail_keterangan: trxKegiatanPrioritas.detail_keterangan,
        foto_kegiatan: trxKegiatanPrioritas.foto_kegiatan,
        is_active: trxKegiatanPrioritas.is_active,
        created_at: trxKegiatanPrioritas.created_at,
        updated_at: trxKegiatanPrioritas.updated_at,
      })
      .from(trxKegiatanPrioritas)
      .leftJoin(mstPegawai, eq(trxKegiatanPrioritas.pegawai_id, mstPegawai.id))
      .leftJoin(mstKelompokNelayan, eq(trxKegiatanPrioritas.kelompok_nelayan_id, mstKelompokNelayan.id))
      .leftJoin(mstIki, eq(trxKegiatanPrioritas.iki_id, mstIki.id))
      .where(eq(trxKegiatanPrioritas.id, id))
      .limit(1);

    return result[0] || null;
  }

  async create(data: CreateKegiatanPrioritasType) {
    const result = await db
      .insert(trxKegiatanPrioritas)
      .values(data)
      .returning();

    return result[0];
  }

  async update(id: number, data: UpdateKegiatanPrioritasType) {
    const result = await db
      .update(trxKegiatanPrioritas)
      .set({
        ...data,
        updated_at: new Date(),
      })
      .where(eq(trxKegiatanPrioritas.id, id))
      .returning();

    return result[0];
  }

  async delete(id: number) {
    const result = await db
      .update(trxKegiatanPrioritas)
      .set({
        is_active: false,
        updated_at: new Date(),
      })
      .where(eq(trxKegiatanPrioritas.id, id))
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
        tanggal: trxKegiatanPrioritas.tanggal,
        total: sql<number>`count(*)::int`,
      })
      .from(trxKegiatanPrioritas)
      .where(
        and(
          eq(trxKegiatanPrioritas.pegawai_id, pegawai_id),
          gte(trxKegiatanPrioritas.tanggal, startDate),
          lte(trxKegiatanPrioritas.tanggal, endDate),
          eq(trxKegiatanPrioritas.is_active, true)
        )
      )
      .groupBy(trxKegiatanPrioritas.tanggal);

    return result;
  }
}
