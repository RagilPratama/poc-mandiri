import { eq, and, or, ilike, sql, desc } from 'drizzle-orm';
import { db } from '../db';
import { mstPegawai, mstOrganisasi, mstRole } from '../db/schema';
import type { CreatePegawaiType, UpdatePegawaiType, PegawaiQueryType } from '../types/pegawai';

export class PegawaiRepository {
  async findAll(query: PegawaiQueryType) {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const offset = (page - 1) * limit;

    const conditions = [];

    if (query.search) {
      conditions.push(
        or(
          ilike(mstPegawai.nip, `%${query.search}%`),
          ilike(mstPegawai.nama, `%${query.search}%`),
          ilike(mstPegawai.email, `%${query.search}%`),
          ilike(mstPegawai.jabatan, `%${query.search}%`)
        )
      );
    }

    if (query.organisasi_id) {
      conditions.push(eq(mstPegawai.organisasi_id, query.organisasi_id));
    }

    if (query.role_id) {
      conditions.push(eq(mstPegawai.role_id, query.role_id));
    }

    if (query.status_aktif !== undefined) {
      conditions.push(eq(mstPegawai.status_aktif, query.status_aktif));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const [data, countResult] = await Promise.all([
      db
        .select({
          id: mstPegawai.id,
          nip: mstPegawai.nip,
          nama: mstPegawai.nama,
          email: mstPegawai.email,
          jabatan: mstPegawai.jabatan,
          organisasi_id: mstPegawai.organisasi_id,
          organisasi_nama: mstOrganisasi.nama_organisasi,
          role_id: mstPegawai.role_id,
          role_nama: mstRole.nama_role,
          level_role: mstRole.level_role,
          status_aktif: mstPegawai.status_aktif,
          last_login: mstPegawai.last_login,
          created_at: mstPegawai.created_at,
          updated_at: mstPegawai.updated_at,
        })
        .from(mstPegawai)
        .leftJoin(mstOrganisasi, eq(mstPegawai.organisasi_id, mstOrganisasi.id))
        .leftJoin(mstRole, eq(mstPegawai.role_id, mstRole.id))
        .where(whereClause)
        .orderBy(desc(mstPegawai.created_at))
        .limit(limit)
        .offset(offset),
      db
        .select({ count: sql<number>`count(*)::int` })
        .from(mstPegawai)
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
        id: mstPegawai.id,
        nip: mstPegawai.nip,
        nama: mstPegawai.nama,
        email: mstPegawai.email,
        jabatan: mstPegawai.jabatan,
        organisasi_id: mstPegawai.organisasi_id,
        organisasi_nama: mstOrganisasi.nama_organisasi,
        organisasi_kode: mstOrganisasi.kode_organisasi,
        organisasi_level: mstOrganisasi.level_organisasi,
        role_id: mstPegawai.role_id,
        role_nama: mstRole.nama_role,
        level_role: mstRole.level_role,
        status_aktif: mstPegawai.status_aktif,
        last_login: mstPegawai.last_login,
        created_at: mstPegawai.created_at,
        updated_at: mstPegawai.updated_at,
      })
      .from(mstPegawai)
      .leftJoin(mstOrganisasi, eq(mstPegawai.organisasi_id, mstOrganisasi.id))
      .leftJoin(mstRole, eq(mstPegawai.role_id, mstRole.id))
      .where(eq(mstPegawai.id, id))
      .limit(1);

    return result[0] || null;
  }

  async findByNip(nip: string) {
    const result = await db
      .select()
      .from(mstPegawai)
      .where(eq(mstPegawai.nip, nip))
      .limit(1);

    return result[0] || null;
  }

  async findByEmail(email: string) {
    const result = await db
      .select({
        id: mstPegawai.id,
        nip: mstPegawai.nip,
        nama: mstPegawai.nama,
        email: mstPegawai.email,
        jabatan: mstPegawai.jabatan,
        organisasi_id: mstPegawai.organisasi_id,
        organisasi_nama: mstOrganisasi.nama_organisasi,
        organisasi_kode: mstOrganisasi.kode_organisasi,
        organisasi_level: mstOrganisasi.level_organisasi,
        role_id: mstPegawai.role_id,
        role_nama: mstRole.nama_role,
        level_role: mstRole.level_role,
        status_aktif: mstPegawai.status_aktif,
        last_login: mstPegawai.last_login,
        created_at: mstPegawai.created_at,
        updated_at: mstPegawai.updated_at,
      })
      .from(mstPegawai)
      .leftJoin(mstOrganisasi, eq(mstPegawai.organisasi_id, mstOrganisasi.id))
      .leftJoin(mstRole, eq(mstPegawai.role_id, mstRole.id))
      .where(eq(mstPegawai.email, email))
      .limit(1);

    return result[0] || null;
  }

  async create(data: CreatePegawaiType) {
    const result = await db
      .insert(mstPegawai)
      .values({
        ...data,
        status_aktif: data.status_aktif ?? true,
      })
      .returning();

    return result[0];
  }

  async update(id: number, data: UpdatePegawaiType) {
    const result = await db
      .update(mstPegawai)
      .set({
        ...data,
        updated_at: new Date(),
      })
      .where(eq(mstPegawai.id, id))
      .returning();

    return result[0] || null;
  }

  async delete(id: number) {
    const result = await db
      .delete(mstPegawai)
      .where(eq(mstPegawai.id, id))
      .returning();

    return result[0] || null;
  }

  async updateLastLogin(id: number) {
    const result = await db
      .update(mstPegawai)
      .set({
        last_login: new Date(),
      })
      .where(eq(mstPegawai.id, id))
      .returning();

    return result[0] || null;
  }
}
