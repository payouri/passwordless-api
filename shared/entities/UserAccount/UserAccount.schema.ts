import { z } from "zod";

export enum UserPlan {
  FREE = "FREE",
}

export const UserAccountSchema = z.object({
  _id: z.string(),
  identity: z.object({
    firstName: z.string(),
    lastName: z.string(),
  }),
  email: z.string(),
  phone: z.string(),
  plan: z.nativeEnum(UserPlan),
  publicKey: z.string(),
  webhooksEndpoints: z.array(
    z.object({
      id: z.string(),
      url: z.string(),
      pendingEvents: z.array(
        z.object({
          id: z.string(),
          attempt: z.number(),
          event: z.string(),
          payload: z.record(z.string(), z.unknown()),
          createdOn: z.date(),
          lastAttempt: z.date().optional(),
        })
      ),
    })
  ),
  domains: z.array(z.string()),
});

export type UserAccountSchemaType = z.infer<typeof UserAccountSchema>;

export type UserAccount = UserAccountSchemaType;
