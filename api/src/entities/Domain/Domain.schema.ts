import { z } from "zod";

export const DomainSchema = z.object({
  _id: z.string(),
  name: z.string(),
  owner: z.string(),
  pubKey: z.string(),
  allowedOrigins: z.array(z.string()),
});

export type DomainSchemaType = z.infer<typeof DomainSchema>;
