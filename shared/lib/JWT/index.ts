import { generateTokenId } from "./helpers/generateTokenId.js";
import { getGetSecret } from "./helpers/getSecret.js";
import { loadSecret } from "./helpers/loadSecret.js";
import { getDecodeToken } from "./methods/decodeToken/index.js";
import { EncryptType, getEncryptToken } from "./methods/encryptToken/index.js";
import { getSignToken, SignType } from "./methods/signToken/index.js";
import { getUnsecureCreate } from "./methods/unsecureCreate.js";
import { getUnsecureDecode } from "./methods/unsecureDecode.js";
import { getVerifyToken } from "./methods/verifyToken/index.js";
import {
  JWTAlgorithm,
  JWTEncryptionAlgorithm,
  JWTExpirationType,
  SecretType,
} from "./types.js";

export { JWTAlgorithm, JWTEncryptionAlgorithm, JWTExpirationType, SecretType };

export type JWTManagerParams = SecretType & {
  issuer: string;
  encryption: JWTEncryptionAlgorithm;
  getDefaultTokenExpiration: () => JWTExpirationType;
  generateUniqTokenId?: () => string;
};

export const createJWTManager = async function (params: JWTManagerParams) {
  const secret = await loadSecret(params);
  const getSecret = getGetSecret(secret);

  console.log({
    secret,
  });

  const sign = getSignToken({
    type: SignType.SIGN,
    algorithm: params.algorithm,
    secret: getSecret("private"),
    issuer: params.issuer,
  });

  const encrypt = getEncryptToken({
    type: EncryptType.ENCRYPT,
    algorithm: params.algorithm,
    encryption: params.encryption,
    secret: getSecret("public"),
    issuer: params.issuer,
  });

  const verify = getVerifyToken({
    encryption: params.encryption,
    issuer: params.issuer,
    secret: getSecret("public"),
  });

  const decode = getDecodeToken({
    encryption: params.encryption,
    issuer: params.issuer,
    secret: getSecret("private"),
  });

  const unsecure = {
    encode: getUnsecureCreate({
      issuer: params.issuer,
      defaultExpiration: params.getDefaultTokenExpiration(),
      generateUniqTokenId: params.generateUniqTokenId || generateTokenId,
    }),
    decode: getUnsecureDecode({
      issuer: params.issuer,
    }),
  };

  return {
    encrypt: (
      encodeParams: Omit<Parameters<typeof encrypt>[0], "expiresIn"> &
        Partial<Pick<Parameters<typeof encrypt>[0], "expiresIn">>
    ) => {
      return encrypt({
        ...encodeParams,
        expiresIn: encodeParams.expiresIn || params.getDefaultTokenExpiration(),
      });
    },
    sign,
    verify,
    decode,
    unsecure,
  };
};
