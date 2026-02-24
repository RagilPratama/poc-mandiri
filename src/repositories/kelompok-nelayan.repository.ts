import { eq, and, or, ilike, sql, desc } from 'drizzle-orm';
import { db } from '../db';
import { mstKelompokNelayan, mstUpt, mstProvinsi, mstPenyuluh, mstPegawai } from '../db/schema';
import type { CreateKelompokNelayanType, UpdateKelompokNelayanType, KelompokNelayanQueryType } from '../types/kelompok-nelayan';

export class KelompokNelayanRepository {
  async findAll(query: KelompokNelayanQueryType) {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const offset = (page - 1) * limit;

    const conditions = [];

    if (query.search) {
      conditions.push(
        or(
          ilike(mstKelompokNelayan.nib_kelompok, `%${query.search}%`),
          ilike(mstKelompokNelayan.no_registrasi, `%${query.search}%`),
          ilike(mstKelompokNelayan.nama_kelompok, `%${query.search}%`),
          ilike(mstKelompokNelayan.nik_ketua, `%${query.search}%`),
          ilike(mstKelompokNelayan.nama_ketua, `%${query.search}%`)
        )
      );
    }

    if (query.upt_id) {
      conditions.push(eq(mstKelompokNelayan.upt_id, query.upt_id));
    }

    if (query.province_id) {
      conditions.push(eq(mstKelompokNelayan.province_id, query.province_id));
    }

    if (query.penyuluh_id) {
      conditions.push(eq(mstKelompokNelayan.penyuluh_id, query.penyuluh_id));
    }

    if (query.gabungan_kelompok_id) {
      conditions.push(eq(mstKelompokNelayan.gabungan_kelompok_id, query.gabungan_kelompok_id));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const [data, countResult] = await Promise.all([
      db
        .select({
          id: mstKelompokNelayan.id,
          nib_kelompok: mstKelompokNelayan.nib_kelompok,
          no_registrasi: mstKelompokNelayan.no_registrasi,
          nama_kelompok: mstKelompokNelayan.nama_kelompok,
          nik_ketua: mstKelompokNelayan.nik_ketua,
          nama_ketua: mstKelompokNelayan.nama_ketua,
          jenis_kelamin_ketua: mstKelompokNelayan.jenis_kelamin_ketua,
          upt_id: mstKelompokNelayan.upt_id,
          upt_nama: mstUpt.nama_organisasi,
          province_id: mstKelompokNelayan.province_id,
          province_name: mstProvinsi.name,
          penyuluh_id: mstKelompokNelayan.penyuluh_id,
          penyuluh_nama: mstPegawai.nama,
          no_hp_penyuluh: mstKelompokNelayan.no_hp_penyuluh,
          status_penyuluh: mstKelompokNelayan.status_penyuluh,
          jumlah_anggota: mstKelompokNelayan.jumlah_anggota,
          jenis_usaha_id: mstKelompokNelayan.jenis_usaha_id,
          kelas_kelompok: mstKelompokNelayan.kelas_kelompok,
          alamat: mstKelompokNelayan.alamat,
          no_hp_ketua: mstKelompokNelayan.no_hp_ketua,
          tanggal_pembentukan_kelompok: mstKelompokNelayan.tanggal_pembentukan_kelompok,
          tanggal_peningkatan_kelas_kelompok: mstKelompokNelayan.tanggal_peningkatan_kelas_kelompok,
          tanggal_pembentukan_gapokan: mstKelompokNelayan.tanggal_pembentukan_gapokan,
          profil_kelompok_photo_url: mstKelompokNelayan.profil_kelompok_photo_url,
          profil_kelompok_photo_id: mstKelompokNelayan.profil_kelompok_photo_id,
          created_at: mstKelompokNelayan.created_at,
          updated_at: mstKelompokNelayan.updated_at,
        })
        .from(mstKelompokNelayan)
        .leftJoin(mstUpt, eq(mstKelompokNelayan.upt_id, mstUpt.id))
        .leftJoin(mstProvinsi, eq(mstKelompokNelayan.province_id, mstProvinsi.id))
        .leftJoin(mstPenyuluh, eq(mstKelompokNelayan.penyuluh_id, mstPenyuluh.id))
        .leftJoin(mstPegawai, eq(mstPenyuluh.pegawai_id, mstPegawai.id))
        .where(whereClause)
        .orderBy(desc(mstKelompokNelayan.created_at))
        .limit(limit)
        .offset(offset),
      db
        .select({ count: sql<number>`count(*)::int` })
        .from(mstKelompokNelayan)
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
        id: mstKelompokNelayan.id,
        nib_kelompok: mstKelompokNelayan.nib_kelompok,
        no_registrasi: mstKelompokNelayan.no_registrasi,
        nama_kelompok: mstKelompokNelayan.nama_kelompok,
        nik_ketua: mstKelompokNelayan.nik_ketua,
        nama_ketua: mstKelompokNelayan.nama_ketua,
        jenis_kelamin_ketua: mstKelompokNelayan.jenis_kelamin_ketua,
        upt_id: mstKelompokNelayan.upt_id,
        upt_nama: mstUpt.nama_organisasi,
        upt_pimpinan: mstUpt.pimpinan,
        province_id: mstKelompokNelayan.province_id,
        province_name: mstProvinsi.name,
        penyuluh_id: mstKelompokNelayan.penyuluh_id,
        penyuluh_nama: mstPegawai.nama,
        penyuluh_nip: mstPegawai.nip,
        no_hp_penyuluh: mstKelompokNelayan.no_hp_penyuluh,
        status_penyuluh: mstKelompokNelayan.status_penyuluh,
        jumlah_anggota: mstKelompokNelayan.jumlah_anggota,
        jenis_usaha_id: mstKelompokNelayan.jenis_usaha_id,
        kelas_kelompok: mstKelompokNelayan.kelas_kelompok,
        alamat: mstKelompokNelayan.alamat,
        no_hp_ketua: mstKelompokNelayan.no_hp_ketua,
        tanggal_pembentukan_kelompok: mstKelompokNelayan.tanggal_pembentukan_kelompok,
        tanggal_peningkatan_kelas_kelompok: mstKelompokNelayan.tanggal_peningkatan_kelas_kelompok,
        tanggal_pembentukan_gapokan: mstKelompokNelayan.tanggal_pembentukan_gapokan,
        profil_kelompok_photo_url: mstKelompokNelayan.profil_kelompok_photo_url,
        profil_kelompok_photo_id: mstKelompokNelayan.profil_kelompok_photo_id,
        created_at: mstKelompokNelayan.created_at,
        updated_at: mstKelompokNelayan.updated_at,
      })
      .from(mstKelompokNelayan)
      .leftJoin(mstUpt, eq(mstKelompokNelayan.upt_id, mstUpt.id))
      .leftJoin(mstProvinsi, eq(mstKelompokNelayan.province_id, mstProvinsi.id))
      .leftJoin(mstPenyuluh, eq(mstKelompokNelayan.penyuluh_id, mstPenyuluh.id))
      .leftJoin(mstPegawai, eq(mstPenyuluh.pegawai_id, mstPegawai.id))
      .where(eq(mstKelompokNelayan.id, id))
      .limit(1);

    if (!result[0]) return null;

    // Get gabungan kelompok name if exists
    if (result[0].gabungan_kelompok_id) {
      const gabungan = await db
        .select({ nama_kelompok: mstKelompokNelayan.nama_kelompok })
        .from(mstKelompokNelayan)
        .where(eq(mstKelompokNelayan.id, result[0].gabungan_kelompok_id))
        .limit(1);

      return {
        ...result[0],
        gabungan_kelompok_nama: gabungan[0]?.nama_kelompok || null,
      };
    }

    return {
      ...result[0],
      gabungan_kelompok_nama: null,
    };
  }

  async findByNibKelompok(nibKelompok: string) {
    const result = await db
      .select()
      .from(mstKelompokNelayan)
      .where(eq(mstKelompokNelayan.nib_kelompok, nibKelompok))
      .limit(1);

    return result[0] || null;
  }

  async findByNoRegistrasi(noRegistrasi: string) {
    const result = await db
      .select()
      .from(mstKelompokNelayan)
      .where(eq(mstKelompokNelayan.no_registrasi, noRegistrasi))
      .limit(1);

    return result[0] || null;
  }

  async create(data: CreateKelompokNelayanType) {
    const result: any = await db
      .insert(mstKelompokNelayan)
      .values(data)
      .returning();

    return result[0];
  }

  async update(id: number, data: UpdateKelompokNelayanType) {
    const result: any = await db
      .update(mstKelompokNelayan)
      .set({
        ...data,
        updated_at: new Date(),
      })
      .where(eq(mstKelompokNelayan.id, id))
      .returning();

    return result[0] || null;
  }

  async delete(id: number) {
    const result: any = await db
      .delete(mstKelompokNelayan)
      .where(eq(mstKelompokNelayan.id, id))
      .returning();

    return result[0] || null;
  }
}
