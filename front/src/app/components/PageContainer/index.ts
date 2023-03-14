import styled, { CSSProperties } from "styled-components";

export const PageContainer = styled.div<{
  padding?: CSSProperties["padding"];
  align?: CSSProperties["alignItems"];
  justify?: CSSProperties["justifyContent"];
}>`
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100%;
  justify-content: ${({ justify = "center" }) => justify};
  align-items: ${({ align = "center" }) => align};
  gap: ${({ theme: { gap } }) => gap[16]};
  padding: ${({ theme: { gap } }) => `0 ${gap[16]}`};
`;
