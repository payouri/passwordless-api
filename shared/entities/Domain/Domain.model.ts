import { convertZodSchemaToMongooseModel } from "../../lib/ZodSchemaToMongooseModel/index.js";
import mongoose, { Model } from "mongoose";
import { DomainSchemaType, DomainSchema } from "./Domain.schema.js";

export type DomainModel = Model<DomainSchemaType>;

const DomainModels = new WeakMap<mongoose.Connection, DomainModel>();

export const getDomainModel = (
  c = mongoose.connection
): Model<DomainSchemaType> => {
  if (!DomainModels.has(c)) {
    DomainModels.set(
      c,
      c.model<DomainSchemaType>(
        "Domain",
        convertZodSchemaToMongooseModel(DomainSchema)
      )
    );
  }

  return DomainModels.get(c)!;
};
