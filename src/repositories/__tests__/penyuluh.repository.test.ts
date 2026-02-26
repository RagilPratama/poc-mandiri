import { describe, it, expect, beforeAll } from "bun:test";
import { PenyuluhRepository } from "../penyuluh.repository";

describe("PenyuluhRepository", () => {
  let repo: PenyuluhRepository;

  beforeAll(() => {
    repo = new PenyuluhRepository();
  });

  it("should fetch all penyuluh with pagination", async () => {
    const result = await repo.findAll({
      page: 1,
      limit: 10,
    });

    expect(result).toBeDefined();
    expect(Array.isArray(result.data)).toBe(true);
    expect(result.pagination).toBeDefined();
  });

  it("should search penyuluh by name", async () => {
    const result = await repo.findAll({
      page: 1,
      limit: 10,
      search: "Penyuluh",
    });

    expect(result.data).toBeDefined();
    if (result.data.length > 0) {
      expect(
        result.data.some((p: any) =>
          p.nama?.toLowerCase().includes("penyuluh")
        )
      ).toBe(true);
    }
  });

  it("should fetch penyuluh by ID", async () => {
    const allResult = await repo.findAll({ page: 1, limit: 1 });
    if (allResult.data.length > 0) {
      const penyuluh = allResult.data[0];
      const result = await repo.findById(penyuluh.id);
      expect(result).toBeDefined();
      if (result) {
        expect(result.id).toBe(penyuluh.id);
        expect(result.nip).toBeDefined();
      }
    }
  });

  it("should have required fields in penyuluh", async () => {
    const result = await repo.findAll({ page: 1, limit: 1 });
    if (result.data.length > 0) {
      const penyuluh = result.data[0];
      expect(penyuluh.nama).toBeDefined();
      expect(penyuluh.nip).toBeDefined();
      expect(penyuluh.upt_nama).toBeDefined();
      expect(penyuluh.province_name).toBeDefined();
    }
  });

  it("should return null for non-existent ID", async () => {
    const result = await repo.findById(999999);
    expect(result).toBeNull();
  });
});
