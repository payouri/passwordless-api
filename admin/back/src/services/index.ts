import { AuthSessionModel } from "../../../../shared/entities/AuthSession/AuthSession.js";
import { DomainModel } from "../../../../shared/entities/Domain/Domain.js";
import { UserAccountModel } from "../../../../shared/entities/UserAccount/UserAccount.js";
import { buildAuthService } from "./AuthSession/AuthSession.service.js";
import { buildDomainServices } from "./Domain/Domain.service.js";
import { buildUserAccountServices } from "./UserAccount/UserAccount.services.js";

export const initServices = ({
  adminAuthSessionModel,
  adminDomainModel,
  adminUserAccountModel,
  userAccountModel,
}: {
  adminAuthSessionModel: AuthSessionModel;
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
    authSessionModel: adminAuthSessionModel,
  });
};
