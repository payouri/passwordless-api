import { PathsToStringProps, Join } from "../types/utils";

export type TranslationsMap = {
  login: string;
  authType: {
    email: string;
    phone: string;
  };
  forms: {
    email: {
      label: string;
      placeholder: string;
      errors: {
        required: string;
        invalid: string;
      };
    };
    phone: {
      label: string;
      placeholder: string;
      errors: {
        required: string;
        invalid: string;
      };
    };
  };
};

export type TranslationKey = Join<PathsToStringProps<TranslationsMap>, ".">;
