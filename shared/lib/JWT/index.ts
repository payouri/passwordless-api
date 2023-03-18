import { getSecret } from "./helpers/getSecret";
import { getSignToken, SignType } from "./methods/signToken/index.js";
import { getEncryptToken, EncryptType } from "./methods/encryptToken/index.js";
import { JWTEncryptionAlgorithm, JWTExpirationType, SecretType } from "./types";
import { getUnsecureCreate } from "./methods/unsecureCreate";
import { getUnsecureDecode } from "./methods/unsecureDecode";
import { generateTokenId } from "./helpers/generateTokenId";
import { getVerifyToken } from "./methods/verifyToken";
import { getDecodeToken } from "./methods/decodeToken";

export type JWTManagerParams = SecretType & {
  issuer: string;
  encryption: JWTEncryptionAlgorithm;
  getDefaultTokenExpiration: () => JWTExpirationType;
  generateUniqTokenId?: () => string;
};

export const createJWTManager = async function (params: JWTManagerParams) {
  const secret = await getSecret(params);

  const sign = getSignToken({
    type: SignType.SIGN,
    algorithm: params.algorithm,
    secret: secret,
    issuer: params.issuer,
  });

  const encrypt = getEncryptToken({
    type: EncryptType.ENCRYPT,
    algorithm: params.algorithm,
    encryption: params.encryption,
    secret,
    issuer: params.issuer,
  });

  const verify = getVerifyToken({
    encryption: params.encryption,
    issuer: params.issuer,
    secret,
  });

  const decode = getDecodeToken({
    encryption: params.encryption,
    issuer: params.issuer,
    secret,
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
    encrypt,
    sign,
    verify,
    decode,
    unsecure,
  };
};
