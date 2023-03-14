import { customAlphabet } from "nanoid";
import {
  ConnectorConfig,
  OTPConfig,
  OTPConfigMap,
  OTPConnectorAPI,
  OTPFailedResponse,
  OTPMethod,
  OTPProvidersConfigMap,
  OTPRequest,
  OTPSuccessResponse,
  OTPProvider,
  OTPStatus,
} from "./types";

export { OTPMethod, OTPStatus } from "./types";

const getErrorMessage = (error: unknown) => {
  if (typeof error === "string") {
    return error;
  }

  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === "object" && error !== null) {
    return JSON.stringify(error);
  }

  return "Something went wrong";
};

const generateAlphabet = <Methods extends OTPMethod = OTPMethod>(
  params: OTPConfig<Methods>
): string[] => {
  const alphabet: string[] = [];

  if (params.digits) {
    alphabet.push(...Array.from({ length: 10 }, (_, i) => i.toString()));
  }
  if (params.lowerCase) {
    alphabet.push(
      ...Array.from({ length: 26 }, (_, i) => String.fromCharCode(i + 97))
    );
  }
  if (params.upperCase) {
    alphabet.push(
      ...Array.from({ length: 26 }, (_, i) => String.fromCharCode(i + 65))
    );
  }
  if (params.specialChars) {
    alphabet.push(
      ...Array.from({ length: 32 }, (_, i) => String.fromCharCode(i + 33))
    );
  }

  return alphabet;
};

const createProvider = <
  Methods extends OTPMethod,
  OTPConfig extends OTPConfigMap<Methods>
>(config: {
  connector: ConnectorConfig<Methods>;
  provider: OTPProvidersConfigMap<Methods>[Methods];
  otp: OTPConfig[Methods];
}): OTPProvider<Methods> & {
  generateOTP: () => string;
} => {
  const { provider: providerConfig, otp } = config;
  const generateOTP = (() => {
    const alphabet = generateAlphabet(otp);
    const generate = customAlphabet(alphabet.join(""), config.otp.length);

    return () => generate();
  })();

  return {
    ...providerConfig,
    generateOTP,
  };
};

const createProvidersMap = <
  Methods extends OTPMethod,
  OTPConfig extends OTPConfigMap<Methods>,
  ProvidersConfig extends OTPProvidersConfigMap<Methods> = OTPProvidersConfigMap<Methods>
>(config: {
  connector: ConnectorConfig<Methods>;
  otp: OTPConfig;
  providersConfig: ProvidersConfig;
}): {
  [Key in keyof OTPProvidersConfigMap<Methods>]: OTPProvidersConfigMap<Methods>[Methods] & {
    generateOTP: () => string;
  };
} => {
  const { connector, otp, providersConfig } = config;
  return Object.entries(providersConfig).reduce(
    (acc, [key, value]) => {
      const provider = createProvider({
        connector,
        provider: value as OTPProvidersConfigMap<Methods>[Methods],
        otp: otp[key as Methods],
      });

      return {
        ...acc,
        [key]: provider,
      };
    },
    {} as {
      [Key in keyof OTPProvidersConfigMap<Methods>]: OTPProvidersConfigMap<Methods>[Methods] & {
        generateOTP: () => string;
      };
    }
  );
};

export const createOTPConnector =
  <Methods extends OTPMethod, OTPConfig extends OTPConfigMap<Methods>>(config: {
    connector: ConnectorConfig<Methods>;
    otp: OTPConfig;
  }) =>
  <
    ProvidersConfig extends OTPProvidersConfigMap<Methods> = OTPProvidersConfigMap<Methods>
  >(
    providersConfig: OTPProvidersConfigMap<Methods>
  ): OTPConnectorAPI<Methods, ProvidersConfig[keyof ProvidersConfig]> => {
    const providersMap = createProvidersMap({
      connector: config.connector,
      otp: config.otp,
      providersConfig,
    });

    const handleSendOTP = async (
      params: OTPRequest<Methods, ProvidersConfig[keyof ProvidersConfig]>
    ): Promise<OTPSuccessResponse | OTPFailedResponse> => {
      if (params.method in providersMap) {
        const provider = providersMap[params.method];

        let otpWasSent: string | null = null;

        try {
          await config.connector.saveOTP({
            createdAt: new Date(),
            otp: params.otp,
            method: params.method,
            expiry: new Date(Date.now() + config.otp[params.method].expiryMS),
            identifier: params.identifier,
            retryCount: 0,
            retryLimit: config.otp[params.method].retryLimit,
            retryWait: config.otp[params.method].retryWait,
            status: OTPStatus.PENDING,
          });

          provider
            .sendOTP({
              ...params,
              data: params.data || {},
            })
            .catch(() => {
              setImmediate(() =>
                config.connector.deleteOTP(params.identifier, params.method)
              );
            });

          return {
            otp: params.otp,
            success: true,
          };
        } catch (error) {
          if (otpWasSent) {
            setImmediate(() =>
              config.connector.deleteOTP(params.identifier, params.method)
            );
          }
        }
      }

      throw new Error("Invalid OTP method");
    };

    const handleVerifyOTP = async (
      params: Omit<
        OTPRequest<Methods, ProvidersConfig[keyof ProvidersConfig]>,
        "data"
      >
    ): Promise<OTPSuccessResponse | OTPFailedResponse> => {
      if (params.method in providersMap) {
        const { identifier, method } = params;

        const otp = await config.connector.getOTP(identifier, method);
        if (otp && otp.status === OTPStatus.PENDING && otp.otp === params.otp) {
          await config.connector.updateOTP(identifier, method, {
            status: OTPStatus.VERIFIED,
          });
          return {
            success: true,
            otp: params.otp,
          };
        } else {
          return {
            success: false,
            message: "Invalid OTP",
          };
        }
      }

      throw new Error("Invalid OTP method");
    };

    const handleCancelOTP = async (
      params: Omit<
        OTPRequest<Methods, ProvidersConfig[keyof ProvidersConfig]>,
        "data"
      >
    ): Promise<OTPSuccessResponse | OTPFailedResponse> => {
      if (params.method in providersMap) {
        const { identifier, method } = params;

        await config.connector.deleteOTP(identifier, method);

        return {
          success: true,
          otp: params.otp,
        };
      }

      throw new Error("Invalid OTP method");
    };

    return {
      sendOTP: handleSendOTP,
      verifyOTP: handleVerifyOTP,
      cancelOTP: handleCancelOTP,
      generateOTP: async (method) => {
        try {
          const code = providersMap[method].generateOTP();

          return {
            success: true,
            otp: code,
          };
        } catch (error) {
          return {
            success: false,
            message: getErrorMessage(error),
          };
        }
      },
    };
  };
