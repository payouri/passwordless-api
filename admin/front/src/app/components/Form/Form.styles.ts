import { Field, Label, Root, Message } from "@radix-ui/react-form";
import styled, { CSSProperties } from "styled-components";

type FormRootProps = {
  maxWidth?: CSSProperties["maxWidth"];
  minWidth?: CSSProperties["minWidth"];
};

export const FormRoot = styled(Root)<FormRootProps>`
  display: flex;
  flex-direction: column;
  max-width: ${({ maxWidth = "auto" }) => maxWidth};
  min-width: ${({ minWidth = "20rem" }) => minWidth};
  gap: ${({ theme: { gap } }) => gap[24]};
`;

export const FieldHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: ${({ theme: { gap } }) => gap[8]};
`;

export const FormField = styled(Field)`
  display: flex;
  flex-direction: column;
  gap: ${({ theme: { gap } }) => gap[8]};
  position: relative;
`;

export const FormLabel = styled(Label)`
  font-size: ${({ theme: { textSize } }) => textSize.md};
  line-height: 1;
`;

export const FormMessage = styled(Message)`
  font-size: ${({ theme: { textSize } }) => textSize.sm};
`;
