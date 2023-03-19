import { getAuthSessionModel } from "@/shared/entities/AuthSession/AuthSession.model";
import { getRuntimeStore } from "../../loaders/runtimeStore";
import {
  AuthSessionService,
  getAuthSessionService,
} from "../../services/AuthSession/AuthSession.service";
import { CreateAuthSessionParams } from "../../services/AuthSession/types";

export const buildAuthControllers = ({
  authSessionService = getAuthSessionService(),
}: {
  authSessionService?: AuthSessionService;
}) => {
  const domainId = getRuntimeStore().adminDomainId;

  return {
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
  };
};
