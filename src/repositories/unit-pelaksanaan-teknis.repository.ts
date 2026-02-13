import { eq } from 'drizzle-orm';
import { db } from '../db';
import { unitPelaksanaanTeknis } from '../db/schema/unit_pelaksanaan_teknis';
import { provinces } from '../db/schema/provinces';
import type { CreateUnitPelaksanaanTeknisDTO, UpdateUnitPelaksanaanTeknisDTO } from '../types/unit-pelaksanaan-teknis';

export const unitPelaksanaanTeknisRepository = {
  async findAll() {
    return await db
      .select({
        id: unitPelaksanaanTeknis.id,
        nama_organisasi: unitPelaksanaanTeknis.nama_organisasi,
        pimpinan: unitPelaksanaanTeknis.pimpinan,
        province_id: unitPelaksanaanTeknis.province_id,
        wilayah: provinces.name,
      })
      .from(unitPelaksanaanTeknis)
      .leftJoin(provinces, eq(unitPelaksanaanTeknis.province_id, provinces.id));
  },

  async findById(id: number) {
    const result = await db
      .select({
        id: unitPelaksanaanTeknis.id,
        nama_organisasi: unitPelaksanaanTeknis.nama_organisasi,
        pimpinan: unitPelaksanaanTeknis.pimpinan,
        province_id: unitPelaksanaanTeknis.province_id,
        wilayah: provinces.name,
      })
      .from(unitPelaksanaanTeknis)
      .leftJoin(provinces, eq(unitPelaksanaanTeknis.province_id, provinces.id))
      .where(eq(unitPelaksanaanTeknis.id, id));
    
    return result[0];
  },

  async create(data: CreateUnitPelaksanaanTeknisDTO) {
    const result = await db.insert(unitPelaksanaanTeknis).values(data).returning();
    return result[0];
  },

  async update(id: number, data: UpdateUnitPelaksanaanTeknisDTO) {
    const result = await db
      .update(unitPelaksanaanTeknis)
      .set(data)
      .where(eq(unitPelaksanaanTeknis.id, id))
      .returning();
    
    return result[0];
  },

  async delete(id: number) {
    const result = await db
      .delete(unitPelaksanaanTeknis)
      .where(eq(unitPelaksanaanTeknis.id, id))
      .returning();
    
    return result[0];
  },
};
