import { eq } from 'drizzle-orm';
import { db } from '../db';
import { mstUpt, mstProvinsi } from '../db/schema';
import type { CreateUnitPelaksanaanTeknisDTO, UpdateUnitPelaksanaanTeknisDTO } from '../types/unit-pelaksanaan-teknis';

export const unitPelaksanaanTeknisRepository = {
  async findAll() {
    return await db
      .select({
        id: mstUpt.id,
        nama_organisasi: mstUpt.nama_organisasi,
        pimpinan: mstUpt.pimpinan,
        province_id: mstUpt.province_id,
        wilayah: mstProvinsi.name,
      })
      .from(mstUpt)
      .leftJoin(mstProvinsi, eq(mstUpt.province_id, mstProvinsi.id));
  },

  async findById(id: number) {
    const result = await db
      .select({
        id: mstUpt.id,
        nama_organisasi: mstUpt.nama_organisasi,
        pimpinan: mstUpt.pimpinan,
        province_id: mstUpt.province_id,
        wilayah: mstProvinsi.name,
      })
      .from(mstUpt)
      .leftJoin(mstProvinsi, eq(mstUpt.province_id, mstProvinsi.id))
      .where(eq(mstUpt.id, id));
    
    return result[0];
  },

  async create(data: CreateUnitPelaksanaanTeknisDTO) {
    const result = await db.insert(mstUpt).values(data).returning();
    return result[0];
  },

  async update(id: number, data: UpdateUnitPelaksanaanTeknisDTO) {
    const result = await db
      .update(mstUpt)
      .set(data)
      .where(eq(mstUpt.id, id))
      .returning();
    
    return result[0];
  },

  async delete(id: number) {
    const result = await db
      .delete(mstUpt)
      .where(eq(mstUpt.id, id))
      .returning();
    
    return result[0];
  },
};
