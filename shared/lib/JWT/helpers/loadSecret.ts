import { KeyLike, importJWK, importPKCS8, importSPKI } from "jose";
import { getTextEncoder } from "../../TextEncoder/index.js";
import { SecretType } from "../types.js";

const textEncoder = getTextEncoder();

export async function loadSecret(
  params: SecretType
): Promise<
  | { secret: Uint8Array }
  | { jwk: KeyLike | Uint8Array }
  | { privateKey: KeyLike; publicKey: KeyLike }
> {
  if ("secret" in params) {
    return {
      secret: textEncoder.encode(params.secret),
    };
  }

  if ("jwk" in params) {
    const importResult = await importJWK(params.jwk, params.algorithm);

    return {
      jwk: importResult,
    };
  }

  if ("privateKey" in params) {
    const [privateKey, publicKey] = await Promise.all([
      importPKCS8(params.privateKey, params.algorithm),
      importSPKI(params.publicKey, params.algorithm),
    ]);

    return {
      privateKey,
      publicKey,
    };
  }

  throw new Error("Invalid secret type");
}
