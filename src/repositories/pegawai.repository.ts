import { eq, and, or, ilike, sql, desc } from 'drizzle-orm';
import { db } from '../db';
import { pegawai } from '../db/schema/pegawai';
import { organisasi } from '../db/schema/organisasi';
import { roles } from '../db/schema/roles';
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
          ilike(pegawai.nip, `%${query.search}%`),
          ilike(pegawai.nama, `%${query.search}%`),
          ilike(pegawai.email, `%${query.search}%`),
          ilike(pegawai.jabatan, `%${query.search}%`)
        )
      );
    }

    if (query.organisasi_id) {
      conditions.push(eq(pegawai.organisasi_id, query.organisasi_id));
    }

    if (query.role_id) {
      conditions.push(eq(pegawai.role_id, query.role_id));
    }

    if (query.status_aktif !== undefined) {
      conditions.push(eq(pegawai.status_aktif, query.status_aktif));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const [data, countResult] = await Promise.all([
      db
        .select({
          id: pegawai.id,
          nip: pegawai.nip,
          nama: pegawai.nama,
          email: pegawai.email,
          jabatan: pegawai.jabatan,
          organisasi_id: pegawai.organisasi_id,
          organisasi_nama: organisasi.nama_organisasi,
          role_id: pegawai.role_id,
          role_nama: roles.nama_role,
          level_role: roles.level_role,
          status_aktif: pegawai.status_aktif,
          last_login: pegawai.last_login,
          created_at: pegawai.created_at,
          updated_at: pegawai.updated_at,
        })
        .from(pegawai)
        .leftJoin(organisasi, eq(pegawai.organisasi_id, organisasi.id))
        .leftJoin(roles, eq(pegawai.role_id, roles.id))
        .where(whereClause)
        .orderBy(desc(pegawai.created_at))
        .limit(limit)
        .offset(offset),
      db
        .select({ count: sql<number>`count(*)::int` })
        .from(pegawai)
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
        id: pegawai.id,
        nip: pegawai.nip,
        nama: pegawai.nama,
        email: pegawai.email,
        jabatan: pegawai.jabatan,
        organisasi_id: pegawai.organisasi_id,
        organisasi_nama: organisasi.nama_organisasi,
        organisasi_kode: organisasi.kode_organisasi,
        organisasi_level: organisasi.level_organisasi,
        role_id: pegawai.role_id,
        role_nama: roles.nama_role,
        level_role: roles.level_role,
        status_aktif: pegawai.status_aktif,
        last_login: pegawai.last_login,
        created_at: pegawai.created_at,
        updated_at: pegawai.updated_at,
      })
      .from(pegawai)
      .leftJoin(organisasi, eq(pegawai.organisasi_id, organisasi.id))
      .leftJoin(roles, eq(pegawai.role_id, roles.id))
      .where(eq(pegawai.id, id))
      .limit(1);

    return result[0] || null;
  }

  async findByNip(nip: string) {
    const result = await db
      .select()
      .from(pegawai)
      .where(eq(pegawai.nip, nip))
      .limit(1);

    return result[0] || null;
  }

  async findByEmail(email: string) {
    const result = await db
      .select({
        id: pegawai.id,
        nip: pegawai.nip,
        nama: pegawai.nama,
        email: pegawai.email,
        jabatan: pegawai.jabatan,
        organisasi_id: pegawai.organisasi_id,
        organisasi_nama: organisasi.nama_organisasi,
        organisasi_kode: organisasi.kode_organisasi,
        organisasi_level: organisasi.level_organisasi,
        role_id: pegawai.role_id,
        role_nama: roles.nama_role,
        level_role: roles.level_role,
        status_aktif: pegawai.status_aktif,
        last_login: pegawai.last_login,
        created_at: pegawai.created_at,
        updated_at: pegawai.updated_at,
      })
      .from(pegawai)
      .leftJoin(organisasi, eq(pegawai.organisasi_id, organisasi.id))
      .leftJoin(roles, eq(pegawai.role_id, roles.id))
      .where(eq(pegawai.email, email))
      .limit(1);

    return result[0] || null;
  }

  async create(data: CreatePegawaiType) {
    const result = await db
      .insert(pegawai)
      .values({
        ...data,
        status_aktif: data.status_aktif ?? true,
      })
      .returning();

    return result[0];
  }

  async update(id: number, data: UpdatePegawaiType) {
    const result = await db
      .update(pegawai)
      .set({
        ...data,
        updated_at: new Date(),
      })
      .where(eq(pegawai.id, id))
      .returning();

    return result[0] || null;
  }

  async delete(id: number) {
    const result = await db
      .delete(pegawai)
      .where(eq(pegawai.id, id))
      .returning();

    return result[0] || null;
  }

  async updateLastLogin(id: number) {
    const result = await db
      .update(pegawai)
      .set({
        last_login: new Date(),
      })
      .where(eq(pegawai.id, id))
      .returning();

    return result[0] || null;
  }
}
