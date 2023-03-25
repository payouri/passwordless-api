import { TabsRoot, TabsList, TabTrigger, TabContent } from "./styles";
import { EmailAuth } from "../EmailAuth/EmailAuth";
import { PhoneAuth } from "../PhoneAuth/PhoneAuth";

import { AuthType } from "../../../types";
import { CustomT, useTranslation } from "../../../customHooks/useTranslation";
import { TFunction } from "i18next";
import { useEffect, useRef, useState } from "react";
import { getAuthDataRequest } from "../../../services";

const ComponentMap = {
  [AuthType.EMAIL]: EmailAuth,
  [AuthType.PHONE]: PhoneAuth,
};

const getTabsNames = (t: CustomT) => ({
  [AuthType.EMAIL]: t("authType.email"),
  [AuthType.PHONE]: t("authType.phone"),
});

const DEFAULT_TAB = AuthType.EMAIL;

export const AuthTypeChoice = ({
  onLogin,
}: {
  onLogin: (data: { authType: AuthType; identifier: string }) => Promise<void>;
}) => {
  const [loading, setLoading] = useState(false);
  const currentTab = useRef(DEFAULT_TAB);
  const { t } = useTranslation();
  const tabsNames = getTabsNames(t);
  const tabs = Object.values(AuthType);

  const handleLogin = async (identifier: string) => {
    if (loading) return;

    setLoading(true);
    try {
      await onLogin({
        authType: currentTab.current,
        identifier,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <TabsRoot
      defaultValue={DEFAULT_TAB}
      onValueChange={(tab) => {
        currentTab.current = tab as AuthType;
      }}
    >
      <TabsList>
        {tabs.map((tab) => (
          <TabTrigger disabled={loading} key={tab} value={tab}>
            {tabsNames[tab]}
          </TabTrigger>
        ))}
      </TabsList>
      {tabs.map((tab) => (
        <TabContent key={tab} value={tab}>
          {ComponentMap[tab]({
            onLogin: handleLogin,
          })}
        </TabContent>
      ))}
    </TabsRoot>
  );
};
