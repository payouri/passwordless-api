import { DomainModel } from "../../../../../shared/entities/Domain/Domain.model.js";
import { UserAccountModel } from "../../../../../shared/entities/UserAccount/UserAccount.js";
import { getDomainServices } from "../../services/Domain/Domain.service.js";
import { getUserAccountServices } from "../../services/UserAccount/UserAccount.services.js";

export const buildInitAdminControllers = () => {
  const userAccountServices = getUserAccountServices();
  const domainServices = getDomainServices();

  return {
    verifyAdmin: async () => {
      const [adminUserAccount, adminDomain] = await Promise.all([
        userAccountServices.isAdminUserAccountExist(),
        domainServices.isAdminDomainExist(),
      ]);

      if (!adminUserAccount || !adminDomain) {
        return {
          status: false,
          message: "Admin user or domain not found",
        };
      }

      return {
        status: true,
      };
    },
    initAdmin: async () => {
      const adminUserAccount = await userAccountServices.initAdminUserAccount();
      if (!adminUserAccount) throw new Error("Admin user account not created");

      const adminDomain = await domainServices.initAdminDomain({
        owner: adminUserAccount._id,
      });
      if (!adminDomain) throw new Error("Admin domain not created");

      return {
        adminUserAccount,
        adminDomain,
      };
    },
  };
};
