import { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
  *, *::before, *::after {
    box-sizing: border-box;
    user-select: none;
    margin: 0;
    padding: 0;
    line-height: 1.57;
    font-family: Inter, sans-serif;
  }
  ::marker {
    display: block
  }
  html {
    font-size: 16px;
  }
  body {
    margin: 0;
    overflow: hidden;
  }
  code, pre, samp, textarea, input {
    user-select: text;
  }
  ol, ul {
    list-style: none;
  }
  :focus {
    outline: ${({
      theme: {
        outline: { focus },
      },
    }) => focus};
  }
`;
