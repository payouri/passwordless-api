import { useEffect, useState } from "react";
import { Form } from "./app/components/Form/Form";
import { PageContainer } from "./app/components/PageContainer";
import { AuthTypeChoice } from "./app/containers/AuthTypeChoice/AuthTypeChoice";
import {
  useInitTranslations,
  useTranslation,
} from "./customHooks/useTranslation";
import { authenticateUserRequest, getAuthDataRequest } from "./services";
import { GlobalStyle } from "./styles/global.style";
import { AuthType } from "./types";
import { emailAuthFormDataSchema } from "./validators";

function App() {
  const [authData, setAuthData] = useState<
    | {
        loading: false;
        authData: {
          token: string;
        } | null;
        error?: {
          code: string;
          message: string;
        };
      }
    | {
        loading: true;
        authData: null;
      }
  >({
    loading: false,
    authData: null,
  });
  const { t, loading } = useTranslation();
  const handleGetAuthData = async (reloadIfError = false) => {
    if (
      authData.loading ||
      (!authData.loading && authData.authData) ||
      (authData.error && !reloadIfError)
    )
      return;

    setAuthData({
      loading: true,
      authData: null,
    });

    const result = await getAuthDataRequest();

    if (result.hasFailed) {
      setAuthData({
        loading: false,
        authData: null,
        error: {
          code: result.error.code,
          message: result.error.message,
        },
      });
    } else {
      setAuthData({
        loading: false,
        authData: result.data,
      });
    }
  };

  const handleLogin = async (data: {
    authType: AuthType;
    identifier: string;
  }) => {
    if (!authData.authData) return;

    const response = await authenticateUserRequest({
      body: {
        authType: data.authType,
        payload: data.identifier,
      },
      token: authData.authData?.token,
    });

    console.log(response);
  };

  useEffect(() => {
    handleGetAuthData();
  }, []);

  if (authData.loading || loading) return <div>Loading...</div>;

  if (authData.error) {
    return (
      <div>
        <h1>Something went wrong</h1>
        <p>{authData.error.message}</p>
        <button onClick={() => handleGetAuthData(true)}>Reload</button>
      </div>
    );
  }

  return (
    <PageContainer>
      <GlobalStyle />
      <AuthTypeChoice onLogin={handleLogin} />
    </PageContainer>
  );
}

export default App;
