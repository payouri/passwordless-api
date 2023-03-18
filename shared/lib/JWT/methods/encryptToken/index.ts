import {
  getCompactEncryptToken,
  GetCompactEncryptTokenParams,
} from "./compactEncrypt";
import {
  getCreateEncryptedToken,
  GetCreateEncryptedTokenParams,
} from "./createEncryptedToken";
import {
  getFlattenedEncryptToken,
  GetFlattenedEncryptTokenParams,
} from "./flattenedEncrypt";
import {
  getGeneralEncryptToken,
  GetGeneralEncryptTokenParams,
} from "./generalEncrypt";

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

export type GetEncryptTokenParams<Type extends EncryptType> =
  Type extends EncryptType
    ? GetEncryptTokenParamsMap[Type] & { type: Type }
    : never;

export const getEncryptToken = function <Type extends EncryptType>(
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
};
