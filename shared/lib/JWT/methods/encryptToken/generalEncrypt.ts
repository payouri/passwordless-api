import * as JWT from "jose";
import { JWTAlgorithm, JWTEncryptionAlgorithm } from "../../types";

export type GetGeneralEncryptTokenParams = {
  encryption: JWTEncryptionAlgorithm;
};

export const getGeneralEncryptToken = function <Payload extends Uint8Array>(
  params: GetGeneralEncryptTokenParams
) {
  const { encryption } = params;
  return function ({
    payload,
    recipientsData,
    additionalAuthenticatedData,
  }: {
    payload: Payload;
    recipientsData: {
      key: JWT.KeyLike | Uint8Array;
      algorithm: JWTAlgorithm;
    }[];
    additionalAuthenticatedData?: Uint8Array;
  }) {
    const token = new JWT.GeneralEncrypt(payload).setProtectedHeader({
      enc: encryption,
    });

    recipientsData.forEach((recipientData) => {
      token.addRecipient(recipientData.key).setUnprotectedHeader({
        alg: recipientData.algorithm,
      });
    });

    if (additionalAuthenticatedData) {
      token.setAdditionalAuthenticatedData(additionalAuthenticatedData);
    }

    return token.encrypt();
  };
};
