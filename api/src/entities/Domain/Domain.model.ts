import { convertZodSchemaToMongooseModel } from "../../../../shared/lib/ZodSchemaToMongooseModel/index.js";
import { model } from "mongoose";
import { DomainSchemaType, DomainSchema } from "./Domain.schema.js";

export const DomainModel = model<DomainSchemaType>(
  "Domain",
  convertZodSchemaToMongooseModel(DomainSchema)
);
