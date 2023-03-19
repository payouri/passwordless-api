import {
  UserAccountModel,
  UserPlan,
} from "../../../../../shared/entities/UserAccount/UserAccount.js";
import type { CustomResponse } from "../../utils/types/CustomResponse";
import type { AuthMethodParams } from "./types";
import { AuthMethodType } from "./types.js";

const authQueryMap = {
  [AuthMethodType.EMAIL]: (params: AuthMethodParams) => ({
    email: params.payload,
  }),
  [AuthMethodType.PHONE]: (params: AuthMethodParams) => ({
    phone: params.payload,
  }),
} as const;

const getAuthFindQuery = (params: AuthMethodParams) => {
  if (!authQueryMap[params.type]) throw new Error("Invalid auth method type");

  return authQueryMap[params.type](params);
};

export const buildAuthService = ({
  apiUserAccountModel,
}: /* adminUserAccountModel,   adminDomainId, */
{
  apiUserAccountModel: UserAccountModel;
}) => {
  return {
    async isExistingAccount(params: AuthMethodParams) {
      const account = await apiUserAccountModel.findOne(
        getAuthFindQuery(params),
        { _id: 1 }
      );

      return account !== null;
    },
    async login(
      params: AuthMethodParams
    ): Promise<CustomResponse<unknown, "account_not_found">> {
      const account = await apiUserAccountModel.findOne(
        getAuthFindQuery(params)
      );

      if (!account) {
        return {
          hasFailed: true,
          error: {
            code: "account_not_found",
            message: "Account not found",
          },
        };
      }

      return {
        hasFailed: false,
        data: account,
      };
    },
    async register(params: AuthMethodParams) {
      const account = await apiUserAccountModel.create({
        ...getAuthFindQuery(params),
        domains: [],
        plan: UserPlan.FREE,
        webhooksEndpoints: [],
        publicKey: "TO_CREATE",
        identity: {
          firstName: "TO_CREATE",
          lastName: "TO_CREATE",
        },
      });

      return {
        hasFailed: false,
        data: account,
      };
    },
  };
};
