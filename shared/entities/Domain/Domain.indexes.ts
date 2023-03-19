import { IndexDefinition, IndexOptions } from "mongoose";
import { DomainModel } from "./Domain.model";

export const DomainDefaultIndexes: [IndexDefinition, IndexOptions][] = [
  [
    {
      owner: 1,
      name: 1,
    },
    {
      unique: true,
    },
  ],
  [
    {
      apiKey: 1,
    },
    {
      unique: true,
    },
  ],
];

export const getCreateDomainIndexes = (
  model: DomainModel,
  indexes = DomainDefaultIndexes
) => {
  for (const [index, options] of indexes) {
    model.schema.index(index, options);
  }

  return () => {
    return model.createIndexes();
  };
};
