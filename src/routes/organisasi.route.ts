import { Elysia, t } from "elysia";
import { organisasiHandlers } from "../handlers/organisasi.handler";

export const organisasiRoutes = new Elysia({ prefix: "/api/master" })
  .get("/organisasi", async ({ query }) => {
    return await organisasiHandlers.getAll({ query });
  }, {
    query: t.Object({
      page: t.Optional(t.String({ pattern: "^[0-9]+$", description: "Page number (default: 1)" })),
      limit: t.Optional(t.String({ pattern: "^[0-9]+$", description: "Items per page (default: 10)" })),
      search: t.Optional(t.String({ description: "Search by nama, kode, or level organisasi" })),
    }),
    detail: {
      tags: ["Organisasi"],
      summary: "Get all organisasi (paginated)",
      description: "Menampilkan semua organisasi dengan pagination dan search",
    },
  })
  .get("/organisasi/:id", async ({ params }) => {
    return await organisasiHandlers.getById({ params: { id: Number(params.id) } });
  }, {
    params: t.Object({
      id: t.Numeric({ minimum: 1, description: "Organisasi ID" }),
    }),
    detail: {
      tags: ["Organisasi"],
      summary: "Get organisasi by ID",
      description: "Menampilkan detail organisasi berdasarkan ID",
    },
  })
  .post("/organisasi", async ({ body }) => {
    return await organisasiHandlers.create({ body });
  }, {
    body: t.Object({
      level_organisasi: t.String({ minLength: 1, description: "Level organisasi (e.g., Kantor Pusat, Unit Pelaksanaan Teknis)" }),
      kode_organisasi: t.String({ minLength: 1, description: "Kode organisasi (e.g., KP123, UPT001)" }),
      nama_organisasi: t.String({ minLength: 1, description: "Nama organisasi" }),
      keterangan: t.Optional(t.String({ description: "Keterangan organisasi" })),
    }),
    detail: {
      tags: ["Organisasi"],
      summary: "Create new organisasi",
      description: "Membuat organisasi baru",
    },
  })
  .put("/organisasi/:id", async ({ params, body }) => {
    return await organisasiHandlers.update({ params: { id: Number(params.id) }, body });
  }, {
    params: t.Object({
      id: t.Numeric({ minimum: 1, description: "Organisasi ID" }),
    }),
    body: t.Object({
      level_organisasi: t.Optional(t.String({ minLength: 1, description: "Level organisasi" })),
      kode_organisasi: t.Optional(t.String({ minLength: 1, description: "Kode organisasi" })),
      nama_organisasi: t.Optional(t.String({ minLength: 1, description: "Nama organisasi" })),
      keterangan: t.Optional(t.String({ description: "Keterangan organisasi" })),
    }),
    detail: {
      tags: ["Organisasi"],
      summary: "Update organisasi",
      description: "Mengupdate organisasi berdasarkan ID",
    },
  })
  .delete("/organisasi/:id", async ({ params }) => {
    return await organisasiHandlers.delete({ params: { id: Number(params.id) } });
  }, {
    params: t.Object({
      id: t.Numeric({ minimum: 1, description: "Organisasi ID" }),
    }),
    detail: {
      tags: ["Organisasi"],
      summary: "Delete organisasi",
      description: "Menghapus organisasi berdasarkan ID",
    },
  });
