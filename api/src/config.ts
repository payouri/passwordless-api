import { config as dotEnvConfig } from "dotenv";

dotEnvConfig({});

export const PORT = +(process.env.PORT || 3000);
