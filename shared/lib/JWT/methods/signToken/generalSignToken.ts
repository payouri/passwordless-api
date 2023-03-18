import * as JWT from "jose";
import { JWTAlgorithm } from "../../types";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export type GetGeneralSignedTokenParams = {};

export const getGeneralSignedToken = function <Payload extends Uint8Array>(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  params: GetGeneralSignedTokenParams
) {
  return function ({
    payload,
    signatures,
  }: {
    payload: Payload;
    signatures: {
      alg: JWTAlgorithm;
      signature: JWT.KeyLike | Uint8Array;
    }[];
  }) {
    const token = new JWT.GeneralSign(payload);

    signatures.forEach((signature) => {
      token.addSignature(signature.signature).setProtectedHeader({
        alg: signature.alg,
      });
    });

    return token.sign();
  };
};
