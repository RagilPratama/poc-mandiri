import { eq, and, gte, lte, sql, desc, or, ilike } from 'drizzle-orm';
import { db } from '../db';
import { trxBantuan, mstJenisBantuan, mstKelompokNelayan, mstPenyuluh, mstPegawai } from '../db/schema';

export interface BantuanQueryType {
  page?: number;
  limit?: number;
  search?: string;
  kelompok_nelayan_id?: number;
  status_penyaluran?: string;
  tahun_anggaran?: number;
  tanggal_from?: string;
  tanggal_to?: string;
}

export class BantuanRepository {
  async findAll(query: BantuanQueryType) {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const offset = (page - 1) * limit;

    const conditions = [];

    if (query.search) {
      conditions.push(
        or(
          ilike(trxBantuan.no_bantuan, `%${query.search}%`),
          ilike(mstKelompokNelayan.nama_kelompok, `%${query.search}%`),
          ilike(mstJenisBantuan.nama_jenis_bantuan, `%${query.search}%`)
        )
      );
    }

    if (query.kelompok_nelayan_id) {
      conditions.push(eq(trxBantuan.kelompok_nelayan_id, query.kelompok_nelayan_id));
    }

    if (query.status_penyaluran) {
      conditions.push(eq(trxBantuan.status_penyaluran, query.status_penyaluran));
    }

    if (query.tahun_anggaran) {
      conditions.push(eq(trxBantuan.tahun_anggaran, query.tahun_anggaran));
    }

    if (query.tanggal_from) {
      conditions.push(gte(trxBantuan.tanggal_penyaluran, query.tanggal_from));
    }

    if (query.tanggal_to) {
      conditions.push(lte(trxBantuan.tanggal_penyaluran, query.tanggal_to));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const [data, countResult] = await Promise.all([
      db
        .select({
          id: trxBantuan.id,
          no_bantuan: trxBantuan.no_bantuan,
          jenis_bantuan_id: trxBantuan.jenis_bantuan_id,
          jenis_bantuan_nama: mstJenisBantuan.nama_jenis_bantuan,
          kelompok_nelayan_id: trxBantuan.kelompok_nelayan_id,
          kelompok_nelayan_nama: mstKelompokNelayan.nama_kelompok,
          penyuluh_id: trxBantuan.penyuluh_id,
          penyuluh_nama: mstPegawai.nama,
          tanggal_penyaluran: trxBantuan.tanggal_penyaluran,
          jumlah: trxBantuan.jumlah,
          satuan: trxBantuan.satuan,
          nilai_bantuan: trxBantuan.nilai_bantuan,
          sumber_dana: trxBantuan.sumber_dana,
          tahun_anggaran: trxBantuan.tahun_anggaran,
          status_penyaluran: trxBantuan.status_penyaluran,
          tanggal_selesai: trxBantuan.tanggal_selesai,
          bukti_penyaluran_url: trxBantuan.bukti_penyaluran_url,
          keterangan: trxBantuan.keterangan,
          created_at: trxBantuan.created_at,
          updated_at: trxBantuan.updated_at,
        })
        .from(trxBantuan)
        .leftJoin(mstJenisBantuan, eq(trxBantuan.jenis_bantuan_id, mstJenisBantuan.id))
        .leftJoin(mstKelompokNelayan, eq(trxBantuan.kelompok_nelayan_id, mstKelompokNelayan.id))
        .leftJoin(mstPenyuluh, eq(trxBantuan.penyuluh_id, mstPenyuluh.id))
        .leftJoin(mstPegawai, eq(mstPenyuluh.pegawai_id, mstPegawai.id))
        .where(whereClause)
        .orderBy(desc(trxBantuan.tanggal_penyaluran))
        .limit(limit)
        .offset(offset),
      db
        .select({ count: sql<number>`count(*)::int` })
        .from(trxBantuan)
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
        id: trxBantuan.id,
        no_bantuan: trxBantuan.no_bantuan,
        jenis_bantuan_id: trxBantuan.jenis_bantuan_id,
        jenis_bantuan_nama: mstJenisBantuan.nama_jenis_bantuan,
        kelompok_nelayan_id: trxBantuan.kelompok_nelayan_id,
        kelompok_nelayan_nama: mstKelompokNelayan.nama_kelompok,
        penyuluh_id: trxBantuan.penyuluh_id,
        penyuluh_nama: mstPegawai.nama,
        tanggal_penyaluran: trxBantuan.tanggal_penyaluran,
        jumlah: trxBantuan.jumlah,
        satuan: trxBantuan.satuan,
        nilai_bantuan: trxBantuan.nilai_bantuan,
        sumber_dana: trxBantuan.sumber_dana,
        tahun_anggaran: trxBantuan.tahun_anggaran,
        status_penyaluran: trxBantuan.status_penyaluran,
        tanggal_selesai: trxBantuan.tanggal_selesai,
        bukti_penyaluran_url: trxBantuan.bukti_penyaluran_url,
        keterangan: trxBantuan.keterangan,
        created_at: trxBantuan.created_at,
        updated_at: trxBantuan.updated_at,
      })
      .from(trxBantuan)
      .leftJoin(mstJenisBantuan, eq(trxBantuan.jenis_bantuan_id, mstJenisBantuan.id))
      .leftJoin(mstKelompokNelayan, eq(trxBantuan.kelompok_nelayan_id, mstKelompokNelayan.id))
      .leftJoin(mstPenyuluh, eq(trxBantuan.penyuluh_id, mstPenyuluh.id))
      .leftJoin(mstPegawai, eq(mstPenyuluh.pegawai_id, mstPegawai.id))
      .where(eq(trxBantuan.id, id))
      .limit(1);

    return result[0] || null;
  }

  async findByKelompokNelayan(kelompokNelayanId: number) {
    const result = await db
      .select()
      .from(trxBantuan)
      .where(eq(trxBantuan.kelompok_nelayan_id, kelompokNelayanId))
      .orderBy(desc(trxBantuan.tanggal_penyaluran));

    return result;
  }

  async findByNoBantuan(noBantuan: string) {
    const result = await db
      .select()
      .from(trxBantuan)
      .where(eq(trxBantuan.no_bantuan, noBantuan))
      .limit(1);

    return result[0] || null;
  }

  async create(data: typeof trxBantuan.$inferInsert) {
    const result = await db
      .insert(trxBantuan)
      .values({
        ...data,
        status_penyaluran: data.status_penyaluran ?? 'Direncanakan',
      })
      .returning();

    return result[0];
  }

  async update(id: number, data: Partial<typeof trxBantuan.$inferInsert>) {
    const result = await db
      .update(trxBantuan)
      .set({
        ...data,
        updated_at: new Date(),
      })
      .where(eq(trxBantuan.id, id))
      .returning();

    return result[0] || null;
  }

  async delete(id: number) {
    const result = await db
      .delete(trxBantuan)
      .where(eq(trxBantuan.id, id))
      .returning();

    return result[0] || null;
  }
}
