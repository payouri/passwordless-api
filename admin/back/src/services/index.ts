import { DomainModel } from "../../../../shared/entities/Domain/Domain.js";
import { UserAccountModel } from "../../../../shared/entities/UserAccount/UserAccount.js";
import { buildAuthService } from "./Auth/Auth.service.js";
import { buildDomainServices } from "./Domain/Domain.service.js";
import { buildUserAccountServices } from "./UserAccount/UserAccount.services.js";

export const initServices = ({
  adminDomainModel,
  adminUserAccountModel,
  userAccountModel,
}: {
  adminDomainModel: DomainModel;
  adminUserAccountModel: UserAccountModel;
  userAccountModel: UserAccountModel;
}) => {
  buildDomainServices({
    adminDomainModel,
  });
  buildUserAccountServices({
    adminUserAccountModel,
    userAccountModel,
  });
  buildAuthService({
    apiUserAccountModel: userAccountModel,
  });
};
