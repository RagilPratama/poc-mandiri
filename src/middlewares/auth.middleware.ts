import { Elysia } from "elysia";
import { clerkClient } from "../config/clerk";

export const authMiddleware = new Elysia({ name: "auth" })
  .onBeforeHandle(async ({ request, set }) => {
    const authHeader = request.headers.get("authorization");

    // Check if Authorization header exists
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      set.status = 401;
      return {
        success: false,
        error: "Unauthorized",
        message: "Missing or invalid authorization header. Format: Bearer <token>",
      };
    }

    const token = authHeader.substring(7);

    try {
      // Get session by token
      const session = await clerkClient.sessions.getSession(token);

      if (!session) {
        set.status = 401;
        return {
          success: false,
          error: "Unauthorized",
          message: "Invalid or expired token",
        };
      }

      // Get user details
      const user = await clerkClient.users.getUser(session.userId);

      // Store user in context for use in handlers
      (request as any).user = {
        id: user.id,
        email: user.emailAddresses[0]?.emailAddress,
        firstName: user.firstName,
        lastName: user.lastName,
      };

      // Continue to handler
      return;
    } catch (error: any) {
      console.error("Auth error:", error);
      set.status = 401;
      return {
        success: false,
        error: "Unauthorized",
        message: "Token verification failed",
        details: error.message,
      };
    }
  })
  .derive(({ request }) => {
    // Make user available in context
    return {
      user: (request as any).user || null,
    };
  });

// Optional: Middleware untuk route yang tidak memerlukan auth
export const optionalAuthMiddleware = new Elysia({ name: "optional-auth" })
  .derive(async ({ request }) => {
    const authHeader = request.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return { user: null };
    }

    const token = authHeader.substring(7);

    try {
      const session = await clerkClient.sessions.getSession(token);

      if (!session) {
        return { user: null };
      }

      const user = await clerkClient.users.getUser(session.userId);

      return {
        user: {
          id: user.id,
          email: user.emailAddresses[0]?.emailAddress,
          firstName: user.firstName,
          lastName: user.lastName,
        },
      };
    } catch (error) {
      return { user: null };
    }
  });
