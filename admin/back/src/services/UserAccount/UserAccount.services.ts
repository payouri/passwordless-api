import {
  UserAccount,
  UserAccountModel,
  UserPlan,
} from "../../../../../shared/entities/UserAccount/UserAccount.js";
import { ADMIN_CONFIG } from "../../config.js";
import { getPublicKey } from "../../lib/AsymetricEncryption/index.js";
import { isDuplicateKeyError } from "../../../../../shared/helpers/index.js";

let userAccountServices: ReturnType<typeof buildUserAccountServices>;

export const buildUserAccountServices = ({
  adminUserAccountModel,
  userAccountModel,
}: {
  adminUserAccountModel: UserAccountModel;
  userAccountModel: UserAccountModel;
}) => {
  const service = {
    async getUserAccount(
      params:
        | {
            email: string;
          }
        | {
            phone: string;
          }
        | {
            _id: string;
          }
    ) {
      return userAccountModel.findOne(params).lean().exec();
    },
    async isAdminUserAccountExist() {
      const adminUserAccount = await adminUserAccountModel
        .findOne(
          {},
          {
            _id: 1,
          }
        )
        .lean()
        .exec();

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
      return adminUserAccountModel.findOne({}).lean().exec();
    },
    addAdminUserAccountDomain(domainId: string) {
      return adminUserAccountModel
        .updateOne(
          {},
          {
            $push: {
              domains: domainId,
            },
          }
        )
        .lean()
        .exec();
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

  userAccountServices = service;

  return service;
};

export const getUserAccountServices = () => {
  if (!userAccountServices) {
    throw new Error("User account services not initialized");
  }

  return userAccountServices;
};
