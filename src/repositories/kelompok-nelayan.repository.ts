import { eq, and, or, ilike, sql, desc } from 'drizzle-orm';
import { db } from '../db';
import { kelompokNelayan } from '../db/schema/kelompok_nelayan';
import { unitPelaksanaanTeknis } from '../db/schema/unit_pelaksanaan_teknis';
import { provinces } from '../db/schema/provinces';
import { penyuluh } from '../db/schema/penyuluh';
import { pegawai } from '../db/schema/pegawai';
import type { CreateKelompokNelayanType, UpdateKelompokNelayanType, KelompokNelayanQueryType } from '../types/kelompok-nelayan';

export class KelompokNelayanRepository {
  async findAll(query: KelompokNelayanQueryType) {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const offset = (page - 1) * limit;

    const conditions = [];

    if (query.search) {
      conditions.push(
        or(
          ilike(kelompokNelayan.nib_kelompok, `%${query.search}%`),
          ilike(kelompokNelayan.no_registrasi, `%${query.search}%`),
          ilike(kelompokNelayan.nama_kelompok, `%${query.search}%`),
          ilike(kelompokNelayan.nik_ketua, `%${query.search}%`),
          ilike(kelompokNelayan.nama_ketua, `%${query.search}%`)
        )
      );
    }

    if (query.upt_id) {
      conditions.push(eq(kelompokNelayan.upt_id, query.upt_id));
    }

    if (query.province_id) {
      conditions.push(eq(kelompokNelayan.province_id, query.province_id));
    }

    if (query.penyuluh_id) {
      conditions.push(eq(kelompokNelayan.penyuluh_id, query.penyuluh_id));
    }

    if (query.gabungan_kelompok_id) {
      conditions.push(eq(kelompokNelayan.gabungan_kelompok_id, query.gabungan_kelompok_id));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const [data, countResult] = await Promise.all([
      db
        .select({
          id: kelompokNelayan.id,
          nib_kelompok: kelompokNelayan.nib_kelompok,
          no_registrasi: kelompokNelayan.no_registrasi,
          nama_kelompok: kelompokNelayan.nama_kelompok,
          nik_ketua: kelompokNelayan.nik_ketua,
          nama_ketua: kelompokNelayan.nama_ketua,
          upt_id: kelompokNelayan.upt_id,
          upt_nama: unitPelaksanaanTeknis.nama_organisasi,
          province_id: kelompokNelayan.province_id,
          province_name: provinces.name,
          penyuluh_id: kelompokNelayan.penyuluh_id,
          penyuluh_nama: pegawai.nama,
          gabungan_kelompok_id: kelompokNelayan.gabungan_kelompok_id,
          jumlah_anggota: kelompokNelayan.jumlah_anggota,
          created_at: kelompokNelayan.created_at,
          updated_at: kelompokNelayan.updated_at,
        })
        .from(kelompokNelayan)
        .leftJoin(unitPelaksanaanTeknis, eq(kelompokNelayan.upt_id, unitPelaksanaanTeknis.id))
        .leftJoin(provinces, eq(kelompokNelayan.province_id, provinces.id))
        .leftJoin(penyuluh, eq(kelompokNelayan.penyuluh_id, penyuluh.id))
        .leftJoin(pegawai, eq(penyuluh.pegawai_id, pegawai.id))
        .where(whereClause)
        .orderBy(desc(kelompokNelayan.created_at))
        .limit(limit)
        .offset(offset),
      db
        .select({ count: sql<number>`count(*)::int` })
        .from(kelompokNelayan)
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
        id: kelompokNelayan.id,
        nib_kelompok: kelompokNelayan.nib_kelompok,
        no_registrasi: kelompokNelayan.no_registrasi,
        nama_kelompok: kelompokNelayan.nama_kelompok,
        nik_ketua: kelompokNelayan.nik_ketua,
        nama_ketua: kelompokNelayan.nama_ketua,
        upt_id: kelompokNelayan.upt_id,
        upt_nama: unitPelaksanaanTeknis.nama_organisasi,
        upt_pimpinan: unitPelaksanaanTeknis.pimpinan,
        province_id: kelompokNelayan.province_id,
        province_name: provinces.name,
        penyuluh_id: kelompokNelayan.penyuluh_id,
        penyuluh_nama: pegawai.nama,
        penyuluh_nip: pegawai.nip,
        gabungan_kelompok_id: kelompokNelayan.gabungan_kelompok_id,
        jumlah_anggota: kelompokNelayan.jumlah_anggota,
        created_at: kelompokNelayan.created_at,
        updated_at: kelompokNelayan.updated_at,
      })
      .from(kelompokNelayan)
      .leftJoin(unitPelaksanaanTeknis, eq(kelompokNelayan.upt_id, unitPelaksanaanTeknis.id))
      .leftJoin(provinces, eq(kelompokNelayan.province_id, provinces.id))
      .leftJoin(penyuluh, eq(kelompokNelayan.penyuluh_id, penyuluh.id))
      .leftJoin(pegawai, eq(penyuluh.pegawai_id, pegawai.id))
      .where(eq(kelompokNelayan.id, id))
      .limit(1);

    if (!result[0]) return null;

    // Get gabungan kelompok name if exists
    if (result[0].gabungan_kelompok_id) {
      const gabungan = await db
        .select({ nama_kelompok: kelompokNelayan.nama_kelompok })
        .from(kelompokNelayan)
        .where(eq(kelompokNelayan.id, result[0].gabungan_kelompok_id))
        .limit(1);

      return {
        ...result[0],
        gabungan_kelompok_nama: gabungan[0]?.nama_kelompok || null,
      };
    }

    return {
      ...result[0],
      gabungan_kelompok_nama: null,
    };
  }

  async findByNibKelompok(nibKelompok: string) {
    const result = await db
      .select()
      .from(kelompokNelayan)
      .where(eq(kelompokNelayan.nib_kelompok, nibKelompok))
      .limit(1);

    return result[0] || null;
  }

  async findByNoRegistrasi(noRegistrasi: string) {
    const result = await db
      .select()
      .from(kelompokNelayan)
      .where(eq(kelompokNelayan.no_registrasi, noRegistrasi))
      .limit(1);

    return result[0] || null;
  }

  async create(data: CreateKelompokNelayanType) {
    const result = await db
      .insert(kelompokNelayan)
      .values(data)
      .returning();

    return result[0];
  }

  async update(id: number, data: UpdateKelompokNelayanType) {
    const result = await db
      .update(kelompokNelayan)
      .set({
        ...data,
        updated_at: new Date(),
      })
      .where(eq(kelompokNelayan.id, id))
      .returning();

    return result[0] || null;
  }

  async delete(id: number) {
    const result = await db
      .delete(kelompokNelayan)
      .where(eq(kelompokNelayan.id, id))
      .returning();

    return result[0] || null;
  }
}
