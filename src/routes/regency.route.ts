import { Elysia, t } from "elysia";
import { regencyHandlers } from "../handlers/regency.handler";

export const regencyRoutes = new Elysia({ prefix: "/api/master" })
  .get("/regencies", async () => {
    return await regencyHandlers.getAllRegencies();
  }, {
    detail: {
      tags: ["Master - Regencies"],
      summary: "Get all regencies",
      description: "Menampilkan semua kabupaten/kota dengan data latitude dan longitude",
    },
  })
  .get("/regencies/search", async ({ query }) => {
    return await regencyHandlers.searchRegencies({ query });
  }, {
    query: t.Object({
      q: t.String({ minLength: 1, description: "Search term for regency name" }),
    }),
    detail: {
      tags: ["Master - Regencies"],
      summary: "Search regencies",
      description: "Mencari kabupaten/kota berdasarkan nama",
    },
  })
  .get("/regencies/province/:province_id", async ({ params }) => {
    return await regencyHandlers.getRegenciesByProvinceId({ params: { province_id: Number(params.province_id) } });
  }, {
    params: t.Object({
      province_id: t.Numeric({ minimum: 1, description: "Province ID" }),
    }),
    detail: {
      tags: ["Master - Regencies"],
      summary: "Get regencies by province ID",
      description: "Menampilkan semua kabupaten/kota berdasarkan province ID",
    },
  })
  .get("/regencies/:id", async ({ params }) => {
    return await regencyHandlers.getRegencyById({ params: { id: Number(params.id) } });
  }, {
    params: t.Object({
      id: t.Numeric({ minimum: 1, description: "Regency ID" }),
    }),
    detail: {
      tags: ["Master - Regencies"],
      summary: "Get regency by ID",
      description: "Menampilkan detail kabupaten/kota berdasarkan ID",
    },
  });
