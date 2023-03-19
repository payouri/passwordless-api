import styled from "styled-components";
import { getButtonColor } from "./helpers/getButtonColor";
import { getButtonStyleFromSize } from "./helpers/getButtonStyleFromSize";
import { ButtonProps } from "./types";

type StyledButtonProps = Pick<
  ButtonProps,
  "size" | "block" | "color" | "disabled" | "loading" | "minWidth"
>;

export const StyledButton = styled.button.withConfig<StyledButtonProps>({
  shouldForwardProp: (prop, defaultValidatorFn) =>
    prop !== "loading" && defaultValidatorFn(prop),
})<StyledButtonProps>`
  align-items: center;
  border-radius: ${({ theme }) => theme.borderRadius.button};
  cursor: ${({ disabled }) => (disabled ? "default" : "pointer")};
  display: flex;
  flex-direction: row;
  flex: ${({ block }) => (block ? 1 : 0)};
  font-weight: 500;
  gap: ${({ theme }) => theme.gap[12]};
  line-height: 1;
  transition: transform 0.2s ease-in-out;
  white-space: nowrap;
  width: ${({ block }) => (block ? "100%" : "auto")};
  min-width: ${({ minWidth }) =>
    typeof minWidth === "number" ? `${minWidth}px` : minWidth || "auto"};
  border-color: transparent;
  ${getButtonColor};
  ${getButtonStyleFromSize}
  &:hover {
    transform: ${({ disabled, loading }) =>
      disabled || loading ? "none" : "scale(1.0125)"};
  }
  &:active {
    transform: ${({ disabled, loading }) =>
      disabled || loading ? "none" : "scale(0.95, 0.90)"};
  }
  :focus {
    outline: 2px solid cornflowerblue;
  }
`;
