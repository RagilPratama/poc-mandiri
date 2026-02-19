import { eq, and, or, ilike, sql, desc } from 'drizzle-orm';
import { db } from '../db';
import { mstPenyuluh, mstPegawai, mstUpt, mstProvinsi } from '../db/schema';
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
          ilike(mstPegawai.nip, `%${query.search}%`),
          ilike(mstPegawai.nama, `%${query.search}%`),
          ilike(mstPenyuluh.program_prioritas, `%${query.search}%`)
        )
      );
    }

    if (query.upt_id) {
      conditions.push(eq(mstPenyuluh.upt_id, query.upt_id));
    }

    if (query.province_id) {
      conditions.push(eq(mstPenyuluh.province_id, query.province_id));
    }

    if (query.status_aktif !== undefined) {
      conditions.push(eq(mstPenyuluh.status_aktif, query.status_aktif));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const [data, countResult] = await Promise.all([
      db
        .select({
          id: mstPenyuluh.id,
          pegawai_id: mstPenyuluh.pegawai_id,
          nip: mstPegawai.nip,
          nama: mstPegawai.nama,
          upt_id: mstPenyuluh.upt_id,
          upt_nama: mstUpt.nama_organisasi,
          province_id: mstPenyuluh.province_id,
          province_name: mstProvinsi.name,
          jumlah_kelompok: mstPenyuluh.jumlah_kelompok,
          program_prioritas: mstPenyuluh.program_prioritas,
          status_aktif: mstPenyuluh.status_aktif,
          wilayah_binaan: mstPenyuluh.wilayah_binaan,
          spesialisasi: mstPenyuluh.spesialisasi,
          created_at: mstPenyuluh.created_at,
          updated_at: mstPenyuluh.updated_at,
        })
        .from(mstPenyuluh)
        .leftJoin(mstPegawai, eq(mstPenyuluh.pegawai_id, mstPegawai.id))
        .leftJoin(mstUpt, eq(mstPenyuluh.upt_id, mstUpt.id))
        .leftJoin(mstProvinsi, eq(mstPenyuluh.province_id, mstProvinsi.id))
        .where(whereClause)
        .orderBy(desc(mstPenyuluh.created_at))
        .limit(limit)
        .offset(offset),
      db
        .select({ count: sql<number>`count(*)::int` })
        .from(mstPenyuluh)
        .leftJoin(mstPegawai, eq(mstPenyuluh.pegawai_id, mstPegawai.id))
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
        id: mstPenyuluh.id,
        pegawai_id: mstPenyuluh.pegawai_id,
        nip: mstPegawai.nip,
        nama: mstPegawai.nama,
        email: mstPegawai.email,
        jabatan: mstPegawai.jabatan,
        upt_id: mstPenyuluh.upt_id,
        upt_nama: mstUpt.nama_organisasi,
        upt_pimpinan: mstUpt.pimpinan,
        province_id: mstPenyuluh.province_id,
        province_name: mstProvinsi.name,
        jumlah_kelompok: mstPenyuluh.jumlah_kelompok,
        program_prioritas: mstPenyuluh.program_prioritas,
        status_aktif: mstPenyuluh.status_aktif,
        wilayah_binaan: mstPenyuluh.wilayah_binaan,
        spesialisasi: mstPenyuluh.spesialisasi,
        created_at: mstPenyuluh.created_at,
        updated_at: mstPenyuluh.updated_at,
      })
      .from(mstPenyuluh)
      .leftJoin(mstPegawai, eq(mstPenyuluh.pegawai_id, mstPegawai.id))
      .leftJoin(mstUpt, eq(mstPenyuluh.upt_id, mstUpt.id))
      .leftJoin(mstProvinsi, eq(mstPenyuluh.province_id, mstProvinsi.id))
      .where(eq(mstPenyuluh.id, id))
      .limit(1);

    return result[0] || null;
  }

  async findByPegawaiId(pegawaiId: number) {
    const result = await db
      .select()
      .from(mstPenyuluh)
      .where(eq(mstPenyuluh.pegawai_id, pegawaiId))
      .limit(1);

    return result[0] || null;
  }

  async create(data: CreatePenyuluhType) {
    const result = await db
      .insert(mstPenyuluh)
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
      .update(mstPenyuluh)
      .set({
        ...data,
        updated_at: new Date(),
      })
      .where(eq(mstPenyuluh.id, id))
      .returning();

    return result[0] || null;
  }

  async delete(id: number) {
    const result = await db
      .delete(mstPenyuluh)
      .where(eq(mstPenyuluh.id, id))
      .returning();

    return result[0] || null;
  }
}
