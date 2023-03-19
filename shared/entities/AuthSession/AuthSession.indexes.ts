import { IndexDefinition, IndexOptions } from "mongoose";
import { AuthSessionModel } from "./AuthSession.model.js";

export const AuthSessionDefaultIndexes: [IndexDefinition, IndexOptions][] = [
  [{ domainId: 1, authType: 1, otp: 1 }, { unique: true }],
  [
    {
      domainId: 1,
      authType: 1,
      ownerId: 1,
    },
    {},
  ],
];

export const getCreateAuthSessionIndexes = (
  model: AuthSessionModel,
  indexes = AuthSessionDefaultIndexes
) => {
  for (const [index, options] of indexes) {
    model.schema.index(index, options);
  }

  return () => {
    return model.createIndexes();
  };
};
