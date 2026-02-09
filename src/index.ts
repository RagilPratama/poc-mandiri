import { Elysia } from "elysia";
import { pool } from "./db";
import { menuHandlers } from "./handlers/menu.handler";
import { featureHandlers } from "./handlers/feature.handler";

const app = new Elysia()

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
  
  
  // Menu API endpoints
  .get("/api/menus", menuHandlers.getAllMenus)
  .get("/api/features", featureHandlers.getAllFeature)
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);

// Graceful shutdown
process.on("SIGTERM", async () => {
  console.log("Closing database connection pool...");
  await pool.end();
  process.exit(0);
});
