import {
  createJWTManager,
  JWTAlgorithm,
  JWTEncryptionAlgorithm,
} from "../../../../../shared/lib/JWT/index.js";
import { getPrivateKey, getPublicKey } from "../AsymetricEncryption/index.js";

let jwt: ReturnType<typeof createJWTManager>;

export const getJWTManager = async () => {
  if (!jwt) {
    const [privateKey, publicKey] = await Promise.all([
      getPrivateKey(),
      getPublicKey(),
    ]);

    jwt = createJWTManager({
      algorithm: JWTAlgorithm.RSA_OAEP_256,
      encryption: JWTEncryptionAlgorithm.A128GCM,
      getDefaultTokenExpiration: () => {
        return `${60 * 60 * 24 * 7}h`;
      },
      issuer: "admin_panel",
      privateKey,
      publicKey,
    });
  }

  return jwt;
};
