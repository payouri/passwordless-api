import {
  useTranslation as useI18nTranslation,
  initReactI18next,
} from "react-i18next";
import i18n, { TOptions } from "i18next";
import { TranslationKey } from "../../internationalization/translationsMap";
import { useEffect, useState } from "react";
import { EN_US } from "../../internationalization/en";

export const useInitTranslations = () => {
  const [hasInitialized, setHasInitialized] = useState(false);

  useEffect(() => {
    if (i18n.isInitialized) {
      setHasInitialized(true);

      return;
    }

    i18n.use(initReactI18next).init(
      {
        resources: {
          en_us: { translation: EN_US },
          en: { translation: EN_US },
        },
        lng: "en",
        fallbackLng: "en",
        interpolation: {
          escapeValue: false,
        },
      },
      () => {
        setHasInitialized(true);
      }
    );
  }, []);

  return {
    hasInitialized,
  };
};

export const useTranslation = () => {
  const [t, i18n, ready] = useI18nTranslation();

  const customT = (key: TranslationKey, options?: TOptions) => {
    return t(key, options || {});
  };

  console.log("i18n", i18n);

  return {
    t: customT,
    currentLanguage: i18n.language,
    languages: i18n.languages,
    loading: !ready,
  };
};

export type CustomT = ReturnType<typeof useTranslation>["t"];
