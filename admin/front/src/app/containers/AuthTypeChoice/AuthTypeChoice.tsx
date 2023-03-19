import { TabsRoot, TabsList, TabTrigger, TabContent } from "./styles";
import { EmailAuth } from "../EmailAuth/EmailAuth";
import { SMSAuth } from "../SMSAuth/SMSAuth";

import { AuthType } from "../../../types";
import { CustomT, useTranslation } from "../../../customHooks/useTranslation";
import { TFunction } from "i18next";
import { useRef, useState } from "react";

const ComponentMap = {
  [AuthType.EMAIL]: EmailAuth,
  [AuthType.SMS]: SMSAuth,
};

const getTabsNames = (t: CustomT) => ({
  [AuthType.EMAIL]: t("authType.email"),
  [AuthType.SMS]: t("authType.phone"),
});

const DEFAULT_TAB = AuthType.EMAIL;

export const AuthTypeChoice = () => {
  const [loading, setLoading] = useState(false);
  const currentTab = useRef(DEFAULT_TAB);
  const { t } = useTranslation();
  const tabsNames = getTabsNames(t);
  const tabs = Object.values(AuthType);

  const handleLogin = async (identifier: string) => {
    if (loading) return;

    setLoading(true);
    try {
      console.log({
        [currentTab.current]: identifier,
      });
      await new Promise((resolve) => setTimeout(resolve, 2000));
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
