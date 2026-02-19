import { eq, ilike, or, asc, count, and } from 'drizzle-orm';
import { db } from '../db';
import { mstOrganisasi } from '../db/schema';
import type { CreateOrganisasiDTO, UpdateOrganisasiDTO } from '../types/organisasi';

export class OrganisasiRepository {
  async findAll(page: number = 1, limit: number = 10, search?: string) {
    const offset = (page - 1) * limit;

    const conditions = search 
      ? [
          or(
            ilike(mstOrganisasi.nama_organisasi, `%${search}%`),
            ilike(mstOrganisasi.kode_organisasi, `%${search}%`),
            ilike(mstOrganisasi.level_organisasi, `%${search}%`)
          )
        ]
      : [];

    // Get total count
    const totalResult = await db
      .select({ count: count() })
      .from(mstOrganisasi)
      .where(conditions.length > 0 ? and(...conditions) : undefined);
    const total = totalResult[0].count;

    // Get paginated data
    const result = await db
      .select({
        id: mstOrganisasi.id,
        level_organisasi: mstOrganisasi.level_organisasi,
        kode_organisasi: mstOrganisasi.kode_organisasi,
        nama_organisasi: mstOrganisasi.nama_organisasi,
        keterangan: mstOrganisasi.keterangan,
      })
      .from(mstOrganisasi)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(asc(mstOrganisasi.id))
      .limit(limit)
      .offset(offset);

    return {
      data: result,
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
        id: mstOrganisasi.id,
        level_organisasi: mstOrganisasi.level_organisasi,
        kode_organisasi: mstOrganisasi.kode_organisasi,
        nama_organisasi: mstOrganisasi.nama_organisasi,
        keterangan: mstOrganisasi.keterangan,
      })
      .from(mstOrganisasi)
      .where(eq(mstOrganisasi.id, id))
      .limit(1);
    
    return result[0];
  }

  async create(data: CreateOrganisasiDTO) {
    const result = await db.insert(mstOrganisasi).values(data).returning();
    return result[0];
  }

  async update(id: number, data: UpdateOrganisasiDTO) {
    const result = await db
      .update(mstOrganisasi)
      .set({ ...data, updated_at: new Date() })
      .where(eq(mstOrganisasi.id, id))
      .returning();
    
    return result[0];
  }

  async delete(id: number) {
    const result = await db
      .delete(mstOrganisasi)
      .where(eq(mstOrganisasi.id, id))
      .returning();
    
    return result[0];
  }
}
