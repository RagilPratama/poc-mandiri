export const config = {
  port: process.env.PORT || 3000,
  database: {
    url: process.env.DATABASE_URL || "",
  },
  redis: {
    url: process.env.REDIS_URL || "redis://localhost:6379",
  },
  imagekit: {
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY || "",
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY || "",
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT || "",
  },
  app: {
    name: "POC API",
    version: "1.0.0",
    description: "API documentation untuk Myfirst Elysia dengan Redis caching dan Gzip compression",
  },
} as const;
