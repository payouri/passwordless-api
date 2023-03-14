import { TranslationsMap } from "./translationsMap";

export const EN_US: TranslationsMap = {
  authType: {
    email: "Email",
    phone: "Phone",
  },
  forms: {
    email: {
      errors: {
        invalid: "Invalid email",
        required: "Email is required",
      },
      label: "Input your Email",
      placeholder: "john.doe@example.com",
    },
    phone: {
      errors: {
        invalid: "Invalid phone",
        required: "Phone is required",
      },
      label: "Input your Phone number",
      placeholder: "+XX XXX XXX XXX",
    },
  },
  login: "Login",
};
