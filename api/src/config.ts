import { config as dotEnvConfig } from "dotenv";
import { fileURLToPath } from "url";
import path from "path";

dotEnvConfig({
  path: path.join(fileURLToPath(import.meta.url), "..", "..", ".env"),
});

export const PORT = +(process.env.PORT || 3000);
export const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017";
