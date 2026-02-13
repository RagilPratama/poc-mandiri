import { Elysia, t } from "elysia";
import { roleHandlers } from "../handlers/role.handler";

export const roleRoutes = new Elysia({ prefix: "/api/master" })
  .get("/roles", async ({ query }) => {
    return await roleHandlers.getAll({ query });
  }, {
    query: t.Object({
      page: t.Optional(t.String({ pattern: "^[0-9]+$", description: "Page number (default: 1)" })),
      limit: t.Optional(t.String({ pattern: "^[0-9]+$", description: "Items per page (default: 10)" })),
      search: t.Optional(t.String({ description: "Search by nama role" })),
    }),
    detail: {
      tags: ["Roles"],
      summary: "Get all roles (paginated)",
      description: "Menampilkan semua role dengan pagination dan search",
    },
  })
  .get("/roles/:id", async ({ params }) => {
    return await roleHandlers.getById({ params: { id: Number(params.id) } });
  }, {
    params: t.Object({
      id: t.Numeric({ minimum: 1, description: "Role ID" }),
    }),
    detail: {
      tags: ["Roles"],
      summary: "Get role by ID",
      description: "Menampilkan detail role berdasarkan ID",
    },
  })
  .post("/roles", async ({ body }) => {
    return await roleHandlers.create({ body });
  }, {
    body: t.Object({
      level_role: t.String({ minLength: 1, description: "Level role (e.g., Kantor Pusat, UPT, Lainnya)" }),
      nama_role: t.String({ minLength: 1, description: "Nama role" }),
      keterangan: t.Optional(t.String({ description: "Keterangan role" })),
    }),
    detail: {
      tags: ["Roles"],
      summary: "Create new role",
      description: "Membuat role baru",
    },
  })
  .put("/roles/:id", async ({ params, body }) => {
    return await roleHandlers.update({ params: { id: Number(params.id) }, body });
  }, {
    params: t.Object({
      id: t.Numeric({ minimum: 1, description: "Role ID" }),
    }),
    body: t.Object({
      level_role: t.Optional(t.String({ minLength: 1, description: "Level role" })),
      nama_role: t.Optional(t.String({ minLength: 1, description: "Nama role" })),
      keterangan: t.Optional(t.String({ description: "Keterangan role" })),
    }),
    detail: {
      tags: ["Roles"],
      summary: "Update role",
      description: "Mengupdate role berdasarkan ID",
    },
  })
  .delete("/roles/:id", async ({ params }) => {
    return await roleHandlers.delete({ params: { id: Number(params.id) } });
  }, {
    params: t.Object({
      id: t.Numeric({ minimum: 1, description: "Role ID" }),
    }),
    detail: {
      tags: ["Roles"],
      summary: "Delete role",
      description: "Menghapus role berdasarkan ID",
    },
  });
