import { createClient } from "redis";

const REDIS_URL = process.env.REDIS_URL || "redis://localhost:6379";

export const redisClient = createClient({
  url: REDIS_URL,
});

redisClient.on("error", (err) => {
  console.error("Redis Client Error:", err);
});

redisClient.on("connect", () => {
  console.log("✅ Connected to Redis");
});

redisClient.on("ready", () => {
  console.log("✅ Redis is ready");
});

// Connect to Redis
export async function connectRedis() {
  try {
    if (!redisClient.isOpen) {
      await redisClient.connect();
    }
  } catch (error) {
    console.error("Failed to connect to Redis:", error);
    // Don't throw - allow app to continue without Redis
  }
}

// Disconnect from Redis
export async function disconnectRedis() {
  try {
    await redisClient.quit();
    console.log("✅ Redis connection closed");
  } catch (error) {
    console.error("Error closing Redis connection:", error);
  }
}

// Cache helper functions
export async function getCache<T>(key: string): Promise<T | null> {
  try {
    const cached = await redisClient.get(key);
    return cached ? JSON.parse(cached) : null;
  } catch (error) {
    console.error(`Error getting cache for key ${key}:`, error);
    return null;
  }
}

export async function setCache<T>(
  key: string,
  value: T,
  ttl: number = 3600
): Promise<void> {
  try {
    await redisClient.setEx(key, ttl, JSON.stringify(value));
  } catch (error) {
    console.error(`Error setting cache for key ${key}:`, error);
  }
}

export async function deleteCache(key: string): Promise<void> {
  try {
    await redisClient.del(key);
  } catch (error) {
    console.error(`Error deleting cache for key ${key}:`, error);
  }
}

export async function clearAllCache(): Promise<void> {
  try {
    await redisClient.flushDb();
  } catch (error) {
    console.error("Error clearing all cache:", error);
  }
}
