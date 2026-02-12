import { Elysia, t } from "elysia";
import { authMiddleware } from "../middlewares/auth.middleware";
import { clerkClient } from "../config/clerk";

export const authRoutes = new Elysia({ prefix: "/api/auth" })
  // Health check endpoint
.get("/health", () => {
return {
    success: true,
    message: "Auth service is running",
    clerkConfigured: !!(process.env.CLERK_SECRET_KEY && process.env.CLERK_PUBLISHABLE_KEY),
};
}, {
detail: {
    tags: ["Authentication"],
    summary: "Health check",
    description: "Check if authentication service is running and configured",
    operationId: "healthCheck",
},
})

// Create a test user (for development)
.post("/create-test-user", async ({ body }) => {
try {
    // Check if Clerk is configured
    if (!process.env.CLERK_SECRET_KEY) {
    return {
        success: false,
        error: "Clerk not configured",
        message: "CLERK_SECRET_KEY is not set in environment variables",
    };
    }

    const { email, password, username, firstName, lastName } = body as {
    email: string;
    password: string;
    username?: string;
    firstName?: string;
    lastName?: string;
    };

    // Create user with proper error handling
    try {
    const userData: any = {
        emailAddress: [email],
        password,
        firstName: firstName || "Test",
        lastName: lastName || "User",
    };

    // Add username if provided
    if (username) {
        userData.username = username;
    }

    const user = await clerkClient.users.createUser(userData);

    return {
        success: true,
        data: {
        userId: user.id,
        email: user.emailAddresses[0]?.emailAddress,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        message: "User created successfully. Now login via Clerk Dashboard to create a session, then use /api/auth/get-token",
        },
    };
    } catch (clerkError: any) {
    // Handle specific Clerk errors
    if (clerkError.errors) {
        return {
        success: false,
        error: "Clerk API Error",
        message: clerkError.errors[0]?.message || "Failed to create user",
        details: clerkError.errors,
        };
    }
    throw clerkError;
    }
} catch (error: any) {
    console.error("Create user error:", error);
    return {
    success: false,
    error: "Failed to create user",
    message: error.message || "Unknown error occurred",
    };
}
}, {
body: t.Object({
    email: t.String({ format: "email", description: "User email address" }),
    password: t.String({ minLength: 8, description: "User password (min 8 characters)" }),
    username: t.Optional(t.String({ minLength: 3, description: "Username (optional, min 3 characters)" })),
    firstName: t.Optional(t.String({ description: "First name" })),
    lastName: t.Optional(t.String({ description: "Last name" })),
}),
detail: {
    tags: ["Authentication"],
    summary: "Create test user (Development only)",
    description: "Create a test user for development purposes. Requires CLERK_SECRET_KEY to be configured.",
    operationId: "createTestUser",
},
})

// Get user by email (for testing/development)
.post("/get-token", async ({ body }) => {
try {
    if (!process.env.CLERK_SECRET_KEY) {
    return {
        success: false,
        error: "Clerk not configured",
        message: "CLERK_SECRET_KEY is not set in environment variables",
    };
    }

    const { email } = body as { email: string };

    try {
    // Find user by email
    const users = await clerkClient.users.getUserList({ 
        emailAddress: [email],
        limit: 1,
    });

    if (!users || !users.data || users.data.length === 0) {
        return {
        success: false,
        error: "User not found",
        message: "No user found with this email address. Create user first using /api/auth/create-test-user",
        };
    }

    const user = users.data[0];

    // Get user's sessions
    const sessions = await clerkClient.sessions.getSessionList({ 
        userId: user.id,
        status: "active",
    });

    if (!sessions || !sessions.data || sessions.data.length === 0) {
        return {
        success: false,
        error: "No active session",
        message: "User has no active sessions. Please login via Clerk Dashboard first: Go to Users → Click user → 'Sign in as user'",
        hint: "Visit https://dashboard.clerk.com",
        };
    }

    // Get the most recent active session
    const activeSession = sessions.data[0];

    return {
        success: true,
        data: {
        token: activeSession.id,
        user: {
            id: user.id,
            email: user.emailAddresses[0]?.emailAddress,
            firstName: user.firstName,
            lastName: user.lastName,
        },
        message: "Use this token in Authorization header as: Bearer <token>",
        },
    };
    } catch (clerkError: any) {
    if (clerkError.errors) {
        return {
        success: false,
        error: "Clerk API Error",
        message: clerkError.errors[0]?.message || "Failed to get token",
        details: clerkError.errors,
        };
    }
    throw clerkError;
    }
} catch (error: any) {
    console.error("Get token error:", error);
    return {
    success: false,
    error: "Failed to get token",
    message: error.message || "Unknown error occurred",
    };
}
}, {
body: t.Object({
    email: t.String({ format: "email", description: "User email address" }),
}),
detail: {
    tags: ["Authentication"],
    summary: "Get session token by email (Development only)",
    description: "Get active session token for a user by email. User must have logged in via Clerk frontend first.",
    operationId: "getTokenByEmail",
},
})

// Public endpoint - Get current user info (if authenticated)
.get("/me", async ({ request }) => {
const authHeader = request.headers.get("authorization");

if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return {
    success: false,
    error: "Not authenticated",
    message: "Missing or invalid Authorization header. Format: Bearer <token>",
    data: null,
    };
}

const token = authHeader.substring(7);

try {
    if (!process.env.CLERK_SECRET_KEY) {
    return {
        success: false,
        error: "Clerk not configured",
        message: "CLERK_SECRET_KEY is not set",
        data: null,
    };
    }

    // Get session by token
    const session = await clerkClient.sessions.getSession(token);

    if (!session) {
    return {
        success: false,
        error: "Invalid token",
        message: "Session not found or expired",
        data: null,
    };
    }

    const user = await clerkClient.users.getUser(session.userId);

    return {
    success: true,
    data: {
        id: user.id,
        email: user.emailAddresses[0]?.emailAddress,
        firstName: user.firstName,
        lastName: user.lastName,
        createdAt: user.createdAt,
    },
    };
} catch (error: any) {
    console.error("Get me error:", error);
    return {
    success: false,
    error: "Authentication failed",
    message: error.message || "Token verification failed",
    data: null,
    };
}
}, {
detail: {
    tags: ["Authentication"],
    summary: "Get current user",
    description: "Get authenticated user information. Requires Bearer token in Authorization header.",
    operationId: "getCurrentUser",
},
})

// Protected endpoint example
.use(authMiddleware)
.get("/profile", async (context) => {
const { user } = context as any;
return {
    success: true,
    data: user,
    message: "Successfully authenticated!",
};
}, {
detail: {
    tags: ["Authentication"],
    summary: "Get user profile (Protected)",
    description: "Get authenticated user profile - requires valid Bearer token",
    security: [{ bearerAuth: [] }],
    operationId: "getUserProfile",
},
});
