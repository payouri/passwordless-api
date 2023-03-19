import BaseInput from "rc-input";
import styled from "styled-components";
import { InputProps } from "./types";

export const CustomLabel = styled.label<Pick<InputProps, "border">>`
  display: flex;
  border: ${({ border = "1px solid transparent" }) => border};
`;

export const CustomInput = styled(BaseInput)`
  border-radius: ${(props) => props.theme.borderRadius.input};
  font-size: ${(props) => props.theme.textSize.md};
  background-color: ${(props) => props.theme.grayscale[140]};
  padding: 0 ${(props) => props.theme.gap[8]};
  min-height: 38px;
  color: ${(props) => props.theme.grayscale[0]};
  flex: 1;
  border: 0;

  .rc-input-wrapper.rc-input-group {
    display: flex;
    gap: ${(props) => props.theme.gap[8]};
    align-items: center;
    height: 100%;

    .rc-input {
      flex: 1;
      color: currentColor;
      font-size: inherit;
      border: 0;
      outline: 0;
      padding: 0.125rem 0.5rem 0.125rem 0;
      background-color: inherit;
      ::placeholder {
        color: ${(props) => props.theme.grayscale[60]};
      }
    }
  }

  &:focus-within {
    outline: 2px solid cornflowerblue;
  }
`;
