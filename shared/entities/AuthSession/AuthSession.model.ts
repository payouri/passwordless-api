import { convertZodSchemaToMongooseModel } from "../../lib/ZodSchemaToMongooseModel/index.js";
import mongoose, { Model } from "mongoose";
import {
  AuthSessionSchemaType,
  AuthSessionSchema,
} from "./AuthSession.schema.js";

export type AuthSessionModel = Model<AuthSessionSchemaType>;

const AuthSessionModels = new WeakMap<mongoose.Connection, AuthSessionModel>();

export const getAuthSessionModel = (
  c = mongoose.connection
): Model<AuthSessionSchemaType> => {
  if (!AuthSessionModels.has(c)) {
    AuthSessionModels.set(
      c,
      c.model<AuthSessionSchemaType>(
        "AuthSession",
        convertZodSchemaToMongooseModel(AuthSessionSchema, {
          timestamps: true,
        })
      )
    );
  }

  return AuthSessionModels.get(c)!;
};
