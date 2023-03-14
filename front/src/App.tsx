import { Form } from "./app/components/Form/Form";
import { PageContainer } from "./app/components/PageContainer";
import { AuthTypeChoice } from "./app/containers/AuthTypeChoice/AuthTypeChoice";
import {
  useInitTranslations,
  useTranslation,
} from "./customHooks/useTranslation";
import { GlobalStyle } from "./styles/global.style";
import { emailAuthFormDataSchema } from "./validators";

function App() {
  const { t, loading } = useTranslation();

  // if (loading) return <div>Loading...</div>;

  return (
    <PageContainer>
      <GlobalStyle />
      <AuthTypeChoice />
    </PageContainer>
  );
}

export default App;
