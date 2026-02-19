import { createClient } from "redis";

const REDIS_URL = process.env.REDIS_URL || "redis://localhost:6379";

export const redisClient = createClient({
  url: REDIS_URL,
  socket: {
    reconnectStrategy: (retries) => {
      if (retries > 10) {
        console.log("❌ Redis reconnection failed after 10 attempts");
        return new Error("Redis reconnection failed");
      }
      const delay = Math.min(retries * 100, 3000);
      console.log(`🔄 Reconnecting to Redis... attempt ${retries}, delay ${delay}ms`);
      return delay;
    },
    connectTimeout: 10000,
  },
});

redisClient.on("error", (err) => {
  console.error("Redis Client Error:", err.message);
  // Don't crash the app on Redis errors
});

redisClient.on("connect", () => {
  console.log("✅ Connected to Redis");
});

redisClient.on("ready", () => {
  console.log("✅ Redis is ready");
});

redisClient.on("reconnecting", () => {
  console.log("🔄 Redis reconnecting...");
});

redisClient.on("end", () => {
  console.log("⚠️  Redis connection ended");
});

// Connect to Redis
export async function connectRedis() {
  try {
    if (!redisClient.isOpen) {
      await redisClient.connect();
    }
  } catch (error) {
    console.error("⚠️  Failed to connect to Redis:", error instanceof Error ? error.message : error);
    console.log("⚠️  App will continue without Redis caching");
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

// Cache helper functions with Redis availability check
export async function getCache<T>(key: string): Promise<T | null> {
  try {
    if (!redisClient.isOpen) {
      return null;
    }
    const cached = await redisClient.get(key);
    return cached ? JSON.parse(cached) : null;
  } catch (error) {
    console.error(`Error getting cache for key ${key}:`, error instanceof Error ? error.message : error);
    return null;
  }
}

export async function setCache<T>(
  key: string,
  value: T,
  ttl: number = 3600
): Promise<void> {
  try {
    if (!redisClient.isOpen) {
      return;
    }
    await redisClient.setEx(key, ttl, JSON.stringify(value));
  } catch (error) {
    console.error(`Error setting cache for key ${key}:`, error instanceof Error ? error.message : error);
  }
}

export async function deleteCache(key: string): Promise<void> {
  try {
    if (!redisClient.isOpen) {
      return;
    }
    await redisClient.del(key);
  } catch (error) {
    console.error(`Error deleting cache for key ${key}:`, error instanceof Error ? error.message : error);
  }
}

export async function clearAllCache(): Promise<void> {
  try {
    if (!redisClient.isOpen) {
      return;
    }
    await redisClient.flushDb();
  } catch (error) {
    console.error("Error clearing all cache:", error instanceof Error ? error.message : error);
  }
}
