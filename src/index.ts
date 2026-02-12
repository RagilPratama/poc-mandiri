import { Elysia, t } from "elysia";
import { swagger } from "@elysiajs/swagger";
import { pool } from "./db";
import { connectRedis, disconnectRedis, redisClient } from "./redis";
import { provinceHandlers } from "./handlers/province.handler";
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
