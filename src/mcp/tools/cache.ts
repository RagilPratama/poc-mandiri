import { redisClient } from "../../redis.js";

interface Tool {
  name: string;
  description: string;
  inputSchema: object;
  handler: (args: unknown) => Promise<unknown>;
}

const handleError = (error: unknown): string => {
  return error instanceof Error ? error.message : String(error);
};

export const cacheTools: Tool[] = [
  {
    name: "cache_get",
    description: "Get a value from Redis cache by key",
    inputSchema: {
      type: "object",
      properties: {
        key: { type: "string", description: "Cache key" },
      },
      required: ["key"],
    },
    handler: async (args: unknown) => {
      try {
        const { key } = args as Record<string, unknown>;
        if (!redisClient.isOpen) throw new Error("Redis not connected");
        const value = await redisClient.get(key as string);
        return {
          key,
          value: value ? JSON.parse(value) : null,
          found: value !== null,
        };
      } catch (error) {
        throw new Error(`Failed to get cache: ${handleError(error)}`);
      }
    },
  },
  {
    name: "cache_set",
    description: "Set a value in Redis cache with optional TTL",
    inputSchema: {
      type: "object",
      properties: {
        key: { type: "string", description: "Cache key" },
        value: { type: "string", description: "Value (JSON stringified)" },
        ttlSeconds: { type: "number", description: "Time to live in seconds (optional)" },
      },
      required: ["key", "value"],
    },
    handler: async (args: unknown) => {
      try {
        const { key, value, ttlSeconds } = args as Record<string, unknown>;
        if (!redisClient.isOpen) throw new Error("Redis not connected");

        if (ttlSeconds) {
          await redisClient.setEx(key as string, ttlSeconds as number, value as string);
        } else {
          await redisClient.set(key as string, value as string);
        }

        return {
          key,
          set: true,
          ttlSeconds: ttlSeconds || null,
        };
      } catch (error) {
        throw new Error(`Failed to set cache: ${handleError(error)}`);
      }
    },
  },
  {
    name: "cache_delete",
    description: "Delete a key from Redis cache",
    inputSchema: {
      type: "object",
      properties: {
        key: { type: "string", description: "Cache key" },
      },
      required: ["key"],
    },
    handler: async (args: unknown) => {
      try {
        const { key } = args as Record<string, unknown>;
        if (!redisClient.isOpen) throw new Error("Redis not connected");
        const deleted = await redisClient.del(key as string);
        return {
          key,
          deleted: deleted === 1,
        };
      } catch (error) {
        throw new Error(`Failed to delete cache: ${handleError(error)}`);
      }
    },
  },
  {
    name: "cache_keys_by_pattern",
    description: "Find keys in Redis matching a pattern",
    inputSchema: {
      type: "object",
      properties: {
        pattern: { type: "string", description: "Pattern (e.g., 'province:*')" },
      },
      required: ["pattern"],
    },
    handler: async (args: unknown) => {
      try {
        const { pattern } = args as Record<string, unknown>;
        if (!redisClient.isOpen) throw new Error("Redis not connected");
        const keys = await redisClient.keys(pattern as string);
        return {
          pattern,
          count: keys.length,
          keys: keys.slice(0, 100),
        };
      } catch (error) {
        throw new Error(`Failed to search cache keys: ${handleError(error)}`);
      }
    },
  },
  {
    name: "cache_flush_all",
    description: "WARNING: Clear all keys from Redis cache",
    inputSchema: {
      type: "object",
      properties: {
        confirm: { type: "boolean", description: "Must be true to confirm" },
      },
      required: ["confirm"],
    },
    handler: async (args: unknown) => {
      try {
        const { confirm } = args as Record<string, unknown>;
        if (!confirm) throw new Error("Cache flush requires confirm: true");

        if (!redisClient.isOpen) throw new Error("Redis not connected");
        await redisClient.flushAll();
        return { flushed: true, message: "All cache cleared" };
      } catch (error) {
        throw new Error(`Failed to flush cache: ${handleError(error)}`);
      }
    },
    },
  },
];
