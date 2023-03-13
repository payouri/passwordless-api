import { config as dotEnvConfig } from "dotenv";

dotEnvConfig({});

export const PORT = +(process.env.PORT || 3001);

export const PEM = process.env.PEM || "";

export const API_BASE_URL = process.env.API_BASE_URL || "";
