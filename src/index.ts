import { Elysia } from "elysia";
import { swagger } from "@elysiajs/swagger";
import { cors } from "@elysiajs/cors";
import { pool } from "./db";
import { connectRedis, disconnectRedis } from "./redis";
import { warmupCache } from "./utils/cache-warmer";
import { provinceRoutes, regencyRoutes, districtRoutes, villageRoutes, authRoutes, cacheRoutes } from "./routes";
import { errorMiddleware } from "./middlewares/error.middleware";
const port = process.env.PORT || 3000;
await connectRedis();
warmupCache().catch(console.error);

const app = new Elysia()
  .use(cors({
    origin: true, // Allow all origins for development
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  }))
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
        { name: "Authentication", description: "Authentication endpoints using Clerk" },
        { name: "Cache", description: "Cache management endpoints" },
        { name: "Provinces", description: "Province master data" },
        { name: "Regencies", description: "Regency master data" },
        { name: "Districts", description: "District master data" },
        { name: "Villages", description: "Village master data" },
      ],
      components: {
        securitySchemes: {
          bearerAuth: {
            type: "http",
            scheme: "bearer",
            bearerFormat: "JWT",
            description: "Enter your Clerk session token",
          },
        },
      },
    },
  }))
  .get("/", () => "Hello Elysia")
  // Authentication routes
  .use(authRoutes)
  // Cache routes (Protected)
  .use(cacheRoutes)
  
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
