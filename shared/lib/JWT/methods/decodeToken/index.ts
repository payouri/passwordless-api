import * as JWT from "jose";
import { getErrorMessage, isError } from "../../../../helpers/index.js";
import { JWTEncryptionAlgorithm } from "../../types.js";

export type GetDecodeTokenParams = {
  issuer: string;
  secret: JWT.KeyLike | Uint8Array;
  encryption: JWTEncryptionAlgorithm;
};

export type DecodeTokenResult<Data extends JWT.JWTPayload> =
  | {
      hasFailed: true;
      error: Error;
    }
  | {
      hasFailed: false;
      data: Data;
      protectedHeader: JWT.JWTHeaderParameters;
    };

export const getDecodeToken =
  <TokenData extends JWT.JWTPayload>(params: GetDecodeTokenParams) =>
  async ({
    token,
    options,
  }: {
    token: string | Uint8Array;
    options?: Omit<JWT.JWTVerifyOptions, "issuer">;
  }): Promise<DecodeTokenResult<TokenData>> => {
    try {
      const decodeResult = await JWT.jwtDecrypt(token, params.secret, {
        ...options,
        issuer: params.issuer,
      });

      return {
        hasFailed: false,
        data: decodeResult.payload as TokenData,
        protectedHeader: decodeResult.protectedHeader,
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
