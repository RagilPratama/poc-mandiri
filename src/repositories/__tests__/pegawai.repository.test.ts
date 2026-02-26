import { describe, it, expect, beforeAll } from "bun:test";
import { PegawaiRepository } from "../pegawai.repository";

describe("PegawaiRepository", () => {
  let repo: PegawaiRepository;

  beforeAll(() => {
    repo = new PegawaiRepository();
  });

  it("should fetch all pegawai with pagination", async () => {
    const result = await repo.findAll({
      page: 1,
      limit: 10,
    });

    expect(result).toBeDefined();
    expect(Array.isArray(result.data)).toBe(true);
    expect(result.pagination).toBeDefined();
    expect(result.pagination.total).toBeGreaterThan(0);
  });

  it("should search pegawai by name", async () => {
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

  it("should fetch pegawai by ID", async () => {
    const allResult = await repo.findAll({ page: 1, limit: 1 });
    if (allResult.data.length > 0) {
      const pegawai = allResult.data[0];
      const result = await repo.findById(pegawai.id);
      expect(result).toBeDefined();
      if (result) {
        expect(result.id).toBe(pegawai.id);
        expect(result.nip).toBeDefined();
      }
    }
  });

  it("should return null for non-existent ID", async () => {
    const result = await repo.findById(999999);
    expect(result).toBeNull();
  });

  it("should handle pagination correctly", async () => {
    const page1 = await repo.findAll({ page: 1, limit: 5 });
    const page2 = await repo.findAll({ page: 2, limit: 5 });

    expect(page1.pagination.page).toBe(1);
    expect(page2.pagination.page).toBe(2);
    expect(page1.data[0]?.id).not.toBe(page2.data[0]?.id);
  });
});
