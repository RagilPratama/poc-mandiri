import { PegawaiRepository } from "../../repositories/pegawai.repository.js";
import { KelompokNelayanRepository } from "../../repositories/kelompok-nelayan.repository.js";
import { PenyuluhRepository } from "../../repositories/penyuluh.repository.js";
import { BantuanRepository } from "../../repositories/bantuan.repository.js";
import { PelatihanRepository } from "../../repositories/pelatihan.repository.js";
import { AbsensiRepository } from "../../repositories/absensi.repository.js";
import { ProvinceRepository } from "../../repositories/province.repository.js";
import { RegencyRepository } from "../../repositories/regency.repository.js";

interface Tool {
  name: string;
  description: string;
  inputSchema: object;
  handler: (args: unknown) => Promise<unknown>;
}

const handleError = (error: unknown): string => {
  return error instanceof Error ? error.message : String(error);
};

export const databaseTools: Tool[] = [
  // Pegawai
  {
    name: "db_get_all_pegawai",
    description: "Get all employees with pagination and filtering",
    inputSchema: {
      type: "object",
      properties: {
        page: { type: "number", description: "Page number (1-indexed)" },
        perPage: { type: "number", description: "Items per page" },
        search: { type: "string", description: "Search by name or NIP" },
        organisasiId: { type: "number", description: "Filter by organization ID" },
      },
    },
    handler: async (args: unknown) => {
      try {
        const { page = 1, perPage = 10, search, organisasiId } = args as Record<string, unknown>;
        const repo = new PegawaiRepository();
        return await repo.findAll({
          page: page as number,
          limit: perPage as number,
          search: search as string | undefined,
          organisasi_id: organisasiId as number | undefined,
        });
      } catch (error) {
        throw new Error(`Failed to fetch pegawai: ${handleError(error)}`);
      }
    },
  },
  {
    name: "db_get_pegawai_by_id",
    description: "Get employee details by ID",
    inputSchema: {
      type: "object",
      properties: {
        id: { type: "number", description: "Employee ID" },
      },
      required: ["id"],
    },
    handler: async (args: unknown) => {
      try {
        const { id } = args as Record<string, unknown>;
        const repo = new PegawaiRepository();
        return await repo.findById(id as number);
      } catch (error) {
        throw new Error(`Failed to fetch pegawai: ${handleError(error)}`);
      }
    },
  },

  // Kelompok Nelayan
  {
    name: "db_get_all_kelompok_nelayan",
    description: "Get all fisherman groups with pagination and filtering",
    inputSchema: {
      type: "object",
      properties: {
        page: { type: "number", description: "Page number" },
        perPage: { type: "number", description: "Items per page" },
        search: { type: "string", description: "Search by name or code" },
        provinsiId: { type: "number", description: "Filter by province ID" },
        uptId: { type: "number", description: "Filter by UPT ID" },
      },
    },
    handler: async (args: unknown) => {
      try {
        const { page = 1, perPage = 10, search, provinsiId, uptId } = args as Record<string, unknown>;
        const repo = new KelompokNelayanRepository();
        return await repo.findAll({
          page: page as number,
          limit: perPage as number,
          search: search as string | undefined,
          province_id: provinsiId as number | undefined,
          upt_id: uptId as number | undefined,
        });
      } catch (error) {
        throw new Error(`Failed to fetch kelompok nelayan: ${handleError(error)}`);
      }
    },
  },
  {
    name: "db_get_kelompok_nelayan_by_id",
    description: "Get fisherman group details by ID",
    inputSchema: {
      type: "object",
      properties: {
        id: { type: "number", description: "Group ID" },
      },
      required: ["id"],
    },
    handler: async (args: unknown) => {
      try {
        const { id } = args as Record<string, unknown>;
        const repo = new KelompokNelayanRepository();
        return await repo.findById(id as number);
      } catch (error) {
        throw new Error(`Failed to fetch kelompok nelayan: ${handleError(error)}`);
      }
    },
  },

  // Penyuluh (Extension Agents)
  {
    name: "db_get_all_penyuluh",
    description: "Get all extension agents with pagination",
    inputSchema: {
      type: "object",
      properties: {
        page: { type: "number", description: "Page number" },
        perPage: { type: "number", description: "Items per page" },
        search: { type: "string", description: "Search by name" },
      },
    },
    handler: async (args: unknown) => {
      try {
        const { page = 1, perPage = 10, search } = args as Record<string, unknown>;
        const repo = new PenyuluhRepository();
        return await repo.findAll({
          page: page as number,
          limit: perPage as number,
          search: search as string | undefined,
        });
      } catch (error) {
        throw new Error(`Failed to fetch penyuluh: ${handleError(error)}`);
      }
    },
  },

  // Bantuan (Assistance)
  {
    name: "db_get_all_bantuan",
    description: "Get all assistance records with pagination",
    inputSchema: {
      type: "object",
      properties: {
        page: { type: "number", description: "Page number" },
        perPage: { type: "number", description: "Items per page" },
        kelompokNelayanId: { type: "number", description: "Filter by fisherman group ID" },
        statusPenyaluran: { type: "string", description: "Filter by distribution status" },
      },
    },
    handler: async (args: unknown) => {
      try {
        const { page = 1, perPage = 10, kelompokNelayanId, statusPenyaluran } = args as Record<string, unknown>;
        const repo = new BantuanRepository();
        return await repo.findAll({
          page: page as number,
          limit: perPage as number,
          kelompok_nelayan_id: kelompokNelayanId as number | undefined,
          status_penyaluran: statusPenyaluran as string | undefined,
        });
      } catch (error) {
        throw new Error(`Failed to fetch bantuan: ${handleError(error)}`);
      }
    },
  },

  // Pelatihan (Training)
  {
    name: "db_get_all_pelatihan",
    description: "Get all training programs with pagination",
    inputSchema: {
      type: "object",
      properties: {
        page: { type: "number" },
        perPage: { type: "number" },
        statusPelatihan: { type: "string", description: "Filter by training status" },
      },
    },
    handler: async (args: unknown) => {
      try {
        const { page = 1, perPage = 10, statusPelatihan } = args as Record<string, unknown>;
        const repo = new PelatihanRepository();
        return await repo.findAll({
          page: page as number,
          limit: perPage as number,
          status_pelatihan: statusPelatihan as string | undefined,
        });
      } catch (error) {
        throw new Error(`Failed to fetch pelatihan: ${handleError(error)}`);
      }
    },
  },

  // Absensi (Attendance)
  {
    name: "db_get_all_absensi",
    description: "Get all attendance records with pagination",
    inputSchema: {
      type: "object",
      properties: {
        page: { type: "number" },
        perPage: { type: "number" },
        nipPegawai: { type: "string", description: "Filter by employee NIP" },
      },
    },
    handler: async (args: unknown) => {
      try {
        const { page = 1, perPage = 10 } = args as Record<string, unknown>;
        const repo = new AbsensiRepository();
        return await repo.findAll({
          page: page as number,
          limit: perPage as number,
        });
      } catch (error) {
        throw new Error(`Failed to fetch absensi: ${handleError(error)}`);
      }
    },
  },

  // Geographic Data
  {
    name: "db_get_all_provinces",
    description: "Get all provinces",
    inputSchema: { type: "object" },
    handler: async () => {
      try {
        const repo = new ProvinceRepository();
        return await repo.getAllProvinces();
      } catch (error) {
        throw new Error(`Failed to fetch provinces: ${handleError(error)}`);
      }
    },
  },
  {
    name: "db_get_regencies_by_province",
    description: "Get all regencies for a province",
    inputSchema: {
      type: "object",
      properties: {
        provinsiId: { type: "number", description: "Province ID" },
      },
      required: ["provinsiId"],
    },
    handler: async (args: unknown) => {
      try {
        const { provinsiId } = args as Record<string, unknown>;
        const repo = new RegencyRepository();
        return await repo.getRegenciesByProvinceId(provinsiId as number);
      } catch (error) {
        throw new Error(`Failed to fetch regencies: ${handleError(error)}`);
      }
    },
  },
];
