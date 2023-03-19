import mongoose, { Model } from "mongoose";
import { convertZodSchemaToMongooseModel } from "../../lib/ZodSchemaToMongooseModel/index.js";
import {
  UserAccountSchema,
  UserAccountSchemaType,
} from "./UserAccount.schema.js";

export type UserAccountModel = Model<UserAccountSchemaType>;

const UserAccountModels = new WeakMap<mongoose.Connection, UserAccountModel>();

export const getUserAccountModel = (
  c = mongoose.connection
): Model<UserAccountSchemaType> => {
  if (!UserAccountModels.has(c)) {
    UserAccountModels.set(
      c,
      c.model<UserAccountSchemaType>(
        "UserAccount",
        convertZodSchemaToMongooseModel(UserAccountSchema, {
          timestamps: true,
        })
      )
    );
  }

  return UserAccountModels.get(c)!;
};
