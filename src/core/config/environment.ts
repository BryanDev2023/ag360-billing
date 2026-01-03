import dotenv from "dotenv";
import { z } from "zod";

// Load environment variables
dotenv.config();

const envSchema = z.object({
  // Server
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  PORT: z.string().default("3002"),

  // DATABASE_MONGODB
  MONGODB: z.string(),
  DB_NAME: z.string(),

  // URLS
  BASE_URL: z.string(),
  PANEL_ADMIN_URL: z.string(),

  // CLOUDINARY
  CLOUDINARY_CLOUD_NAME: z.string(),
  CLOUDINARY_API_KEY: z.string(),
  CLOUDINARY_API_SECRET: z.string(),
});

const env = envSchema.safeParse(process.env!);

if (!env.success) {
  console.error("❌ Invalid environment variables:", env.error.format());
  throw new Error("Invalid environment variables");
}

const config = {
  // Server
  nodeEnv: env.data.NODE_ENV,
  port: parseInt(env.data.PORT, 10),

  // Database
  mongoDB: env.data.MONGODB,

  // Urls
  baseUrl: env.data.BASE_URL,
  panelAdmin: env.data.PANEL_ADMIN_URL,

  // Cloudinary
  cloudinaryCloudName: env.data.CLOUDINARY_CLOUD_NAME,
  cloudinaryApiKey: env.data.CLOUDINARY_API_KEY,
  cloudinaryApiSecret: env.data.CLOUDINARY_API_SECRET,
}

export default config;
