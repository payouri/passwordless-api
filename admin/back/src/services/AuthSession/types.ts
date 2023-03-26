import { OTPData } from "../../../../../shared/lib/OTPConnector/types.js";
import {
  AuthMethodType,
  ValidateSessionMap,
  ValidateSessionType,
} from "../../../../../shared/types.js";

export type { ValidateSessionMap };
export { AuthMethodType, ValidateSessionType };

export type CreateAuthSessionParams = {
  type: AuthMethodType;
  payload: string;
  domainId: string;
  durationInSeconds?: number;
};

export type UpdateAuthSessionOTPParams = (
  | { sessionId: string }
  | Omit<CreateAuthSessionParams, "durationInSeconds">
) & {
  otp: OTPData;
};

export type TryValidateSessionParams<Type extends ValidateSessionType> = {
  sessionId: string;
  validationMethod: Type;
} & ValidateSessionMap[Type];
