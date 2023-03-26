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
import {
  AuthMethodType,
  CreateAuthSessionParams,
  UpdateAuthSessionOTPParams,
} from "./types.js";

let authSessionService: ReturnType<typeof buildAuthService>;

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
          otp: undefined,
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
      params: UpdateAuthSessionOTPParams
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
    getAuthenticationMethods() {
      return {
        methods: Object.values(AuthMethodType),
      };
    },
  };

  authSessionService = service;

  return service;
};

export type AuthSessionService = ReturnType<typeof buildAuthService>;

export const getAuthSessionService = () => {
  if (!authSessionService) {
    throw new Error("AuthService not initialized");
  }

  return authSessionService;
};
