import { type Config } from "drizzle-kit";
import { env } from "~/env";

export default {
  schema: "./src/server/db/schema.ts",
  dialect: "turso",
  dbCredentials: {
    url: env.DATABASE_URL, // Ensure URL is defined and not undefined
    authToken: env.DATABASE_TOKEN, // Ensure the auth token is provided
  },
} satisfies Config;
