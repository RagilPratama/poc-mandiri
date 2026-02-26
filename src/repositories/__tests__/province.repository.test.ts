import { describe, it, expect, beforeAll } from "bun:test";
import { ProvinceRepository } from "../province.repository";

describe("ProvinceRepository", () => {
  let repo: ProvinceRepository;

  beforeAll(() => {
    repo = new ProvinceRepository();
  });

  it("should fetch all provinces", async () => {
    const provinces = await repo.getAllProvinces();

    expect(provinces).toBeDefined();
    expect(Array.isArray(provinces)).toBe(true);
    expect(provinces.length).toBeGreaterThan(0);
  });

  it("should have required fields in provinces", async () => {
    const provinces = await repo.getAllProvinces();

    if (provinces.length > 0) {
      const province = provinces[0];
      expect(province.id).toBeDefined();
      expect(province.name).toBeDefined();
      expect(province.alt_name).toBeDefined();
      expect(province.latitude).toBeDefined();
      expect(province.longitude).toBeDefined();
    }
  });

  it("should fetch province by ID", async () => {
    const provinces = await repo.getAllProvinces();
    if (provinces.length > 0) {
      const provinceId = provinces[0].id;
      const result = await repo.getProvinceById(provinceId);

      expect(result).toBeDefined();
      if (result) {
        expect(result.id).toBe(provinceId);
        expect(result.name).toBe(provinces[0].name);
      }
    }
  });

  it("should return null for non-existent province", async () => {
    const result = await repo.getProvinceById(999999);
    expect(result).toBeNull();
  });

  it("should contain Indonesia provinces", async () => {
    const provinces = await repo.getAllProvinces();
    const provinceNames = provinces.map((p) => p.name);

    expect(provinceNames).toContain("ACEH");
    expect(provinceNames).toContain("DKI JAKARTA");
    expect(provinceNames).toContain("BALI");
  });
});
