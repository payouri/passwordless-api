import {
  UserAccount,
  UserAccountModel,
  UserPlan,
} from "../../../../../shared/entities/UserAccount/UserAccount.js";
import { ADMIN_CONFIG } from "../../config.js";
import { getPublicKey } from "../../lib/AsymetricEncryption/index.js";
import { isDuplicateKeyError } from "../../../../../shared/helpers/index.js";

export const buildUserAccountServices = ({
  adminUserAccountModel,
}: {
  adminUserAccountModel: UserAccountModel;
}) => {
  return {
    async isAdminUserAccountExist() {
      const adminUserAccount = await adminUserAccountModel.findOne(
        {},
        {
          _id: 1,
        }
      );

      return adminUserAccount !== null;
    },
    async createAdminUserAccount(params: Omit<UserAccount, "_id">) {
      if (await this.isAdminUserAccountExist()) {
        console.warn("Admin user account already exist, returning it");
        return this.getAdminUserAccount();
      }

      return adminUserAccountModel.create(params);
    },
    getAdminUserAccount() {
      return adminUserAccountModel.findOne({});
    },
    addAdminUserAccountDomain(domainId: string) {
      return adminUserAccountModel.updateOne(
        {},
        {
          $push: {
            domains: domainId,
          },
        }
      );
    },
    async initAdminUserAccount() {
      const { adminUser } = ADMIN_CONFIG;

      const adminUserAccountData: Omit<UserAccount, "_id"> = {
        email: adminUser.email,
        phone: adminUser.phone,
        identity: {
          firstName: adminUser.firstName,
          lastName: adminUser.lastName,
        },
        plan: UserPlan.FREE,
        domains: [],
        publicKey: await getPublicKey(),
        webhooksEndpoints: [],
      };

      try {
        const adminUserAccount = await this.createAdminUserAccount(
          adminUserAccountData
        );

        return adminUserAccount;
      } catch (error) {
        if (isDuplicateKeyError(error)) {
          const adminUserAccount = await this.getAdminUserAccount();

          return adminUserAccount;
        }
        throw error;
      }
    },
  };
};
