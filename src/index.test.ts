import { describe, it, expect, beforeAll } from "bun:test";
import { Elysia } from "elysia";

describe("Elysia Routes", () => {
  let app: any;

  beforeAll(() => {
    app = new Elysia()
      .get("/", () => "Hello Elysia")
      .get("/id/1", () => "static path")
      .get("/ragil/ganteng", () => "Ragil Ganteng")
      .get("/id/:id", ({ params }) => {
        return `dynamic path - ID: ${params.id}`;
      })
      .get("/id/*", () => "wildcard path");
  });

  describe("GET /", () => {
    it("should return 'Hello Elysia'", async () => {
      const response = await app.handle(
        new Request("http://localhost:3000/")
      );
      const text = await response.text();

      expect(response.status).toBe(200);
      expect(text).toBe("Hello Elysia");
    });
  });

  describe("GET /id/1 - Static Path", () => {
    it("should return 'static path'", async () => {
      const response = await app.handle(
        new Request("http://localhost:3000/id/1")
      );
      const text = await response.text();

      expect(response.status).toBe(200);
      expect(text).toBe("static path");
    });
  });

  describe("GET /ragil/ganteng", () => {
    it("should return 'Ragil Ganteng'", async () => {
      const response = await app.handle(
        new Request("http://localhost:3000/ragil/ganteng")
      );
      const text = await response.text();

      expect(response.status).toBe(200);
      expect(text).toBe("Ragil Ganteng");
    });
  });

  describe("GET /id/:id - Dynamic Path", () => {
    it("should return dynamic path with ID parameter (numeric)", async () => {
      const response = await app.handle(
        new Request("http://localhost:3000/id/2")
      );
      const text = await response.text();

      expect(response.status).toBe(200);
      expect(text).toBe("dynamic path - ID: 2");
    });

    it("should return dynamic path with ID parameter (string)", async () => {
      const response = await app.handle(
        new Request("http://localhost:3000/id/abc")
      );
      const text = await response.text();

      expect(response.status).toBe(200);
      expect(text).toBe("dynamic path - ID: abc");
    });

    it("should return dynamic path with ID parameter (numeric string)", async () => {
      const response = await app.handle(
        new Request("http://localhost:3000/id/123")
      );
      const text = await response.text();

      expect(response.status).toBe(200);
      expect(text).toBe("dynamic path - ID: 123");
    });
  });

  describe("GET /id/* - Wildcard Path", () => {
    it("should return 'dynamic path' for /id/anything (matches dynamic route first)", async () => {
      const response = await app.handle(
        new Request("http://localhost:3000/id/anything")
      );
      const text = await response.text();

      expect(response.status).toBe(200);
      expect(text).toBe("dynamic path - ID: anything");
    });

    it("should return 'wildcard path' for nested paths /id/user/profile", async () => {
      const response = await app.handle(
        new Request("http://localhost:3000/id/user/profile")
      );
      const text = await response.text();

      expect(response.status).toBe(200);
      expect(text).toBe("wildcard path");
    });
  });

  describe("404 Not Found", () => {
    it("should return 404 for undefined routes", async () => {
      const response = await app.handle(
        new Request("http://localhost:3000/nonexistent")
      );

      expect(response.status).toBe(404);
    });
  });
});
