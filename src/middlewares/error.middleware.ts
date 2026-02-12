import { Elysia } from "elysia";

export const errorMiddleware = new Elysia()
  .onError(({ code, error, set }) => {
    console.error("Error:", error);

    switch (code) {
      case "VALIDATION":
        set.status = 400;
        return {
          success: false,
          error: "Validation Error",
          message: error.toString(),
        };

      case "NOT_FOUND":
        set.status = 404;
        return {
          success: false,
          error: "Not Found",
          message: error.toString(),
        };

      case "PARSE":
        set.status = 400;
        return {
          success: false,
          error: "Parse Error",
          message: "Invalid request format",
        };

      case "INTERNAL_SERVER_ERROR":
        set.status = 500;
        return {
          success: false,
          error: "Internal Server Error",
          message: "Something went wrong",
        };

      default:
        set.status = 500;
        return {
          success: false,
          error: "Unknown Error",
          message: error.toString() || "An unexpected error occurred",
        };
    }
  });
