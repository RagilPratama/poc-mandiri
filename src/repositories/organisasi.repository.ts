import { eq, ilike, or, asc, count, and } from 'drizzle-orm';
import { db } from '../db';
import { organisasi } from '../db/schema/organisasi';
import type { CreateOrganisasiDTO, UpdateOrganisasiDTO } from '../types/organisasi';

export class OrganisasiRepository {
  async findAll(page: number = 1, limit: number = 10, search?: string) {
    const offset = (page - 1) * limit;

    const conditions = search 
      ? [
          or(
            ilike(organisasi.nama_organisasi, `%${search}%`),
            ilike(organisasi.kode_organisasi, `%${search}%`),
            ilike(organisasi.level_organisasi, `%${search}%`)
          )
        ]
      : [];

    // Get total count
    const totalResult = await db
      .select({ count: count() })
      .from(organisasi)
      .where(conditions.length > 0 ? and(...conditions) : undefined);
    const total = totalResult[0].count;

    // Get paginated data
    const result = await db
      .select({
        id: organisasi.id,
        level_organisasi: organisasi.level_organisasi,
        kode_organisasi: organisasi.kode_organisasi,
        nama_organisasi: organisasi.nama_organisasi,
        keterangan: organisasi.keterangan,
      })
      .from(organisasi)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(asc(organisasi.id))
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
        id: organisasi.id,
        level_organisasi: organisasi.level_organisasi,
        kode_organisasi: organisasi.kode_organisasi,
        nama_organisasi: organisasi.nama_organisasi,
        keterangan: organisasi.keterangan,
      })
      .from(organisasi)
      .where(eq(organisasi.id, id))
      .limit(1);
    
    return result[0];
  }

  async create(data: CreateOrganisasiDTO) {
    const result = await db.insert(organisasi).values(data).returning();
    return result[0];
  }

  async update(id: number, data: UpdateOrganisasiDTO) {
    const result = await db
      .update(organisasi)
      .set({ ...data, updated_at: new Date() })
      .where(eq(organisasi.id, id))
      .returning();
    
    return result[0];
  }

  async delete(id: number) {
    const result = await db
      .delete(organisasi)
      .where(eq(organisasi.id, id))
      .returning();
    
    return result[0];
  }
}
