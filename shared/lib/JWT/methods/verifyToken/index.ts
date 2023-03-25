import * as JWT from "jose";
import { isError, getErrorMessage } from "../../../../helpers/index.js";
import { JWTEncryptionAlgorithm } from "../../types.js";

export type GetVerifyTokenParams = {
  issuer: string;
  secret: JWT.KeyLike | Uint8Array;
  encryption: JWTEncryptionAlgorithm;
};

export type VerifyTokenResult<Data extends JWT.JWTPayload> =
  | {
      hasFailed: true;
      error: Error;
    }
  | {
      hasFailed: false;
      data: Data;
      protectedHeader: JWT.JWTHeaderParameters;
    };

export const getVerifyToken =
  <TokenData extends JWT.JWTPayload>(params: GetVerifyTokenParams) =>
  async ({
    token,
    options,
  }: {
    token: string | Uint8Array;
    options?: Omit<JWT.JWTVerifyOptions, "issuer">;
  }): Promise<VerifyTokenResult<TokenData>> => {
    try {
      const verifyResult = await JWT.jwtVerify(token, params.secret, {
        ...options,
        issuer: params.issuer,
      });

      return {
        hasFailed: false,
        data: verifyResult.payload as TokenData,
        protectedHeader: verifyResult.protectedHeader,
      };
    } catch (error) {
      if (isError(error))
        return {
          hasFailed: true,
          error,
        };
      else {
        return {
          hasFailed: true,
          error: new Error(getErrorMessage(error)),
        };
      }
    }
  };
