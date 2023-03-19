import dayjs from "dayjs";
import {
  AuthSession,
  AuthSessionModel,
  AuthSessionState,
} from "../../../../../shared/entities/AuthSession/AuthSession.js";
import { generateHashFromString } from "../../../../../shared/helpers/generateHashFromString.js";
import { getErrorMessage } from "../../../../../shared/helpers/index.js";
import { CustomResponse } from "../../utils/types/CustomResponse.js";
import { DEFAULT_AUTH_SESSION_TTL } from "./constants.js";
import type { CreateAuthSessionParams } from "./types";
// import { AuthMethodType } from "./types.js";

let authSessionService: ReturnType<typeof buildAuthService>;

// const authQueryMap = {
//   [AuthMethodType.EMAIL]: (params: CreateAuthSessionParams) => ({
//     email: params.payload,
//   }),
//   [AuthMethodType.PHONE]: (params: CreateAuthSessionParams) => ({
//     phone: params.payload,
//   }),
// } as const;

// const getAuthFindQuery = (params: CreateAuthSessionParams) => {
//   if (!authQueryMap[params.type]) throw new Error("Invalid auth method type");

//   return authQueryMap[params.type](params);
// };

export const buildAuthService = ({
  authSessionModel,
}: {
  authSessionModel: AuthSessionModel;
}) => {
  const service = {
    async startAuthSession({
      domainId,
      payload,
      type,
      durationInSeconds,
    }: CreateAuthSessionParams): Promise<
      CustomResponse<AuthSession, "failed_to_create_session">
    > {
      try {
        const createdAuthSession = await authSessionModel.create({
          expirationDate: dayjs()
            .add(durationInSeconds || DEFAULT_AUTH_SESSION_TTL, "seconds")
            .toDate(),
          authType: type,
          params: {
            payload,
          },
          ownerId: generateHashFromString(
            JSON.stringify({
              domainId,
              payload,
              type,
            })
          ),
          state: AuthSessionState.PENDING,
          domainId,
        });

        return {
          hasFailed: false,
          data: createdAuthSession,
        };
      } catch (error) {
        return {
          hasFailed: true,
          error: {
            code: "failed_to_create_session",
            message: getErrorMessage(error),
          },
        };
      }
    },
    async updateSessionOTP(
      params: (
        | { sessionId: string }
        | Omit<CreateAuthSessionParams, "durationInSeconds">
      ) & {
        otp: string;
      }
    ): Promise<CustomResponse<AuthSession, "session_not_found">> {
      const updatedSession = await authSessionModel.findOneAndUpdate(
        {
          ...("sessionId" in params
            ? { _id: params.sessionId }
            : {
                ownerId: generateHashFromString(
                  JSON.stringify({
                    domainId: params.domainId,
                    payload: params.payload,
                    type: params.type,
                  })
                ),
              }),
        },
        {
          $set: {
            otp: params.otp,
          },
        },
        {
          new: true,
        }
      );

      if (!updatedSession) {
        return {
          hasFailed: true,
          error: {
            code: "session_not_found",
            message: "Session not found",
          },
        };
      }

      return {
        hasFailed: false,
        data: updatedSession,
      };
    },
  };
  //   async login(
  //     params: CreateAuthSessionParams
  //   ): Promise<CustomResponse<unknown, "account_not_found">> {
  //     const account = await apiUserAccountModel.findOne(
  //       getAuthFindQuery(params)
  //     );

  //     if (!account) {
  //       return {
  //         hasFailed: true,
  //         error: {
  //           code: "account_not_found",
  //           message: "Account not found",
  //         },
  //       };
  //     }

  //     return {
  //       hasFailed: false,
  //       data: account,
  //     };
  //   },
  //   async register(params: CreateAuthSessionParams) {
  //     const account = await apiUserAccountModel.create({
  //       ...getAuthFindQuery(params),
  //       domains: [],
  //       plan: UserPlan.FREE,
  //       webhooksEndpoints: [],
  //       publicKey: "TO_CREATE",
  //       identity: {
  //         firstName: "TO_CREATE",
  //         lastName: "TO_CREATE",
  //       },
  //     });

  //     return {
  //       hasFailed: false,
  //       data: account,
  //     };
  //   },
  // };

  return service;
};

export type AuthSessionService = ReturnType<typeof buildAuthService>;

export const getAuthSessionService = () => {
  if (!authSessionService) {
    throw new Error("AuthService not initialized");
  }

  return authSessionService;
};
