import { z } from "zod";

const envSchema = z.object({
  VITE_API_BASE_URL: z.string().url(),
  VITE_HTTP_PORT: z.string().optional(),
  NODE_ENV: z.enum(["development", "production", "test"]),
});

const rawEnv = {
  VITE_API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
  VITE_HTTP_PORT: import.meta.env.VITE_HTTP_PORT,
  NODE_ENV: import.meta.env.MODE,
};

const env = envSchema.safeParse(rawEnv);

if (!env.success) {
  throw new Error("Invalid environment variables");
}

export const config = {
  API_BASE_URL: env.data.VITE_API_BASE_URL,
  HTTP_PORT: env.data.VITE_HTTP_PORT ? Number(env.data.VITE_HTTP_PORT) : 3000,
  NODE_ENV: env.data.NODE_ENV,
};
