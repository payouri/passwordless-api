export enum AuthMethodType {
  EMAIL = "email",
  PHONE = "phone",
}

export type ValidateSessionMap = {
  [ValidateSessionType.OTP]: {
    otp: string;
  };
};

export enum ValidateSessionType {
  OTP = "otp",
}
