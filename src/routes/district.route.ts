import { Elysia, t } from "elysia";
import { districtHandlers } from "../handlers/district.handler";

export const districtRoutes = new Elysia({ prefix: "/api/master" })
  .get("/districts", async () => {
    return await districtHandlers.getAllDistricts();
  }, {
    detail: {
      tags: ["Master - Districts"],
      summary: "Get all districts",
      description: "Menampilkan semua kecamatan dengan data latitude dan longitude",
    },
  })
  .get("/districts/search", async ({ query }) => {
    return await districtHandlers.searchDistricts({ query });
  }, {
    query: t.Object({
      q: t.String({ minLength: 1, description: "Search term for district name" }),
    }),
    detail: {
      tags: ["Master - Districts"],
      summary: "Search districts",
      description: "Mencari kecamatan berdasarkan nama",
    },
  })
  .get("/districts/regency/:regency_id", async ({ params }) => {
    return await districtHandlers.getDistrictsByRegencyId({ params: { regency_id: Number(params.regency_id) } });
  }, {
    params: t.Object({
      regency_id: t.Numeric({ minimum: 1, description: "Regency ID" }),
    }),
    detail: {
      tags: ["Master - Districts"],
      summary: "Get districts by regency ID",
      description: "Menampilkan semua kecamatan berdasarkan regency ID",
    },
  })
  .get("/districts/:id", async ({ params }) => {
    return await districtHandlers.getDistrictById({ params: { id: Number(params.id) } });
  }, {
    params: t.Object({
      id: t.Numeric({ minimum: 1, description: "District ID" }),
    }),
    detail: {
      tags: ["Master - Districts"],
      summary: "Get district by ID",
      description: "Menampilkan detail kecamatan berdasarkan ID",
    },
  });
