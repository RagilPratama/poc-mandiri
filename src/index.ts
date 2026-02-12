import { Elysia } from "elysia";
import { swagger } from "@elysiajs/swagger";
import { pool } from "./db";
import { connectRedis, disconnectRedis, redisClient } from "./redis";
import { warmupCache } from "./utils/cache-warmer";
import { provinceRoutes, regencyRoutes, districtRoutes, villageRoutes } from "./routes";
import { errorMiddleware } from "./middlewares/error.middleware";

const port = process.env.PORT || 3000;

// Connect to Redis on startup
await connectRedis();

// Warmup cache setelah Redis connect
warmupCache().catch(console.error);

const app = new Elysia()
  .use(errorMiddleware)
  .use(swagger({
    path: "/swagger",
    documentation: {
      info: {
        title: "Myfirst Elysia API",
        version: "1.0.0",
        description: "API documentation untuk Myfirst Elysia dengan Redis caching dan Gzip compression",
      },
      tags: [
        { name: "Cache", description: "Cache management endpoints" },
        { name: "Provinces", description: "Province master data" },
        { name: "Regencies", description: "Regency master data" },
        { name: "Districts", description: "District master data" },
        { name: "Villages", description: "Village master data" },
      ],
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
  
  // Master data routes
  .use(provinceRoutes)
  .use(regencyRoutes)
  .use(districtRoutes)
  .use(villageRoutes)
  
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
