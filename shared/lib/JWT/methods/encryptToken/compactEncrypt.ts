import * as JWT from "jose";
import {
  JWTAlgorithm,
  JWTEncryptionAlgorithm,
  JWTExpirationType,
} from "../../types.js";

export type GetCompactEncryptTokenParams = {
  algorithm: JWTAlgorithm;
  encryption: JWTEncryptionAlgorithm;
  generateUniqTokenId?: () => string;
  issuer: string;
  secret: JWT.KeyLike | Uint8Array;
};

export const getCompactEncryptToken = function ({
  algorithm,
  encryption,
  generateUniqTokenId,
  issuer,
  secret,
}: GetCompactEncryptTokenParams) {
  return function ({
    audience,
    expiresIn,
    payload,
    subject,
  }: {
    audience?: string | string[];
    expiresIn: JWTExpirationType;
    payload: JWT.JWTPayload;
    subject?: string;
  }) {
    const token = new JWT.EncryptJWT(payload);

    token.setIssuer(issuer);
    token.setIssuedAt();
    token.replicateIssuerAsHeader();
    token.setExpirationTime(expiresIn);
    token.setProtectedHeader({
      alg: algorithm,
      enc: encryption,
    });

    if (subject) {
      token.setSubject(subject);
      token.replicateSubjectAsHeader();
    }

    if (audience) {
      token.setAudience(audience);
      token.replicateAudienceAsHeader();
    }

    if (typeof generateUniqTokenId === "function") {
      token.setJti(generateUniqTokenId());
    }

    return token.encrypt(secret);
  };
};
