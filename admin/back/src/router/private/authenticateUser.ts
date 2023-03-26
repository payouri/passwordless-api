import { RouteOptions } from "fastify";
import { getErrorMessage } from "../../../../../shared/helpers/index.js";
import { getAuthControllers } from "../../controllers/authorization/index.js";
import { getJWTManager } from "../../lib/JWT/index.js";
import { getOTPConnector, OTPMethod } from "../../lib/OTP/index.js";
import { AuthMethodType } from "../../services/AuthSession/types.js";

const AuthTypeConversionMap = {
  [AuthMethodType.EMAIL]: OTPMethod.EMAIL,
  [AuthMethodType.PHONE]: OTPMethod.SMS,
};

export const authenticateUser: RouteOptions = {
  method: "POST",
  url: "/authenticate",
  schema: {
    body: {
      type: "object",
      properties: {
        authType: { type: "string", enum: Object.values(AuthMethodType) },
        payload: { type: "string" },
      },
    },
  },
  handler: async (request, reply) => {
    const { authType, payload } = request.body as {
      authType: AuthMethodType;
      payload: string;
    };

    try {
      const createSessionResult = await getAuthControllers().startSession({
        payload: payload,
        type: authType,
      });

      if (createSessionResult.hasFailed) {
        console.error(createSessionResult.error);
        reply.code(500).send({
          message: "Unexpected Error",
          code: "failed_to_create_session",
        });
        return;
      }

      const generateOTP = await getOTPConnector().generateOTP(
        AuthTypeConversionMap[authType]
      );

      if (!generateOTP.success) {
        reply.code(500).send({
          message: generateOTP.message,
          code: "failed_to_generate_otp",
        });
        return;
      }

      const sendOTP = await getOTPConnector().sendOTP({
        method: AuthTypeConversionMap[authType],
        otp: generateOTP.otp,
        data: {},
        identifier: createSessionResult.data.ownerId,
      });

      if (!sendOTP.success) {
        reply.code(500).send({
          message: "Unexpected Error",
          code: "failed_to_send_otp",
        });
        return;
      }

      reply.code(200).send({
        sessionToken: await (
          await getJWTManager()
        ).encrypt({
          payload: createSessionResult.data,
          audience: "auth_token",
        }),
        state: "requires_verification",
      });
    } catch (err) {
      console.error(err);
      reply.code(500).send({
        message: getErrorMessage(err),
        code: "unexpected_error",
      });
    }
  },
};
