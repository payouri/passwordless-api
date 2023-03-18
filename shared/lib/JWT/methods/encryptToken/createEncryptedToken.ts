import * as JWT from "jose";
import {
  JWTAlgorithm,
  JWTEncryptionAlgorithm,
  JWTExpirationType,
} from "../../types";

export type GetCreateEncryptedTokenParams = {
  secret: JWT.KeyLike | Uint8Array;
  algorithm: JWTAlgorithm;
  encryption: JWTEncryptionAlgorithm;
  issuer: string;
};

export const getCreateEncryptedToken = function <
  Payload extends JWT.JWTPayload
>(params: GetCreateEncryptedTokenParams) {
  const { secret, algorithm, issuer, encryption } = params;
  return function ({
    audience,
    expiresIn,
    payload,
  }: {
    payload: Payload;
    expiresIn: JWTExpirationType;
    audience?: string | string[];
  }) {
    const token = new JWT.EncryptJWT(payload)
      .setProtectedHeader({
        alg: algorithm,
        enc: encryption,
      })
      .setIssuer(issuer)
      .setIssuedAt()
      .setExpirationTime(expiresIn);

    if (audience) {
      token.setAudience(audience);
    }

    return token.encrypt(secret);
  };
};
