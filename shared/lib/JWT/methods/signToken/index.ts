import {
  getCompactSignedToken,
  GetCompactSignedTokenParams,
} from "./compactSignToken.js";
import {
  getCreateSignedToken,
  GetCreateSignedTokenParams,
} from "./createSignedToken.js";
import {
  getFlattenedSignedToken,
  GetFlattenedSignedTokenParams,
} from "./flattenedSignToken.js";
import {
  getGeneralSignedToken,
  GetGeneralSignedTokenParams,
} from "./generalSignToken.js";

export enum SignType {
  SIGN = "sign",
  GENERAL = "general",
  COMPACT = "compact",
  FLATTENED = "flattened",
}

export type GetSignTokenParamsMap = {
  [SignType.SIGN]: GetCreateSignedTokenParams;
  [SignType.GENERAL]: GetGeneralSignedTokenParams;
  [SignType.COMPACT]: GetCompactSignedTokenParams;
  [SignType.FLATTENED]: GetFlattenedSignedTokenParams;
};

export type GetSignTokenParams<Type extends SignType> = Type extends SignType
  ? GetSignTokenParamsMap[Type] & { type: Type }
  : never;

export const getSignToken = function <Type extends SignType>(
  params: GetSignTokenParams<Type>
) {
  if (params.type === SignType.SIGN) {
    return getCreateSignedToken(params);
  }
  if (params.type === SignType.COMPACT) {
    return getCompactSignedToken(params);
  }
  if (params.type === SignType.FLATTENED) {
    return getFlattenedSignedToken(params);
  }
  return getGeneralSignedToken(params);
};
