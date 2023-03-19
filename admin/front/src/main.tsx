import React from "react";
import ReactDOM from "react-dom/client";
import { ThemeProvider } from "styled-components";
import App from "./App";
import { AppLoader } from "./app/components/AppLoader";
import { theme } from "./styles/theme";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <AppLoader>
        <App />
      </AppLoader>
    </ThemeProvider>
  </React.StrictMode>
);
