import { Elysia, t } from "elysia";
import { swagger } from "@elysiajs/swagger";
import { pool } from "./db";
import { connectRedis, disconnectRedis, redisClient } from "./redis";
import { menuHandlers } from "./handlers/menu.handler";
import { featureHandlers } from "./handlers/feature.handler";
import { productHandlers } from "./handlers/products.handler";
const port = process.env.PORT || 3000;

// Connect to Redis on startup
await connectRedis();

const app = new Elysia()
  .use(swagger({
    path: "/swagger",
    documentation: {
      info: {
        title: "Myfirst Elysia API",
        version: "1.0.0",
        description: "API documentation untuk Myfirst Elysia dengan Redis caching",
      },
    },
  }))

  // macam-macam get
  .get("/", () => "Hello Elysia")
  // Static path - akan match persis dengan /id/1
  .get("/id/1", () => "static path")
  // Dynamic path - akan match /id/apapun (contoh: /id/2, /id/abc, /id/123)
  .get("/id/:id", ({ params }) => {
    return `dynamic path - ID: ${params.id}`;
  })
  // Wildcard path - akan match /id/ diikuti apapun (termasuk nested paths)
  .get("/id/*", () => "wildcard path")
  

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
  // Menu API endpoints
  .get("/api/menus", menuHandlers.getAllMenus, {
    detail: {
      tags: ["Menus"],
      summary: "Get all menus",
      description: "Mengambil semua data menu dengan caching Redis 5 Menit",
    },
  })
  .get("/api/features", featureHandlers.getAllFeature, {
    detail: {
      tags: ["Features"],
      summary: "Get all features",
      description: "Mengambil semua data fitur",
    },
  })
  .get("/api/products", productHandlers.getAllProducts, {
    query: t.Object({
      page: t.Optional(t.Numeric()),
      limit: t.Optional(t.Numeric())
    })
    ,
    detail: {
      tags: ["Products"],
      summary: "Get all products",
      description: "Mengambil semua data produk",
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
