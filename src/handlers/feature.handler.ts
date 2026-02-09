import { FeatureRepository } from "../repositories/feature.repository";

const featureRepo = new FeatureRepository();

export const featureHandlers = {
  async getAllFeature() {
    try {
      console.log("📋 Fetching all features...");
      const features = await featureRepo.getAllFeatures();
      return {
        success: true,
        data: features,
      };
    } catch (error) {
      console.error("❌ Error fetching features:", error);
      return {
        success: false,
        error: "Failed to fetch features",
        message: error instanceof Error ? error.message : "Unknown error",
      };
    }
  },
};
