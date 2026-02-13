import { Elysia, t } from "elysia";
import { villageHandlers } from "../handlers/village.handler";

export const villageRoutes = new Elysia({ prefix: "/api/master" })
  .get("/villages", async () => {
    return await villageHandlers.getAllVillages();
  }, {
    detail: {
      tags: ["Villages"],
      summary: "Get all villages",
      description: "Menampilkan semua desa/kelurahan dengan data latitude dan longitude",
    },
  })
  .get("/villages/with-relations", async ({ query }) => {
    return await villageHandlers.getAllVillagesWithRelations({ query });
  }, {
    query: t.Object({
      page: t.Optional(t.String({ pattern: "^[0-9]+$", description: "Page number (default: 1)" })),
      limit: t.Optional(t.String({ pattern: "^[0-9]+$", description: "Items per page (default: 10)" })),
    }),
    detail: {
      tags: ["Villages"],
      summary: "Get all villages with full relations (paginated)",
      description: "Menampilkan semua desa/kelurahan dengan data district, regency, dan province. Mendukung pagination.",
    },
  })
  .get("/villages/with-relations/search", async ({ query }) => {
    return await villageHandlers.searchVillagesWithRelations({ query });
  }, {
    query: t.Object({
      q: t.Optional(t.String({ description: "Search term for village name (optional)" })),
      page: t.Optional(t.String({ pattern: "^[0-9]+$", description: "Page number (default: 1)" })),
      limit: t.Optional(t.String({ pattern: "^[0-9]+$", description: "Items per page (default: 10)" })),
    }),
    detail: {
      tags: ["Villages"],
      summary: "Search villages with full relations (paginated)",
      description: "Mencari desa/kelurahan dengan data district, regency, dan province. Mendukung pagination.",
    },
  })
  .get("/villages/search", async ({ query }) => {
    return await villageHandlers.searchVillages({ query });
  }, {
    query: t.Object({
      q: t.String({ 
        minLength: 1, 
        pattern: "^(?!\\s*$).+",
        description: "Search term for village name (cannot be empty or whitespace)" 
      }),
      district_id: t.Optional(t.String({ pattern: "^[0-9]+$", description: "Filter by district ID (optional)" })),
    }),
    detail: {
      tags: ["Villages"],
      summary: "Search villages",
      description: "Mencari desa/kelurahan berdasarkan nama, dengan optional filter district_id",
      operationId: "searchVillages",
    },
  })
  .get("/villages/district/:district_id", async ({ params }) => {
    return await villageHandlers.getVillagesByDistrictId({ params: { district_id: Number(params.district_id) } });
  }, {
    params: t.Object({
      district_id: t.Numeric({ minimum: 1, description: "District ID" }),
    }),
    detail: {
      tags: ["Villages"],
      summary: "Get villages by district ID",
      description: "Menampilkan semua desa/kelurahan berdasarkan district ID",
    },
  })
  .get("/villages/:id", async ({ params }) => {
    return await villageHandlers.getVillageById({ params: { id: Number(params.id) } });
  }, {
    params: t.Object({
      id: t.Numeric({ minimum: 1, description: "Village ID" }),
    }),
    detail: {
      tags: ["Villages"],
      summary: "Get village by ID",
      description: "Menampilkan detail desa/kelurahan berdasarkan ID",
    },
  });
