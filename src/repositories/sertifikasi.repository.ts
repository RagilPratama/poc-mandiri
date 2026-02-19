import { eq, and, lte, sql, desc, or, ilike } from 'drizzle-orm';
import { db } from '../db';
import { trxSertifikasi, mstJenisSertifikasi, mstKelompokNelayan, mstPenyuluh, mstPegawai } from '../db/schema';

export interface SertifikasiQueryType {
  page?: number;
  limit?: number;
  search?: string;
  kelompok_nelayan_id?: number;
  status_sertifikat?: string;
}

export class SertifikasiRepository {
  async findAll(query: SertifikasiQueryType) {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const offset = (page - 1) * limit;

    const conditions = [];

    if (query.search) {
      conditions.push(
        or(
          ilike(trxSertifikasi.no_sertifikat, `%${query.search}%`),
          ilike(mstKelompokNelayan.nama_kelompok, `%${query.search}%`),
          ilike(mstJenisSertifikasi.nama_jenis_sertifikasi, `%${query.search}%`)
        )
      );
    }

    if (query.kelompok_nelayan_id) {
      conditions.push(eq(trxSertifikasi.kelompok_nelayan_id, query.kelompok_nelayan_id));
    }

    if (query.status_sertifikat) {
      conditions.push(eq(trxSertifikasi.status_sertifikat, query.status_sertifikat));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const [data, countResult] = await Promise.all([
      db
        .select({
          id: trxSertifikasi.id,
          no_sertifikat: trxSertifikasi.no_sertifikat,
          jenis_sertifikasi_id: trxSertifikasi.jenis_sertifikasi_id,
          jenis_sertifikasi_nama: mstJenisSertifikasi.nama_jenis_sertifikasi,
          kelompok_nelayan_id: trxSertifikasi.kelompok_nelayan_id,
          kelompok_nelayan_nama: mstKelompokNelayan.nama_kelompok,
          penyuluh_id: trxSertifikasi.penyuluh_id,
          penyuluh_nama: mstPegawai.nama,
          tanggal_terbit: trxSertifikasi.tanggal_terbit,
          tanggal_berlaku: trxSertifikasi.tanggal_berlaku,
          tanggal_kadaluarsa: trxSertifikasi.tanggal_kadaluarsa,
          lembaga_penerbit: trxSertifikasi.lembaga_penerbit,
          status_sertifikat: trxSertifikasi.status_sertifikat,
          file_sertifikat_url: trxSertifikasi.file_sertifikat_url,
          keterangan: trxSertifikasi.keterangan,
          created_at: trxSertifikasi.created_at,
          updated_at: trxSertifikasi.updated_at,
        })
        .from(trxSertifikasi)
        .leftJoin(mstJenisSertifikasi, eq(trxSertifikasi.jenis_sertifikasi_id, mstJenisSertifikasi.id))
        .leftJoin(mstKelompokNelayan, eq(trxSertifikasi.kelompok_nelayan_id, mstKelompokNelayan.id))
        .leftJoin(mstPenyuluh, eq(trxSertifikasi.penyuluh_id, mstPenyuluh.id))
        .leftJoin(mstPegawai, eq(mstPenyuluh.pegawai_id, mstPegawai.id))
        .where(whereClause)
        .orderBy(desc(trxSertifikasi.tanggal_terbit))
        .limit(limit)
        .offset(offset),
      db
        .select({ count: sql<number>`count(*)::int` })
        .from(trxSertifikasi)
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
        id: trxSertifikasi.id,
        no_sertifikat: trxSertifikasi.no_sertifikat,
        jenis_sertifikasi_id: trxSertifikasi.jenis_sertifikasi_id,
        jenis_sertifikasi_nama: mstJenisSertifikasi.nama_jenis_sertifikasi,
        kelompok_nelayan_id: trxSertifikasi.kelompok_nelayan_id,
        kelompok_nelayan_nama: mstKelompokNelayan.nama_kelompok,
        penyuluh_id: trxSertifikasi.penyuluh_id,
        penyuluh_nama: mstPegawai.nama,
        tanggal_terbit: trxSertifikasi.tanggal_terbit,
        tanggal_berlaku: trxSertifikasi.tanggal_berlaku,
        tanggal_kadaluarsa: trxSertifikasi.tanggal_kadaluarsa,
        lembaga_penerbit: trxSertifikasi.lembaga_penerbit,
        status_sertifikat: trxSertifikasi.status_sertifikat,
        file_sertifikat_url: trxSertifikasi.file_sertifikat_url,
        keterangan: trxSertifikasi.keterangan,
        created_at: trxSertifikasi.created_at,
        updated_at: trxSertifikasi.updated_at,
      })
      .from(trxSertifikasi)
      .leftJoin(mstJenisSertifikasi, eq(trxSertifikasi.jenis_sertifikasi_id, mstJenisSertifikasi.id))
      .leftJoin(mstKelompokNelayan, eq(trxSertifikasi.kelompok_nelayan_id, mstKelompokNelayan.id))
      .leftJoin(mstPenyuluh, eq(trxSertifikasi.penyuluh_id, mstPenyuluh.id))
      .leftJoin(mstPegawai, eq(mstPenyuluh.pegawai_id, mstPegawai.id))
      .where(eq(trxSertifikasi.id, id))
      .limit(1);

    return result[0] || null;
  }

  async findByKelompokNelayan(kelompokNelayanId: number) {
    const result = await db
      .select()
      .from(trxSertifikasi)
      .where(eq(trxSertifikasi.kelompok_nelayan_id, kelompokNelayanId))
      .orderBy(desc(trxSertifikasi.tanggal_terbit));

    return result;
  }

  async findByNoSertifikat(noSertifikat: string) {
    const result = await db
      .select()
      .from(trxSertifikasi)
      .where(eq(trxSertifikasi.no_sertifikat, noSertifikat))
      .limit(1);

    return result[0] || null;
  }

  async create(data: typeof trxSertifikasi.$inferInsert) {
    const result = await db
      .insert(trxSertifikasi)
      .values({
        ...data,
        status_sertifikat: data.status_sertifikat ?? 'Aktif',
      })
      .returning();

    return result[0];
  }

  async update(id: number, data: Partial<typeof trxSertifikasi.$inferInsert>) {
    const result = await db
      .update(trxSertifikasi)
      .set({
        ...data,
        updated_at: new Date(),
      })
      .where(eq(trxSertifikasi.id, id))
      .returning();

    return result[0] || null;
  }

  async delete(id: number) {
    const result = await db
      .delete(trxSertifikasi)
      .where(eq(trxSertifikasi.id, id))
      .returning();

    return result[0] || null;
  }
}
