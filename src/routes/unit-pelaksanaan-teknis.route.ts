import { Elysia, t } from "elysia";
import { unitPelaksanaanTeknisHandler } from "../handlers/unit-pelaksanaan-teknis.handler";

export const unitPelaksanaanTeknisRoutes = new Elysia({ prefix: "/api/master" })
    .get("/unit-pelaksanaan-teknis", async () => {
        return await unitPelaksanaanTeknisHandler.getAll();
    }, {
    detail: {
        tags: ["Unit Pelaksanaan Teknis"],
        summary: "Get all unit pelaksanaan teknis",
        description: "Menampilkan semua unit pelaksanaan teknis dengan data wilayah",
    },
    })
    .get("/unit-pelaksanaan-teknis/:id", async ({ params }) => {
        return await unitPelaksanaanTeknisHandler.getById({ params: { id: Number(params.id) } });
    }, {
    params: t.Object({
        id: t.Numeric({ minimum: 1, description: "Unit Pelaksanaan Teknis ID" }),
    }),
    detail: {
        tags: ["Unit Pelaksanaan Teknis"],
        summary: "Get unit pelaksanaan teknis by ID",
        description: "Menampilkan detail unit pelaksanaan teknis berdasarkan ID",
    },
    })
    .post("/unit-pelaksanaan-teknis", async ({ body }) => {
        return await unitPelaksanaanTeknisHandler.create({ body });
    }, {
    body: t.Object({
        nama_organisasi: t.String({ minLength: 1, description: "Nama organisasi" }),
        pimpinan: t.String({ minLength: 1, description: "Nama pimpinan" }),
        regencies_id: t.Number({ minimum: 1, description: "Regency ID" }),
    }),
    detail: {
        tags: ["Unit Pelaksanaan Teknis"],
        summary: "Create unit pelaksanaan teknis",
        description: "Membuat unit pelaksanaan teknis baru",
    },
    })
    .put("/unit-pelaksanaan-teknis/:id", async ({ params, body }) => {
        return await unitPelaksanaanTeknisHandler.update({ params: { id: Number(params.id) }, body });
    }, {
    params: t.Object({
        id: t.Numeric({ minimum: 1, description: "Unit Pelaksanaan Teknis ID" }),
    }),
    body: t.Object({
        nama_organisasi: t.Optional(t.String({ minLength: 1, description: "Nama organisasi" })),
        pimpinan: t.Optional(t.String({ minLength: 1, description: "Nama pimpinan" })),
        regencies_id: t.Optional(t.Number({ minimum: 1, description: "Regency ID" })),
    }),
    detail: {
        tags: ["Unit Pelaksanaan Teknis"],
        summary: "Update unit pelaksanaan teknis",
        description: "Mengupdate unit pelaksanaan teknis berdasarkan ID",
    },
    })
    .delete("/unit-pelaksanaan-teknis/:id", async ({ params }) => {
        return await unitPelaksanaanTeknisHandler.delete({ params: { id: Number(params.id) } });
    }, {
    params: t.Object({
        id: t.Numeric({ minimum: 1, description: "Unit Pelaksanaan Teknis ID" }),
    }),
    detail: {
        tags: ["Unit Pelaksanaan Teknis"],
        summary: "Delete unit pelaksanaan teknis",
        description: "Menghapus unit pelaksanaan teknis berdasarkan ID",
    },
});
