import { Elysia, t } from "elysia";
import { redisClient } from "../redis";
import { clerkClient } from "../config/clerk";

// Helper function to verify token
async function verifyAuth(request: Request) {
const authHeader = request.headers.get("authorization");

if (!authHeader || !authHeader.startsWith("Bearer ")) {
return {
    authorized: false,
    error: {
    success: false,
    error: "Unauthorized",
    message: "Missing or invalid authorization header. Format: Bearer <token>",
    },
};
}

const token = authHeader.substring(7);

try {
    const session = await clerkClient.sessions.getSession(token);

    if (!session) {
        return {
            authorized: false,
            error: {
                success: false,
                error: "Unauthorized",
                message: "Invalid or expired token",
            },
    };
}

const user = await clerkClient.users.getUser(session.userId);

return {
    authorized: true,
    user: {
    id: user.id,
    email: user.emailAddresses[0]?.emailAddress,
    firstName: user.firstName,
    lastName: user.lastName,
    },
};
} catch (error: any) {
    
return {
    authorized: false,
    error: {
    success: false,
    error: "Unauthorized",
    message: "Token verification failed",
    details: error.message,
    },
};
}
}

export const cacheRoutes = new Elysia({ prefix: "/api/cache" })
// Get all cache keys
.get("/keys", async ({ request, set }) => {
const auth = await verifyAuth(request);
if (!auth.authorized) {
    set.status = 401;
    return auth.error;
}

try {
    const keys = await redisClient.keys("*");
    return { 
    success: true,
    keys, 
    total: keys.length 
    };
} catch (error) {
    return {
    success: false,
    error: "Failed to get cache keys",
    message: error instanceof Error ? error.message : "Unknown error",
    };
}
}, {
detail: {
    tags: ["Cache"],
    summary: "Get all Redis cache keys (Protected)",
    description: "Menampilkan semua keys yang tersimpan di Redis cache. Requires authentication.",
    security: [{ bearerAuth: [] }],
    operationId: "getAllCacheKeys",
},
})

// Get cache value by key
.get("/:key", async ({ params, request, set }) => {
const auth = await verifyAuth(request);
if (!auth.authorized) {
    set.status = 401;
    return auth.error;
}

try {
    const value = await redisClient.get(params.key);
    return { 
    success: true,
    key: params.key, 
    value: value ? JSON.parse(value) : null,
    exists: !!value,
    };
} catch (error) {
    return {
    success: false,
    error: "Failed to get cache value",
    message: error instanceof Error ? error.message : "Unknown error",
    key: params.key,
    };
}
}, {
params: t.Object({
    key: t.String({ description: "Cache key to retrieve" }),
}),
detail: {
    tags: ["Cache"],
    summary: "Get cache value by key (Protected)",
    description: "Menampilkan nilai cache berdasarkan key yang diberikan. Requires authentication.",
    security: [{ bearerAuth: [] }],
    operationId: "getCacheByKey",
},
})
// Clear all cache
.delete("/", async ({ request, set }) => {
const auth = await verifyAuth(request);
if (!auth.authorized) {
    set.status = 401;
    return auth.error;
}

try {
    await redisClient.flushDb();
    return {
    success: true,
    message: "All cache cleared successfully",
    };
} catch (error) {
    return {
    success: false,
    error: "Failed to clear cache",
    message: error instanceof Error ? error.message : "Unknown error",
    };
}
}, {
detail: {
    tags: ["Cache"],
    summary: "Clear all cache (Protected)",
    description: "Menghapus semua cache dari Redis. Use with caution! Requires authentication.",
    security: [{ bearerAuth: [] }],
    operationId: "clearAllCache",
},
})
