import { PEM } from "../../config.js";
import { isAbsolute, sep } from "path";
import { readFile } from "fs/promises";

export const getPEM = async () => {
  if (!PEM) {
    throw new Error("PEM is not defined");
  }

  if (PEM.includes(sep) && isAbsolute(PEM)) {
    try {
      const fileContent = await readFile(PEM);
      return fileContent;
    } catch (error) {
      throw new Error(`Failed to read the file ${PEM}`);
    }
  }

  return PEM;
};
