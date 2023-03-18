import * as JWT from "jose";
import { JWTAlgorithm, JWTEncryptionAlgorithm } from "../../types";

export type GetFlattenedEncryptTokenParams = {
  encryption: JWTEncryptionAlgorithm;
  algorithm: JWTAlgorithm;
  secret: JWT.KeyLike | Uint8Array;
};

export const getFlattenedEncryptToken = function <Payload extends Uint8Array>(
  params: GetFlattenedEncryptTokenParams
) {
  const { encryption, secret, algorithm } = params;
  return function ({
    payload,
    additionalAuthenticatedData,
  }: {
    payload: Payload;
    additionalAuthenticatedData?: Uint8Array;
  }) {
    const token = new JWT.FlattenedEncrypt(payload).setProtectedHeader({
      enc: encryption,
      alg: algorithm,
    });

    if (additionalAuthenticatedData) {
      token.setAdditionalAuthenticatedData(additionalAuthenticatedData);
    }

    return token.encrypt(secret);
  };
};
