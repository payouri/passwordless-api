import { AuthMethodType } from "../../types.js";
import { z } from "zod";
import { OTPDataSchema } from "../../../shared/lib/OTPConnector/types.js";

export enum AuthSessionState {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  DENIED = "DENIED",
  EXPIRED = "EXPIRED",
}

export const AuthSessionSchema = z.object({
  _id: z.string(),
  domainId: z.string(),
  authType: z.nativeEnum(AuthMethodType),
  expirationDate: z.date(),
  params: z.record(z.string(), z.string().or(z.number()).or(z.boolean())),
  state: z.nativeEnum(AuthSessionState),
  ownerId: z.string(),
  otp: OTPDataSchema.optional(),
  accessToken: z.string().optional(),
});

export type AuthSessionSchemaType = z.infer<typeof AuthSessionSchema>;

export type AuthSession = AuthSessionSchemaType;
