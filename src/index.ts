import { Elysia, t } from "elysia";
import { swagger } from "@elysiajs/swagger";
import { pool } from "./db";
import { connectRedis, disconnectRedis, redisClient } from "./redis";
import { provinceHandlers } from "./handlers/province.handler";
import { regencyHandlers } from "./handlers/regency.handler";
import { districtHandlers } from "./handlers/district.handler";
import { villageHandlers } from "./handlers/village.handler";
import { warmupCache } from "./utils/cache-warmer";

const port = process.env.PORT || 3000;

// Connect to Redis on startup
await connectRedis();

// Warmup cache setelah Redis connect
warmupCache().catch(console.error);

const app = new Elysia()
  .use(swagger({
    path: "/swagger",
    documentation: {
      info: {
        title: "Myfirst Elysia API",
        version: "1.0.0",
        description: "API documentation untuk Myfirst Elysia dengan Redis caching dan Gzip compression",
      },
    },
  }))

  // macam-macam get
  .get("/", () => "Hello Elysia")
  //Cek Redis
  .get("/api/cache/keys", async () => {
    const keys = await redisClient.keys("*");
    return { keys, total: keys.length };
  }, {
    detail: {
      tags: ["Cache"],
      summary: "Get all Redis cache keys",
      description: "Menampilkan semua keys yang tersimpan di Redis cache",
    },
  })
  .get("/api/cache/:key", async ({ params }) => {
    const value = await redisClient.get(params.key);
    return { key: params.key, value: value ? JSON.parse(value) : null };
  }, {
    detail: {
      tags: ["Cache"],
      summary: "Get cache value by key",
      description: "Menampilkan nilai cache berdasarkan key yang diberikan",
    },
  })
  // Province routes
  .get("/api/provinces", async () => {
    return await provinceHandlers.getAllProvinces();
  }, {
    detail: {
      tags: ["Province"],
      summary: "Get all provinces",
      description: "Menampilkan semua provinsi dengan data latitude dan longitude",
    },
  })
  .get("/api/provinces/search", async ({ query }) => {
    return await provinceHandlers.searchProvinces({ query });
  }, {
    detail: {
      tags: ["Province"],
      summary: "Search provinces",
      description: "Mencari provinsi berdasarkan nama atau nama alternatif",
      parameters: [
        {
          name: "q",
          in: "query",
          required: true,
          description: "Search term for province name",
          schema: { type: "string" },
        },
      ],
    },
  })
  .get("/api/provinces/:id", async ({ params }) => {
    return await provinceHandlers.getProvinceById({ params: { id: Number(params.id) } });
  }, {
    detail: {
      tags: ["Province"],
      summary: "Get province by ID",
      description: "Menampilkan detail provinsi berdasarkan ID",
    },
  })
  // Regency routes
  .get("/api/regencies", async () => {
    return await regencyHandlers.getAllRegencies();
  }, {
    detail: {
      tags: ["Regency"],
      summary: "Get all regencies",
      description: "Menampilkan semua kabupaten/kota dengan data latitude dan longitude",
    },
  })
  .get("/api/regencies/search", async ({ query }) => {
    return await regencyHandlers.searchRegencies({ query });
  }, {
    detail: {
      tags: ["Regency"],
      summary: "Search regencies",
      description: "Mencari kabupaten/kota berdasarkan nama",
      parameters: [
        {
          name: "q",
          in: "query",
          required: true,
          description: "Search term for regency name",
          schema: { type: "string" },
        },
      ],
    },
  })
  .get("/api/regencies/province/:province_id", async ({ params }) => {
    return await regencyHandlers.getRegenciesByProvinceId({ params: { province_id: Number(params.province_id) } });
  }, {
    detail: {
      tags: ["Regency"],
      summary: "Get regencies by province ID",
      description: "Menampilkan semua kabupaten/kota berdasarkan province ID",
    },
  })
  .get("/api/regencies/:id", async ({ params }) => {
    return await regencyHandlers.getRegencyById({ params: { id: Number(params.id) } });
  }, {
    detail: {
      tags: ["Regency"],
      summary: "Get regency by ID",
      description: "Menampilkan detail kabupaten/kota berdasarkan ID",
    },
  })
  // District routes
  .get("/api/districts", async () => {
    return await districtHandlers.getAllDistricts();
  }, {
    detail: {
      tags: ["District"],
      summary: "Get all districts",
      description: "Menampilkan semua kecamatan dengan data latitude dan longitude",
    },
  })
  .get("/api/districts/search", async ({ query }) => {
    return await districtHandlers.searchDistricts({ query });
  }, {
    detail: {
      tags: ["District"],
      summary: "Search districts",
      description: "Mencari kecamatan berdasarkan nama",
      parameters: [
        {
          name: "q",
          in: "query",
          required: true,
          description: "Search term for district name",
          schema: { type: "string" },
        },
      ],
    },
  })
  .get("/api/districts/regency/:regency_id", async ({ params }) => {
    return await districtHandlers.getDistrictsByRegencyId({ params: { regency_id: Number(params.regency_id) } });
  }, {
    detail: {
      tags: ["District"],
      summary: "Get districts by regency ID",
      description: "Menampilkan semua kecamatan berdasarkan regency ID",
    },
  })
  .get("/api/districts/:id", async ({ params }) => {
    return await districtHandlers.getDistrictById({ params: { id: Number(params.id) } });
  }, {
    detail: {
      tags: ["District"],
      summary: "Get district by ID",
      description: "Menampilkan detail kecamatan berdasarkan ID",
    },
  })
  // Village routes
  .get("/api/villages", async () => {
    return await villageHandlers.getAllVillages();
  }, {
    detail: {
      tags: ["Village"],
      summary: "Get all villages",
      description: "Menampilkan semua desa/kelurahan dengan data latitude dan longitude",
    },
  })
  .get("/api/villages/search", async ({ query }) => {
    return await villageHandlers.searchVillages({ query });
  }, {
    detail: {
      tags: ["Village"],
      summary: "Search villages",
      description: "Mencari desa/kelurahan berdasarkan nama",
      parameters: [
        {
          name: "q",
          in: "query",
          required: true,
          description: "Search term for village name",
          schema: { type: "string" },
        },
      ],
    },
  })
  .get("/api/villages/district/:district_id", async ({ params }) => {
    return await villageHandlers.getVillagesByDistrictId({ params: { district_id: Number(params.district_id) } });
  }, {
    detail: {
      tags: ["Village"],
      summary: "Get villages by district ID",
      description: "Menampilkan semua desa/kelurahan berdasarkan district ID",
    },
  })
  .get("/api/villages/:id", async ({ params }) => {
    return await villageHandlers.getVillageById({ params: { id: Number(params.id) } });
  }, {
    detail: {
      tags: ["Village"],
      summary: "Get village by ID",
      description: "Menampilkan detail desa/kelurahan berdasarkan ID",
    },
  })
  .listen(port);


  console.log(
    `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
  );


// Graceful shutdown
process.on("SIGTERM", async () => {
  console.log("Closing database connection pool and Redis...");
  await disconnectRedis();
  await pool.end();
  process.exit(0);
});

process.on("SIGINT", async () => {
  console.log("Closing database connection pool and Redis...");
  await disconnectRedis();
  await pool.end();
  process.exit(0);
});
