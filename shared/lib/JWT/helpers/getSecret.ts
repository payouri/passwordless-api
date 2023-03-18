import { importJWK, importPKCS8 } from "jose";
import { getTextEncoder } from "../../TextEncoder";
import { SecretType } from "../types";

const textEncoder = getTextEncoder();

export async function getSecret(params: SecretType) {
  if ("secret" in params) {
    return textEncoder.encode(params.secret);
  }

  if ("jwk" in params) {
    const importResult = await importJWK(params.jwk, params.algorithm);

    return importResult;
  }

  if ("privateKey" in params) {
    const importResult = await importPKCS8(params.privateKey, params.algorithm);

    return importResult;
  }

  throw new Error("Invalid secret type");
}
