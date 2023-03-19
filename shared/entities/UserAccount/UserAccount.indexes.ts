import { IndexDefinition, IndexOptions } from "mongoose";
import { UserAccountModel } from "./UserAccount.model";

export const UserAccountDefaultIndexes: [IndexDefinition, IndexOptions][] = [
  [
    {
      email: 1,
    },
    {
      unique: true,
    },
  ],
  [
    {
      phone: 1,
    },
    {
      unique: true,
    },
  ],
];

export const getCreateUserAccountIndexes = (
  model: UserAccountModel,
  indexes = UserAccountDefaultIndexes
) => {
  for (const [index, options] of indexes) {
    model.schema.index(index, options);
  }

  return () => {
    return model.createIndexes();
  };
};
