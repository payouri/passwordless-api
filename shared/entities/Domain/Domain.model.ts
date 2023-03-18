import { convertZodSchemaToMongooseModel } from "../../lib/ZodSchemaToMongooseModel/index.js";
import mongoose, { Model } from "mongoose";
import { DomainSchemaType, DomainSchema } from "./Domain.schema.js";

let DomainModel: Model<DomainSchemaType>;

export const getDomainModel = (c = mongoose.connection) => {
  if (!DomainModel) {
    DomainModel = c.model<DomainSchemaType>(
      "Domain",
      convertZodSchemaToMongooseModel(DomainSchema)
    );
  }

  return DomainModel;
};
