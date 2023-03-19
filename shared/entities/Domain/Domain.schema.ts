import { z } from "zod";

export const DomainSchema = z.object({
  _id: z.string(),
  name: z.string(),
  owner: z.string(),
  pubKey: z.string(),
  allowedHosts: z.array(z.string()),
  metadata: z.record(z.string(), z.string().or(z.number()).or(z.boolean())),
  authTypes: z.array(z.string()),
  returnURL: z.string(),
  apiKey: z.string(),
});

export type DomainSchemaType = z.infer<typeof DomainSchema>;

export type Domain = DomainSchemaType;
