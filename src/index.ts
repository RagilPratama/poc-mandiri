import { Elysia } from "elysia";
import { swagger } from "@elysiajs/swagger";
import { cors } from "@elysiajs/cors";
import { pool } from "./db";
import { connectRedis, disconnectRedis } from "./redis";
import { warmupCache } from "./utils/cache-warmer";
import { provinceRoutes, regencyRoutes, districtRoutes, villageRoutes, authRoutes, cacheRoutes, unitPelaksanaanTeknisRoutes, roleRoutes, organisasiRoutes, pegawaiRoutes, kelompokNelayanRoutes, penyuluhRoutes, absensiRoutes } from "./routes";
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
  .onError(({ code, error, set }) => {
    // Handle validation errors globally
    if (code === 'VALIDATION') {
      set.status = 400;
      
      // Extract field name dari error message atau all property
      let field = 'parameter';
      
      // Coba extract dari berbagai format error message
      const patterns = [
        /property '\/(\w+)'/,
        /path: '\/(\w+)'/,
        /"\/(\w+)"/,
      ];
      
      for (const pattern of patterns) {
        const match = error.message.match(pattern);
        if (match) {
          field = match[1];
          break;
        }
      }
      
      return {
        success: false,
        error: 'Validation Error',
        message: `Invalid ${field}: cannot be empty or invalid format`,
      };
    }
    
    // Handle other errors
    if (code === 'NOT_FOUND') {
      set.status = 404;
      return {
        success: false,
        error: 'Not Found',
        message: 'Endpoint not found',
      };
    }
  })
  .use(swagger({
    path: "/swagger",
    documentation: {
      info: {
        title: "POC API",
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
        { name: "Unit Pelaksanaan Teknis", description: "Unit Pelaksanaan Teknis master data" },
        { name: "Roles", description: "Role master data" },
        { name: "Organisasi", description: "Organisasi master data" },
        { name: "Pegawai", description: "Pegawai management" },
        { name: "Kelompok Nelayan", description: "Kelompok Nelayan management" },
        { name: "Penyuluh", description: "Penyuluh management" },
        { name: "Absensi", description: "Absensi management" },
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
  .use(unitPelaksanaanTeknisRoutes)
  .use(roleRoutes)
  .use(organisasiRoutes)
  .use(pegawaiRoutes)
  .use(kelompokNelayanRoutes)
  .use(penyuluhRoutes)
  .use(absensiRoutes)
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
