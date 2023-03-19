import { PropsWithChildren } from "react";
import { useInitTranslations } from "../../../customHooks/useTranslation";

export const AppLoader = (props: PropsWithChildren) => {
  const { hasInitialized } = useInitTranslations();

  if (!hasInitialized) return null;

  return <>{props.children}</>;
};
