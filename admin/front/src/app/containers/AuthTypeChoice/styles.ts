import { Root, List, Trigger, Content } from "@radix-ui/react-tabs";
import styled from "styled-components";

export const TabsRoot = styled(Root)`
  display: flex;
  flex-direction: column;
  gap: ${({ theme: { gap } }) => gap[24]};
  outline: 0;
`;

export const TabsList = styled(List)`
  display: flex;
  flex-direction: row;
  border-top-left-radius: ${({ theme: { borderRadius } }) => borderRadius.md};
  border-top-right-radius: ${({ theme: { borderRadius } }) => borderRadius.md};
  > :first-child {
    border-top-left-radius: inherit;
  }
  > :last-child {
    border-top-right-radius: inherit;
  }
`;

export const TabTrigger = styled(Trigger)`
  flex: 1 1 auto;
  border-width: 2px;
  border-left: 0;
  border-right: 0;
  border-collapse: collapse;
  border-color: transparent;
  border-style: solid;
  border-bottom-color: ${({ theme: { grayscale } }) => grayscale[80]};
  font-size: ${({ theme: { textSize } }) => textSize.md};
  padding: ${({ theme: { gap } }) => gap[4]};
  &:focus,
  &:active {
    z-index: 1;
    outline: 0;
  }
  &[data-state="active"] {
    border-bottom-color: ${({ theme: { grayscale } }) => grayscale[0]};
  }
  /* font-variant: small-caps; */
`;

export const TabContent = styled(Content)`
  outline: 0;
`;
