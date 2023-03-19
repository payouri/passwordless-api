export enum AuthMethodType {
  EMAIL = "email",
  PHONE = "phone",
}

export type AuthMethodParams = {
  type: AuthMethodType;
  payload: string;
};
