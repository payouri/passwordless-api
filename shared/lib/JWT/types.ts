import { JWK } from "jose";

export type SecretType =
  | {
      secret: string;
      algorithm: JWTAlgorithm;
    }
  | {
      publicKey: string;
      privateKey: string;
      algorithm: JWTAlgorithm;
    }
  | {
      jwk: JWK;
      algorithm: JWTAlgorithm;
    };

export enum JWTAlgorithm {
  HS256 = "HS256",
  HS384 = "HS384",
  HS512 = "HS512",
  RS256 = "RS256",
  RS384 = "RS384",
  RS512 = "RS512",
  ES256 = "ES256",
  ES384 = "ES384",
  ES512 = "ES512",
  PS256 = "PS256",
  PS384 = "PS384",
  PS512 = "PS512",
  RSA_OAEP_256 = "RSA-OAEP-256",
  None = "none",
  DIR = "dir",
}

export enum JWTEncryptionAlgorithm {
  A128CBC_HS256 = "A128CBC-HS256", // Required
  A192CBC_HS384 = "A192CBC-HS384", // Optional
  A256CBC_HS512 = "A256CBC-HS512", // Required
  A128GCM = "A128GCM", // Recommended
  A192GCM = "A192GCM", // Optional
  A256GCM = "A256GCM", // Recommended
  RSA_OAEP_256 = "RSA-OAEP-256", // Optional
}

/**
 * @description when number must be expiration time is seconds
 */
export type JWTExpirationType = `${number}h` | number;
