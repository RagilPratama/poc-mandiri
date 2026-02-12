import { createClerkClient } from "@clerk/backend";

export const clerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY,
  publishableKey: process.env.CLERK_PUBLISHABLE_KEY,
});

export const clerkConfig = {
  secretKey: process.env.CLERK_SECRET_KEY || "",
  publishableKey: process.env.CLERK_PUBLISHABLE_KEY || "",
};
