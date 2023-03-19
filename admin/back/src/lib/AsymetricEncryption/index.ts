import { ADMIN_CONFIG } from "../../config.js";
import { isAbsolute, sep } from "path";
import { subtle } from "crypto";
import { readFile } from "fs/promises";

let loadedPublicKey: string | null = null;

export const getPublicKey = async () => {
  const PEM = ADMIN_CONFIG.adminUser.publicKey;
  if (!PEM) {
    throw new Error("PEM is not defined");
  }

  if (PEM.includes(sep) && isAbsolute(PEM)) {
    if (loadedPublicKey) return loadedPublicKey;

    try {
      const fileContent = await readFile(PEM);
      loadedPublicKey = fileContent.toString("utf-8");
      return loadedPublicKey;
    } catch (error) {
      throw new Error(`Failed to read the file ${PEM}`);
    }
  }

  return PEM;
};

export const getPrivateKey = async () => {
  const PEM = ADMIN_CONFIG.adminUser.privateKey;
  if (!PEM) {
    throw new Error("PEM is not defined");
  }

  if (PEM.includes(sep) && isAbsolute(PEM)) {
    try {
      const fileContent = await readFile(PEM);
      return fileContent.toString("utf-8");
    } catch (error) {
      throw new Error(`Failed to read the file ${PEM}`);
    }
  }

  return PEM;
};

export const generateHashFromPublicKey = async (publicKey: string) => {
  const hash = await subtle.digest("SHA-256", Buffer.from(publicKey));
  return Buffer.from(hash).toString("hex");
};
