import { config as dotEnvConfig } from "dotenv";

dotEnvConfig({});

export const NODE_ENV: "production" | "development" | "test" = [
  "production",
  "development",
  "test",
].includes(process.env.NODE_ENV || "")
  ? (process.env.NODE_ENV as "production" | "development" | "test")
  : "development";

export const PORT = +(process.env.PORT || 3001);

export const API_BASE_URL = process.env.API_BASE_URL || "";

export const API_MONGO_URI = process.env.API_MONGO_URI || "";

export const MONGO_URI = process.env.MONGO_URI || "";

export const ADMIN_CONFIG = {
  adminUser: {
    email: process.env.ADMIN_USER_EMAIL || "john.doe@admin.lol",
    phone: process.env.ADMIN_USER_PHONE || "+33600000000",
    firstName: process.env.ADMIN_USER_FIRST_NAME || "john",
    lastName: process.env.ADMIN_USER_LAST_NAME || "doe",
    publicKey: process.env.PUBLIC_KEY || "",
    privateKey: process.env.PRIVATE_KEY || "",
  },
  adminDomain: {
    name: process.env.ADMIN_DOMAIN_NAME || "admin.lol",
    allowedHosts: process.env.ADMIN_DOMAIN_ALLOWED_HOSTS?.split(",") || [],
    authTypes: process.env.ADMIN_DOMAIN_AUTH_TYPES?.split(",") || [],
    returnURL: process.env.ADMIN_DOMAIN_RETURN_URL || "",
  },
} as const;
