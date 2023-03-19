import { AuthMethodType } from "../../../../../shared/types.js";

export { AuthMethodType };

export type CreateAuthSessionParams = {
  type: AuthMethodType;
  payload: string;
  domainId: string;
  durationInSeconds?: number;
};
