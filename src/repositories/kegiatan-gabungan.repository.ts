import { db } from '../db';
import { trxKegiatanHarian, trxKegiatanPrioritas } from '../db/schema';
import { eq, and, gte, lte, sql } from 'drizzle-orm';

interface KegiatanGabunganQuery {
  pegawai_id?: number;
  tanggal?: string; // YYYY-MM-DD
  bulan?: string; // YYYY-MM
  tahun?: string; // YYYY
}

export class KegiatanGabunganRepository {
  async findByDate(query: KegiatanGabunganQuery) {
    const conditions = [];

    if (query.pegawai_id) {
      conditions.push(sql`pegawai_id = ${query.pegawai_id}`);
    }

    if (query.tanggal) {
      conditions.push(sql`tanggal = ${query.tanggal}`);
    } else if (query.bulan) {
      const [year, month] = query.bulan.split('-');
      const lastDay = new Date(parseInt(year), parseInt(month), 0).getDate();
      const startDate = `${year}-${month}-01`;
      const endDate = `${year}-${month}-${String(lastDay).padStart(2, '0')}`;
      conditions.push(sql`tanggal >= ${startDate} AND tanggal <= ${endDate}`);
    } else if (query.tahun) {
      const startDate = `${query.tahun}-01-01`;
      const endDate = `${query.tahun}-12-31`;
      conditions.push(sql`tanggal >= ${startDate} AND tanggal <= ${endDate}`);
    }

    conditions.push(sql`is_active = true`);

    const whereClause = conditions.length > 0 ? sql`WHERE ${sql.join(conditions, sql` AND `)}` : sql``;

    // Union query untuk menggabungkan kegiatan harian dan prioritas
    const result = await db.execute(sql`
      SELECT 
        tanggal,
        'Kegiatan' as kategori,
        rencana_kerja,
        detail_keterangan
      FROM trx_kegiatan_harian
      ${whereClause}
      
      UNION ALL
      
      SELECT 
        tanggal,
        'Kegiatan Prioritas' as kategori,
        rencana_kerja,
        detail_keterangan
      FROM trx_kegiatan_prioritas
      ${whereClause}
      
      ORDER BY tanggal DESC, kategori
    `);

    return result.rows;
  }

  async groupByDate(query: KegiatanGabunganQuery) {
    const conditions = [];

    if (query.pegawai_id) {
      conditions.push(sql`pegawai_id = ${query.pegawai_id}`);
    }

    if (query.tanggal) {
      conditions.push(sql`tanggal = ${query.tanggal}`);
    } else if (query.bulan) {
      const [year, month] = query.bulan.split('-');
      const lastDay = new Date(parseInt(year), parseInt(month), 0).getDate();
      const startDate = `${year}-${month}-01`;
      const endDate = `${year}-${month}-${String(lastDay).padStart(2, '0')}`;
      conditions.push(sql`tanggal >= ${startDate} AND tanggal <= ${endDate}`);
    } else if (query.tahun) {
      const startDate = `${query.tahun}-01-01`;
      const endDate = `${query.tahun}-12-31`;
      conditions.push(sql`tanggal >= ${startDate} AND tanggal <= ${endDate}`);
    }

    conditions.push(sql`is_active = true`);

    const whereClause = conditions.length > 0 ? sql`WHERE ${sql.join(conditions, sql` AND `)}` : sql``;

    // Group by tanggal dan kategori
    const result = await db.execute(sql`
      WITH combined AS (
        SELECT 
          tanggal,
          'Kegiatan' as kategori,
          rencana_kerja,
          detail_keterangan
        FROM trx_kegiatan_harian
        ${whereClause}
        
        UNION ALL
        
        SELECT 
          tanggal,
          'Kegiatan Prioritas' as kategori,
          rencana_kerja,
          detail_keterangan
        FROM trx_kegiatan_prioritas
        ${whereClause}
      )
      SELECT 
        tanggal,
        json_agg(
          json_build_object(
            'kategori', kategori,
            'rencana_kerja', rencana_kerja,
            'detail_keterangan', detail_keterangan
          )
          ORDER BY kategori
        ) as kegiatan
      FROM combined
      GROUP BY tanggal
      ORDER BY tanggal DESC
    `);

    return result.rows;
  }
}
