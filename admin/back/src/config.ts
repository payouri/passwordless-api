import { config as dotEnvConfig } from "dotenv";

dotEnvConfig({});

export const PORT = +(process.env.PORT || 3001);

export const PEM = process.env.PEM || "";

export const API_BASE_URL = process.env.API_BASE_URL || "";

export const API_MONGO_URI = process.env.API_MONGO_URI || "";

export const MONGO_URI = process.env.MONGO_URI || "";
