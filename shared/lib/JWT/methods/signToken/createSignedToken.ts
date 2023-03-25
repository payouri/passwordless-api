import * as JWT from "jose";
import { JWTAlgorithm, JWTExpirationType } from "../../types.js";

export type GetCreateSignedTokenParams = {
  secret: JWT.KeyLike | Uint8Array;
  algorithm: JWTAlgorithm;
  issuer: string;
};

export const getCreateSignedToken = function <Payload extends JWT.JWTPayload>(
  params: GetCreateSignedTokenParams
) {
  const { secret, algorithm, issuer } = params;
  return function ({
    audience,
    expiresIn,
    payload,
  }: {
    payload: Payload;
    expiresIn: JWTExpirationType;
    audience?: string | string[];
  }) {
    const token = new JWT.SignJWT(payload)
      .setIssuer(issuer)
      .setIssuedAt()
      .setExpirationTime(expiresIn)
      .setProtectedHeader({
        alg: algorithm,
      });

    if (audience) {
      token.setAudience(audience);
    }

    return token.sign(secret);
  };
};
