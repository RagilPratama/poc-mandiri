import { describe, it, expect, beforeAll } from "bun:test";
import { KelompokNelayanRepository } from "../kelompok-nelayan.repository";

describe("KelompokNelayanRepository", () => {
  let repo: KelompokNelayanRepository;

  beforeAll(() => {
    repo = new KelompokNelayanRepository();
  });

  it("should fetch all kelompok nelayan with pagination", async () => {
    const result = await repo.findAll({
      page: 1,
      limit: 10,
    });

    expect(result).toBeDefined();
    expect(Array.isArray(result.data)).toBe(true);
    expect(result.pagination).toBeDefined();
  });

  it("should search kelompok nelayan by name", async () => {
    const result = await repo.findAll({
      page: 1,
      limit: 10,
      search: "Kelompok",
    });

    expect(result.data).toBeDefined();
    if (result.data.length > 0) {
      expect(
        result.data.some((k: any) =>
          k.nama_kelompok?.toLowerCase().includes("kelompok")
        )
      ).toBe(true);
    }
  });

  it("should filter by province_id", async () => {
    const result = await repo.findAll({
      page: 1,
      limit: 10,
      province_id: 11,
    });

    expect(result.data).toBeDefined();
    if (result.data.length > 0) {
      expect(result.data.every((k: any) => k.province_id === 11)).toBe(true);
    }
  });

  it("should fetch kelompok nelayan by ID", async () => {
    const allResult = await repo.findAll({ page: 1, limit: 1 });
    if (allResult.data.length > 0) {
      const kelompok = allResult.data[0];
      const result = await repo.findById(kelompok.id);
      expect(result).toBeDefined();
      if (result) {
        expect(result.id).toBe(kelompok.id);
        expect(result.nib_kelompok).toBeDefined();
      }
    }
  });

  it("should return null for non-existent ID", async () => {
    const result = await repo.findById(999999);
    expect(result).toBeNull();
  });
});
