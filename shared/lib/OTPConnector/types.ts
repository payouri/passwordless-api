export enum OTPMethod {
  EMAIL = "EMAIL",
  SMS = "SMS",
}

export enum OTPStatus {
  PENDING = "PENDING",
  VERIFIED = "VERIFIED",
  FAILED = "FAILED",
  EXPIRED = "EXPIRED",
}

export interface OTPConfig<Methods extends OTPMethod = OTPMethod> {
  /**
   * Generates a string of random characters based on the options provided.
   * @param {Methods} method The method of OTP generation to use.
   * @param {number} length The length of the OTP to generate.
   * @param {number} expiry The expiry time of the OTP in seconds.
   * @param {boolean} digits Whether to include digits in the OTP.
   * @param {boolean} upperCase Whether to include uppercase characters in the OTP.
   * @param {boolean} lowerCase Whether to include lowercase characters in the OTP.
   * @param {boolean} specialChars Whether to include special characters in the OTP.
   * @param {number} retryLimit The number of times a user can retry an OTP before it expires.
   * @param {number} retryWait The number of seconds to wait before resetting the OTP retry count.
   */
  method: Methods;
  length: number;
  expiryMS: number;
  digits: boolean;
  upperCase: boolean;
  lowerCase: boolean;
  specialChars: boolean;
  retryLimit: number;
  retryWait: number;
}

export interface OTPRequest<
  Methods extends OTPMethod,
  Provider extends OTPProvider<Methods>
> {
  method: Methods;
  identifier: string;
  otp: string;
  data: Provider["templateVars"][number] extends never
    ? undefined
    : {
        [K in Provider["templateVars"][number]]: string;
      };
}

export interface OTPResponse {
  success: boolean;
  message?: string;
  otp?: string;
  // expiry?: Date;
  // retryLimit?: number;
  // retryWait?: number;
}

export interface OTPSuccessResponse extends OTPResponse {
  success: true;
  otp: string;
}

export interface OTPFailedResponse extends OTPResponse {
  success: false;
  // otp: string;
  message: string;
  // retryLimit: number;
  // expiry: Date;
  // retryWait: number;
}

export interface OTPData<Method extends OTPMethod = OTPMethod> {
  otp: string;
  identifier: string;
  method: Method;
  expiry: Date;
  retryLimit: number;
  retryWait: number;
  retryCount: number;
  status: OTPStatus;
  createdAt: Date;
}

export interface ConnectorConfig<Methods extends OTPMethod = OTPMethod> {
  saveOTP: (data: OTPData<Methods>) => Promise<void>;
  getOTP: (
    identifier: OTPData<Methods>["identifier"],
    method: Methods
  ) => Promise<OTPData<Methods> | null>;
  updateOTP: (
    identifier: string,
    method: Methods,
    data: Partial<Pick<OTPData<Methods>, "expiry" | "retryCount" | "status">>
  ) => Promise<void>;
  deleteOTP: (
    identifier: OTPData<Methods>["identifier"],
    method: Methods
  ) => Promise<void>;
}

export interface OTPProvider<
  Method extends OTPMethod,
  Variable extends string = string,
  OTPSendSuccessData = unknown,
  OTPSendFailedError = string
> {
  method: Method;
  templateVars: Variable[];
  template: string;
  sendOTP: (
    params: OTPRequest<Method, OTPProvider<Method, Variable>> & {
      interpolatedTemplate: string;
    }
  ) => Promise<
    | {
        hasFailed: false;
        data: OTPSendSuccessData;
      }
    | {
        hasFailed: true;
        error: OTPSendFailedError;
      }
  >;
}

export type OTPProvidersConfigMap<Method extends OTPMethod = OTPMethod> = {
  [key in Method]: OTPProvider<Method>;
};

export type OTPConfigMap<Method extends OTPMethod = OTPMethod> = {
  [key in Method]: OTPConfig<Method>;
};

export interface OTPConnectorAPI<
  Methods extends OTPMethod,
  ProviderConfig extends OTPProvider<Methods>
> {
  generateOTP: (
    params: Methods
  ) => Promise<OTPSuccessResponse | OTPFailedResponse>;
  sendOTP: (
    params: OTPRequest<Methods, ProviderConfig>
  ) => Promise<OTPSuccessResponse | OTPFailedResponse>;
  verifyOTP: (
    params: Omit<OTPRequest<Methods, ProviderConfig>, "data">
  ) => Promise<OTPSuccessResponse | OTPFailedResponse>;
  cancelOTP: (
    params: Omit<OTPRequest<Methods, ProviderConfig>, "data">
  ) => Promise<OTPResponse>;
}
