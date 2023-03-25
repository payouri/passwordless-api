import * as JWT from "jose";
import { JWTExpirationType } from "../types.js";

export type GetUnsecureCreateParams = {
  issuer: string;
  generateUniqTokenId?: () => string;
  defaultExpiration: JWTExpirationType;
};

export const getUnsecureCreate = (params: GetUnsecureCreateParams) =>
  function ({
    payload,
    audience,
    subject,
    expiresIn,
  }: {
    payload: JWT.JWTPayload;
    subject?: string;
    audience?: string | string[];
    expiresIn?: JWTExpirationType;
  }) {
    const token = new JWT.UnsecuredJWT(payload)
      .setExpirationTime(expiresIn || params.defaultExpiration)
      .setIssuer(params.issuer)
      .setIssuedAt();

    if (audience) {
      token.setAudience(audience);
    }

    if (subject) {
      token.setSubject(subject);
    }

    if (typeof params.generateUniqTokenId === "function") {
      token.setJti(params.generateUniqTokenId());
    }

    return token.encode();
  };
