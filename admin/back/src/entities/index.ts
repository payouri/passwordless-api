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

const models: {
  adminDomainModel: DomainModel | null;
  domainModel: DomainModel | null;
  adminUserAccountModel: UserAccountModel | null;
  userAccountModel: UserAccountModel | null;
} = {
  adminDomainModel: null,
  domainModel: null,
  adminUserAccountModel: null,
  userAccountModel: null,
};

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
// Application Key 6254de5116742a93
// Application Secret c6ef5d428527f2a9735d274417d54ae0
// Consumer Key 510e71627c67341046375bdfc9618928
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

  models.adminDomainModel = adminDomainModel;
  models.adminUserAccountModel = adminUserAccountModel;
  models.domainModel = domainModel;
  models.userAccountModel = userAccountModel;

  return {
    adminDomainModel,
    adminUserAccountModel,
    domainModel,
    userAccountModel,
  };
};

export const getModels = <ModelName extends keyof typeof models>(
  modelName: ModelName
): NonNullable<typeof models[ModelName]> => {
  const model = models[modelName];

  if (!model) {
    throw new Error(`Model ${modelName} not initialized`);
  }

  return model;
};
