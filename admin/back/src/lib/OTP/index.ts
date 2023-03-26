import {
  createOTPConnector,
  OTPMethod,
} from "../../../../../shared/lib/OTPConnector/index.js";

export { OTPMethod };

const connector = createOTPConnector({
  connector: {
    saveOTP: async (params) => {},
    deleteOTP: async (params) => {},
    getOTP: async (params) => {
      return null;
    },
    updateOTP: async (params) => {},
  },
  otp: {
    [OTPMethod.EMAIL]: {
      length: 6,
      expiryMS: 1000 * 60 * 5,
      digits: true,
      upperCase: true,
      lowerCase: false,
      specialChars: false,
      method: OTPMethod.EMAIL,
      retryLimit: 3,
      retryWait: 60,
    },
    [OTPMethod.SMS]: {
      length: 6,
      expiryMS: 1000 * 60 * 5,
      digits: true,
      upperCase: true,
      lowerCase: false,
      specialChars: false,
      method: OTPMethod.SMS,
      retryLimit: 3,
      retryWait: 60,
    },
  },
})({
  [OTPMethod.EMAIL]: {
    method: OTPMethod.EMAIL,
    sendOTP: async (params) => {
      return {
        hasFailed: false,
        data: {},
      };
    },
    template: "OTP is {{otp}}",
    templateVars: [],
  },
  [OTPMethod.SMS]: {
    method: OTPMethod.SMS,
    sendOTP: async (params) => {
      return {
        hasFailed: false,
        data: {},
      };
    },
    template: "OTP is {{otp}}",
    templateVars: [],
  },
});

export const getOTPConnector = () => connector;
