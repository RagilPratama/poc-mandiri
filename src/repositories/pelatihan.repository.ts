import { eq, and, gte, lte, sql, desc, or, ilike } from 'drizzle-orm';
import { db } from '../db';
import { trxPelatihan, mstJenisPelatihan, mstPenyuluh, mstPegawai } from '../db/schema';

export interface PelatihanQueryType {
  page?: number;
  limit?: number;
  search?: string;
  status_pelatihan?: string;
  tanggal_from?: string;
  tanggal_to?: string;
}

export class PelatihanRepository {
  async findAll(query: PelatihanQueryType) {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const offset = (page - 1) * limit;

    const conditions = [];

    if (query.search) {
      conditions.push(
        or(
          ilike(trxPelatihan.no_pelatihan, `%${query.search}%`),
          ilike(trxPelatihan.nama_pelatihan, `%${query.search}%`),
          ilike(mstJenisPelatihan.nama_jenis_pelatihan, `%${query.search}%`)
        )
      );
    }

    if (query.status_pelatihan) {
      conditions.push(eq(trxPelatihan.status_pelatihan, query.status_pelatihan));
    }

    if (query.tanggal_from) {
      conditions.push(gte(trxPelatihan.tanggal_mulai, query.tanggal_from));
    }

    if (query.tanggal_to) {
      conditions.push(lte(trxPelatihan.tanggal_mulai, query.tanggal_to));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const [data, countResult] = await Promise.all([
      db
        .select({
          id: trxPelatihan.id,
          no_pelatihan: trxPelatihan.no_pelatihan,
          jenis_pelatihan_id: trxPelatihan.jenis_pelatihan_id,
          jenis_pelatihan_nama: mstJenisPelatihan.nama_jenis_pelatihan,
          nama_pelatihan: trxPelatihan.nama_pelatihan,
          penyelenggara: trxPelatihan.penyelenggara,
          penyuluh_id: trxPelatihan.penyuluh_id,
          penyuluh_nama: mstPegawai.nama,
          tanggal_mulai: trxPelatihan.tanggal_mulai,
          tanggal_selesai: trxPelatihan.tanggal_selesai,
          lokasi: trxPelatihan.lokasi,
          jumlah_peserta: trxPelatihan.jumlah_peserta,
          target_peserta: trxPelatihan.target_peserta,
          peserta_kelompok: trxPelatihan.peserta_kelompok,
          narasumber: trxPelatihan.narasumber,
          biaya: trxPelatihan.biaya,
          sumber_dana: trxPelatihan.sumber_dana,
          status_pelatihan: trxPelatihan.status_pelatihan,
          hasil_evaluasi: trxPelatihan.hasil_evaluasi,
          dokumentasi_url: trxPelatihan.dokumentasi_url,
          keterangan: trxPelatihan.keterangan,
          created_at: trxPelatihan.created_at,
          updated_at: trxPelatihan.updated_at,
        })
        .from(trxPelatihan)
        .leftJoin(mstJenisPelatihan, eq(trxPelatihan.jenis_pelatihan_id, mstJenisPelatihan.id))
        .leftJoin(mstPenyuluh, eq(trxPelatihan.penyuluh_id, mstPenyuluh.id))
        .leftJoin(mstPegawai, eq(mstPenyuluh.pegawai_id, mstPegawai.id))
        .where(whereClause)
        .orderBy(desc(trxPelatihan.tanggal_mulai))
        .limit(limit)
        .offset(offset),
      db
        .select({ count: sql<number>`count(*)::int` })
        .from(trxPelatihan)
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
        id: trxPelatihan.id,
        no_pelatihan: trxPelatihan.no_pelatihan,
        jenis_pelatihan_id: trxPelatihan.jenis_pelatihan_id,
        jenis_pelatihan_nama: mstJenisPelatihan.nama_jenis_pelatihan,
        nama_pelatihan: trxPelatihan.nama_pelatihan,
        penyelenggara: trxPelatihan.penyelenggara,
        penyuluh_id: trxPelatihan.penyuluh_id,
        penyuluh_nama: mstPegawai.nama,
        tanggal_mulai: trxPelatihan.tanggal_mulai,
        tanggal_selesai: trxPelatihan.tanggal_selesai,
        lokasi: trxPelatihan.lokasi,
        jumlah_peserta: trxPelatihan.jumlah_peserta,
        target_peserta: trxPelatihan.target_peserta,
        peserta_kelompok: trxPelatihan.peserta_kelompok,
        narasumber: trxPelatihan.narasumber,
        biaya: trxPelatihan.biaya,
        sumber_dana: trxPelatihan.sumber_dana,
        status_pelatihan: trxPelatihan.status_pelatihan,
        hasil_evaluasi: trxPelatihan.hasil_evaluasi,
        dokumentasi_url: trxPelatihan.dokumentasi_url,
        keterangan: trxPelatihan.keterangan,
        created_at: trxPelatihan.created_at,
        updated_at: trxPelatihan.updated_at,
      })
      .from(trxPelatihan)
      .leftJoin(mstJenisPelatihan, eq(trxPelatihan.jenis_pelatihan_id, mstJenisPelatihan.id))
      .leftJoin(mstPenyuluh, eq(trxPelatihan.penyuluh_id, mstPenyuluh.id))
      .leftJoin(mstPegawai, eq(mstPenyuluh.pegawai_id, mstPegawai.id))
      .where(eq(trxPelatihan.id, id))
      .limit(1);

    return result[0] || null;
  }

  async findByNoPelatihan(noPelatihan: string) {
    const result = await db
      .select()
      .from(trxPelatihan)
      .where(eq(trxPelatihan.no_pelatihan, noPelatihan))
      .limit(1);

    return result[0] || null;
  }

  async create(data: typeof trxPelatihan.$inferInsert) {
    const result = await db
      .insert(trxPelatihan)
      .values({
        ...data,
        status_pelatihan: data.status_pelatihan ?? 'Direncanakan',
        jumlah_peserta: data.jumlah_peserta ?? 0,
      })
      .returning();

    return result[0];
  }

  async update(id: number, data: Partial<typeof trxPelatihan.$inferInsert>) {
    const result = await db
      .update(trxPelatihan)
      .set({
        ...data,
        updated_at: new Date(),
      })
      .where(eq(trxPelatihan.id, id))
      .returning();

    return result[0] || null;
  }

  async delete(id: number) {
    const result = await db
      .delete(trxPelatihan)
      .where(eq(trxPelatihan.id, id))
      .returning();

    return result[0] || null;
  }
}
