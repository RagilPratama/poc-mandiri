import { ProvinceRepository } from "../repositories/province.repository";
import { RegencyRepository } from "../repositories/regency.repository";
import { DistrictRepository } from "../repositories/district.repository";
import { VillageRepository } from "../repositories/village.repository";

const provinceRepo = new ProvinceRepository();
const regencyRepo = new RegencyRepository();
const districtRepo = new DistrictRepository();
const villageRepo = new VillageRepository();

export async function warmupCache() {
    try {
        await Promise.all([
            provinceRepo.getAllProvinces(),
            regencyRepo.getAllRegencies(),
            districtRepo.getAllDistricts(),
            villageRepo.getAllVillages(),
        ]);
        
    } catch (error) {
        console.error("Cache warmup failed:", error);
    }
}
