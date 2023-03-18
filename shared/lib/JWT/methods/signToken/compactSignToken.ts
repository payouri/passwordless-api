import * as JWT from "jose";
import { JWTAlgorithm, JWTEncryptionAlgorithm } from "../../types";

export type GetCompactSignedTokenParams = {
  secret: JWT.KeyLike | Uint8Array;
  algorithm: JWTAlgorithm;
  encryption: JWTEncryptionAlgorithm;
};

export const getCompactSignedToken = function <Payload extends Uint8Array>(
  params: GetCompactSignedTokenParams
) {
  const { secret, algorithm, encryption } = params;
  return function ({ payload }: { payload: Payload }) {
    const token = new JWT.CompactSign(payload).setProtectedHeader({
      alg: algorithm,
      enc: encryption,
    });

    return token.sign(secret);
  };
};
