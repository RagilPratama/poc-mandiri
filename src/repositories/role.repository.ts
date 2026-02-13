import { eq, ilike, asc, count, and } from 'drizzle-orm';
import { db } from '../db';
import { roles } from '../db/schema/roles';
import type { CreateRoleDTO, UpdateRoleDTO } from '../types/role';

export class RoleRepository {
  async findAll(page: number = 1, limit: number = 10, search?: string) {
    const offset = (page - 1) * limit;

    const conditions = search 
      ? [ilike(roles.nama_role, `%${search}%`)]
      : [];

    // Get total count
    const totalResult = await db
      .select({ count: count() })
      .from(roles)
      .where(conditions.length > 0 ? and(...conditions) : undefined);
    const total = totalResult[0].count;

    // Get paginated data
    const result = await db
      .select({
        id: roles.id,
        level_role: roles.level_role,
        nama_role: roles.nama_role,
        keterangan: roles.keterangan,
      })
      .from(roles)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(asc(roles.id))
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
        id: roles.id,
        level_role: roles.level_role,
        nama_role: roles.nama_role,
        keterangan: roles.keterangan,
      })
      .from(roles)
      .where(eq(roles.id, id))
      .limit(1);
    
    return result[0];
  }

  async create(data: CreateRoleDTO) {
    const result = await db.insert(roles).values(data).returning();
    return result[0];
  }

  async update(id: number, data: UpdateRoleDTO) {
    const result = await db
      .update(roles)
      .set({ ...data, updated_at: new Date() })
      .where(eq(roles.id, id))
      .returning();
    
    return result[0];
  }

  async delete(id: number) {
    const result = await db
      .delete(roles)
      .where(eq(roles.id, id))
      .returning();
    
    return result[0];
  }
}
