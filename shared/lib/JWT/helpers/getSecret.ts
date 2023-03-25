import { importJWK, importPKCS8, importSPKI, KeyLike } from "jose";
import { getTextEncoder } from "../../TextEncoder/index.js";
import { SecretType } from "../types.js";
import { loadSecret } from "./loadSecret.js";

export function getGetSecret(params: Awaited<ReturnType<typeof loadSecret>>) {
  return (type: "public" | "private"): KeyLike | Uint8Array => {
    if ("secret" in params) {
      return params.secret;
    }

    if ("jwk" in params) {
      return params.jwk;
    }

    if ("privateKey" in params) {
      if (type === "public") {
        return params.publicKey;
      }

      return params.privateKey;
    }

    throw new Error("Invalid secret type");
  };
}
