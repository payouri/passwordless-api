import {
  getCompactEncryptToken,
  GetCompactEncryptTokenParams,
} from "./compactEncrypt.js";
import {
  getCreateEncryptedToken,
  GetCreateEncryptedTokenParams,
} from "./createEncryptedToken.js";
import {
  getFlattenedEncryptToken,
  GetFlattenedEncryptTokenParams,
} from "./flattenedEncrypt.js";
import {
  getGeneralEncryptToken,
  GetGeneralEncryptTokenParams,
} from "./generalEncrypt.js";

export enum EncryptType {
  ENCRYPT = "encrypt",
  GENERAL = "general",
  COMPACT = "compact",
  FLATTENED = "flattened",
}

export type GetEncryptTokenParamsMap = {
  [EncryptType.ENCRYPT]: GetCreateEncryptedTokenParams;
  [EncryptType.GENERAL]: GetGeneralEncryptTokenParams;
  [EncryptType.COMPACT]: GetCompactEncryptTokenParams;
  [EncryptType.FLATTENED]: GetFlattenedEncryptTokenParams;
};

export type EncryptTokenFunction = {
  [EncryptType.ENCRYPT]: typeof getCreateEncryptedToken;
  [EncryptType.GENERAL]: typeof getGeneralEncryptToken;
  [EncryptType.COMPACT]: typeof getCompactEncryptToken;
  [EncryptType.FLATTENED]: typeof getFlattenedEncryptToken;
};

export type GetEncryptTokenParams<Type extends EncryptType> =
  Type extends EncryptType
    ? GetEncryptTokenParamsMap[Type] & { type: Type }
    : never;

export function getEncryptToken<Type extends EncryptType.GENERAL>(
  params: GetEncryptTokenParams<Type>
): ReturnType<typeof getGeneralEncryptToken>;
export function getEncryptToken<Type extends EncryptType.FLATTENED>(
  params: GetEncryptTokenParams<Type>
): ReturnType<typeof getFlattenedEncryptToken>;
export function getEncryptToken<Type extends EncryptType.COMPACT>(
  params: GetEncryptTokenParams<Type>
): ReturnType<typeof getCompactEncryptToken>;
export function getEncryptToken<Type extends EncryptType.ENCRYPT>(
  params: GetEncryptTokenParams<Type>
): ReturnType<typeof getCreateEncryptedToken>;
export function getEncryptToken<Type extends EncryptType>(
  params: GetEncryptTokenParams<Type>
) {
  if (params.type === EncryptType.ENCRYPT) {
    return getCreateEncryptedToken(params);
  }
  if (params.type === EncryptType.COMPACT) {
    return getCompactEncryptToken(params);
  }
  if (params.type === EncryptType.FLATTENED) {
    return getFlattenedEncryptToken(params);
  }
  return getGeneralEncryptToken(params);
}
