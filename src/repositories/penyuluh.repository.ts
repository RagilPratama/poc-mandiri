import { eq, and, or, ilike, sql, desc } from 'drizzle-orm';
import { db } from '../db';
import { penyuluh } from '../db/schema/penyuluh';
import { pegawai } from '../db/schema/pegawai';
import { unitPelaksanaanTeknis } from '../db/schema/unit_pelaksanaan_teknis';
import { provinces } from '../db/schema/provinces';
import type { CreatePenyuluhType, UpdatePenyuluhType, PenyuluhQueryType } from '../types/penyuluh';

export class PenyuluhRepository {
  async findAll(query: PenyuluhQueryType) {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const offset = (page - 1) * limit;

    const conditions = [];

    if (query.search) {
      conditions.push(
        or(
          ilike(pegawai.nip, `%${query.search}%`),
          ilike(pegawai.nama, `%${query.search}%`),
          ilike(penyuluh.program_prioritas, `%${query.search}%`)
        )
      );
    }

    if (query.upt_id) {
      conditions.push(eq(penyuluh.upt_id, query.upt_id));
    }

    if (query.province_id) {
      conditions.push(eq(penyuluh.province_id, query.province_id));
    }

    if (query.status_aktif !== undefined) {
      conditions.push(eq(penyuluh.status_aktif, query.status_aktif));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const [data, countResult] = await Promise.all([
      db
        .select({
          id: penyuluh.id,
          pegawai_id: penyuluh.pegawai_id,
          nip: pegawai.nip,
          nama: pegawai.nama,
          upt_id: penyuluh.upt_id,
          upt_nama: unitPelaksanaanTeknis.nama_organisasi,
          province_id: penyuluh.province_id,
          province_name: provinces.name,
          jumlah_kelompok: penyuluh.jumlah_kelompok,
          program_prioritas: penyuluh.program_prioritas,
          status_aktif: penyuluh.status_aktif,
          created_at: penyuluh.created_at,
          updated_at: penyuluh.updated_at,
        })
        .from(penyuluh)
        .leftJoin(pegawai, eq(penyuluh.pegawai_id, pegawai.id))
        .leftJoin(unitPelaksanaanTeknis, eq(penyuluh.upt_id, unitPelaksanaanTeknis.id))
        .leftJoin(provinces, eq(penyuluh.province_id, provinces.id))
        .where(whereClause)
        .orderBy(desc(penyuluh.created_at))
        .limit(limit)
        .offset(offset),
      db
        .select({ count: sql<number>`count(*)::int` })
        .from(penyuluh)
        .leftJoin(pegawai, eq(penyuluh.pegawai_id, pegawai.id))
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
        id: penyuluh.id,
        pegawai_id: penyuluh.pegawai_id,
        nip: pegawai.nip,
        nama: pegawai.nama,
        email: pegawai.email,
        jabatan: pegawai.jabatan,
        upt_id: penyuluh.upt_id,
        upt_nama: unitPelaksanaanTeknis.nama_organisasi,
        upt_pimpinan: unitPelaksanaanTeknis.pimpinan,
        province_id: penyuluh.province_id,
        province_name: provinces.name,
        jumlah_kelompok: penyuluh.jumlah_kelompok,
        program_prioritas: penyuluh.program_prioritas,
        status_aktif: penyuluh.status_aktif,
        created_at: penyuluh.created_at,
        updated_at: penyuluh.updated_at,
      })
      .from(penyuluh)
      .leftJoin(pegawai, eq(penyuluh.pegawai_id, pegawai.id))
      .leftJoin(unitPelaksanaanTeknis, eq(penyuluh.upt_id, unitPelaksanaanTeknis.id))
      .leftJoin(provinces, eq(penyuluh.province_id, provinces.id))
      .where(eq(penyuluh.id, id))
      .limit(1);

    return result[0] || null;
  }

  async findByPegawaiId(pegawaiId: number) {
    const result = await db
      .select()
      .from(penyuluh)
      .where(eq(penyuluh.pegawai_id, pegawaiId))
      .limit(1);

    return result[0] || null;
  }

  async create(data: CreatePenyuluhType) {
    const result = await db
      .insert(penyuluh)
      .values({
        ...data,
        status_aktif: data.status_aktif ?? true,
        jumlah_kelompok: data.jumlah_kelompok ?? 0,
      })
      .returning();

    return result[0];
  }

  async update(id: number, data: UpdatePenyuluhType) {
    const result = await db
      .update(penyuluh)
      .set({
        ...data,
        updated_at: new Date(),
      })
      .where(eq(penyuluh.id, id))
      .returning();

    return result[0] || null;
  }

  async delete(id: number) {
    const result = await db
      .delete(penyuluh)
      .where(eq(penyuluh.id, id))
      .returning();

    return result[0] || null;
  }
}
