import { Connection, IndexDefinition, IndexOptions } from "mongoose";
import {
  getDomainModel,
  getCreateDomainIndexes,
  DomainModel,
} from "../../../../shared/entities/Domain/Domain.js";
import {
  getUserAccountModel,
  UserAccountModel,
  UserAccountDefaultIndexes,
  getCreateUserAccountIndexes,
} from "../../../../shared/entities/UserAccount/UserAccount.js";

const adminUserAccountIndexes: [IndexDefinition, IndexOptions][] =
  UserAccountDefaultIndexes.concat([
    [
      {
        publicKey: 1,
      },
      {
        unique: true,
      },
    ],
  ]);

const getCreateIndexes = ({
  adminDomainModel,
  adminUserAccountModel,
}: {
  adminDomainModel: DomainModel;
  adminUserAccountModel: UserAccountModel;
}) => {
  const createDomainIndexes = getCreateDomainIndexes(adminDomainModel);
  const createUserAccountIndexes = getCreateUserAccountIndexes(
    adminUserAccountModel,
    adminUserAccountIndexes
  );

  return async () => {
    await Promise.all([createDomainIndexes(), createUserAccountIndexes()]);
  };
};

export const initModels = async ({
  adminMongoConnection,
  apiMongoConnection,
  shouldCreateIndexes = true,
}: {
  adminMongoConnection: Connection;
  apiMongoConnection: Connection;
  shouldCreateIndexes?: boolean;
}) => {
  const adminDomainModel = getDomainModel(adminMongoConnection);
  const domainModel = getDomainModel(apiMongoConnection);
  const adminUserAccountModel = getUserAccountModel(adminMongoConnection);
  const userAccountModel = getUserAccountModel(adminMongoConnection);

  const createIndexes = getCreateIndexes({
    adminDomainModel,
    adminUserAccountModel,
  });

  if (shouldCreateIndexes) {
    await createIndexes();
  }

  return {
    adminDomainModel,
    adminUserAccountModel,
    domainModel,
    userAccountModel,
  };
};
