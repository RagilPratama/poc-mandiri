import { Elysia, t } from "elysia";
import { provinceHandlers } from "../handlers/province.handler";

export const provinceRoutes = new Elysia({ prefix: "/api/master" })
  .get("/provinces", async () => {
    return await provinceHandlers.getAllProvinces();
  }, {
    detail: {
      tags: ["Master"],
      summary: "Get all provinces",
      description: "Menampilkan semua provinsi dengan data latitude dan longitude",
    },
  })
  .get("/provinces/search", async ({ query }) => {
    return await provinceHandlers.searchProvinces({ query });
  }, {
    query: t.Object({
      q: t.String({ minLength: 1, description: "Search term for province name" }),
    }),
    detail: {
      tags: ["Master"],
      summary: "Search provinces",
      description: "Mencari provinsi berdasarkan nama atau nama alternatif",
    },
  })
  .get("/provinces/:id", async ({ params }) => {
    return await provinceHandlers.getProvinceById({ params: { id: Number(params.id) } });
  }, {
    params: t.Object({
      id: t.Numeric({ minimum: 1, description: "Province ID" }),
    }),
    detail: {
      tags: ["Master"],
      summary: "Get province by ID",
      description: "Menampilkan detail provinsi berdasarkan ID",
    },
  });
