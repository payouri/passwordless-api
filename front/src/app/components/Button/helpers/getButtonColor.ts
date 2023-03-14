import { css } from "styled-components";
import { ButtonColor } from "../types";

export const getButtonColor = ({
  color,
  disabled,
  loading = false,
}: {
  color: ButtonColor;
  disabled?: boolean;
  loading?: boolean;
}) => {
  switch (color) {
    case "transparent":
      return css`
        background-color: transparent;
        color: ${({ theme }) =>
          loading || disabled ? theme.grayscale[50] : theme.grayscale[10]};
      `;
    case "primary":
    case "secondary":
    case "tertiary":
    case "colorless":
    default:
      return css`
        background-color: ${({ theme }) =>
          disabled ? theme.grayscale[60] : theme.grayscale[10]};
        color: ${({ theme }) =>
          loading || disabled ? theme.grayscale[130] : theme.grayscale[140]};
      `;
  }
};
