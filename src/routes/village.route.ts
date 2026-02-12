import { Elysia, t } from "elysia";
import { villageHandlers } from "../handlers/village.handler";

export const villageRoutes = new Elysia({ prefix: "/api/master" })
  .get("/villages", async () => {
    return await villageHandlers.getAllVillages();
  }, {
    detail: {
      tags: ["Master - Villages"],
      summary: "Get all villages",
      description: "Menampilkan semua desa/kelurahan dengan data latitude dan longitude",
    },
  })
  .get("/villages/search", async ({ query }) => {
    return await villageHandlers.searchVillages({ query });
  }, {
    query: t.Object({
      q: t.String({ minLength: 1, description: "Search term for village name" }),
    }),
    detail: {
      tags: ["Master - Villages"],
      summary: "Search villages",
      description: "Mencari desa/kelurahan berdasarkan nama",
    },
  })
  .get("/villages/district/:district_id", async ({ params }) => {
    return await villageHandlers.getVillagesByDistrictId({ params: { district_id: Number(params.district_id) } });
  }, {
    params: t.Object({
      district_id: t.Numeric({ minimum: 1, description: "District ID" }),
    }),
    detail: {
      tags: ["Master - Villages"],
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
      tags: ["Master - Villages"],
      summary: "Get village by ID",
      description: "Menampilkan detail desa/kelurahan berdasarkan ID",
    },
  });
