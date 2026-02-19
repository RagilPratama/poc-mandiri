import { eq, ilike, asc, count, and } from 'drizzle-orm';
import { db } from '../db';
import { mstRole } from '../db/schema';
import type { CreateRoleDTO, UpdateRoleDTO } from '../types/role';

export class RoleRepository {
  async findAll(page: number = 1, limit: number = 10, search?: string) {
    const offset = (page - 1) * limit;

    const conditions = search 
      ? [ilike(mstRole.nama_role, `%${search}%`)]
      : [];

    // Get total count
    const totalResult = await db
      .select({ count: count() })
      .from(mstRole)
      .where(conditions.length > 0 ? and(...conditions) : undefined);
    const total = totalResult[0].count;

    // Get paginated data
    const result = await db
      .select({
        id: mstRole.id,
        level_role: mstRole.level_role,
        nama_role: mstRole.nama_role,
        keterangan: mstRole.keterangan,
      })
      .from(mstRole)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(asc(mstRole.id))
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
        id: mstRole.id,
        level_role: mstRole.level_role,
        nama_role: mstRole.nama_role,
        keterangan: mstRole.keterangan,
      })
      .from(mstRole)
      .where(eq(mstRole.id, id))
      .limit(1);
    
    return result[0];
  }

  async create(data: CreateRoleDTO) {
    const result = await db.insert(mstRole).values(data).returning();
    return result[0];
  }

  async update(id: number, data: UpdateRoleDTO) {
    const result = await db
      .update(mstRole)
      .set({ ...data, updated_at: new Date() })
      .where(eq(mstRole.id, id))
      .returning();
    
    return result[0];
  }

  async delete(id: number) {
    const result = await db
      .delete(mstRole)
      .where(eq(mstRole.id, id))
      .returning();
    
    return result[0];
  }
}
