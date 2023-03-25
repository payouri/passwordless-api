import * as JWT from "jose";
import { JWTAlgorithm } from "../../types.js";

export type GetFlattenedSignedTokenParams = {
  secret: JWT.KeyLike | Uint8Array;
  algorithm: JWTAlgorithm;
};

export const getFlattenedSignedToken = function <Payload extends Uint8Array>(
  params: GetFlattenedSignedTokenParams
) {
  const { secret, algorithm } = params;
  return function ({ payload }: { payload: Payload }) {
    const token = new JWT.FlattenedSign(payload).setProtectedHeader({
      alg: algorithm,
    });

    return token.sign(secret);
  };
};
