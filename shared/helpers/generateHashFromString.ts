import { createHmac, createHash } from "node:crypto";

export const generateHashFromString = (str: string, secret?: string) => {
  if (secret) {
    return createHmac("sha256", secret).update(str).digest("hex");
  }

  return createHash("sha256").update(str).digest("hex");
};
