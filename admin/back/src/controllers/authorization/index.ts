import { getJWTManager } from "../../lib/JWT/index.js";
import { getRuntimeStore } from "../../loaders/runtimeStore.js";
import {
  AuthSessionService,
  getAuthSessionService,
} from "../../services/AuthSession/AuthSession.service.js";
import type { CreateAuthSessionParams } from "../../services/AuthSession/types";

let authControllers: ReturnType<typeof buildAuthControllers>;

export const buildAuthControllers = ({
  authSessionService = getAuthSessionService(),
}: {
  authSessionService?: AuthSessionService;
}) => {
  const domainId = getRuntimeStore().adminDomainId;

  const controller = {
    async startSession(
      params: Pick<CreateAuthSessionParams, "payload" | "type">
    ) {
      const authSession = await authSessionService.startAuthSession({
        domainId,
        payload: params.payload,
        type: params.type,
      });

      return authSession;
    },
    async getAuthenticationData() {
      const jwt = await getJWTManager();

      return {
        token: await jwt.encrypt({
          expiresIn: "1h",
          payload: {
            domainId,
            availableAuthMethods:
              authSessionService.getAuthenticationMethods().methods,
          },
        }),
      };
    },
  };
  return controller;
};

export const getAuthControllers = () => {
  if (!authControllers) {
    authControllers = buildAuthControllers({});
  }

  return authControllers;
};
