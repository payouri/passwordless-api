import { Connection, IndexDefinition, IndexOptions, model } from "mongoose";
import {
  AuthSessionModel,
  getAuthSessionModel,
  getCreateAuthSessionIndexes,
} from "../../../../shared/entities/AuthSession/AuthSession.js";
import {
  DomainModel,
  getCreateDomainIndexes,
  getDomainModel,
} from "../../../../shared/entities/Domain/Domain.js";
import {
  getCreateUserAccountIndexes,
  getUserAccountModel,
  UserAccountDefaultIndexes,
  UserAccountModel,
} from "../../../../shared/entities/UserAccount/UserAccount.js";

const models: {
  adminAuthSessionModel: AuthSessionModel | null;
  adminDomainModel: DomainModel | null;
  domainModel: DomainModel | null;
  adminUserAccountModel: UserAccountModel | null;
  userAccountModel: UserAccountModel | null;
} = {
  adminAuthSessionModel: null,
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
  adminAuthSessionModel,
  adminDomainModel,
  adminUserAccountModel,
}: {
  adminAuthSessionModel: AuthSessionModel;
  adminDomainModel: DomainModel;
  adminUserAccountModel: UserAccountModel;
}) => {
  const createAuthSessionIndexes = getCreateAuthSessionIndexes(
    adminAuthSessionModel
  );
  const createDomainIndexes = getCreateDomainIndexes(adminDomainModel);
  const createUserAccountIndexes = getCreateUserAccountIndexes(
    adminUserAccountModel,
    adminUserAccountIndexes
  );

  return async () => {
    await Promise.all([
      createDomainIndexes(),
      createUserAccountIndexes(),
      createAuthSessionIndexes(),
    ]);
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
}): Promise<
  { [Key in keyof typeof models]: NonNullable<typeof models[Key]> }
> => {
  const adminAuthSessionModel = getAuthSessionModel(adminMongoConnection);
  const adminDomainModel = getDomainModel(adminMongoConnection);
  const domainModel = getDomainModel(apiMongoConnection);
  const adminUserAccountModel = getUserAccountModel(adminMongoConnection);
  const userAccountModel = getUserAccountModel(adminMongoConnection);

  const createIndexes = getCreateIndexes({
    adminAuthSessionModel,
    adminDomainModel,
    adminUserAccountModel,
  });

  if (shouldCreateIndexes) {
    await createIndexes();
  }

  models.adminAuthSessionModel = adminAuthSessionModel;
  models.adminDomainModel = adminDomainModel;
  models.adminUserAccountModel = adminUserAccountModel;
  models.domainModel = domainModel;
  models.userAccountModel = userAccountModel;

  return models as any;
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
