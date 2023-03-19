import { HTMLAttributes, PropsWithChildren } from "react";
import { CSSProperties } from "styled-components";

export type ButtonColor =
  | "primary"
  | "secondary"
  | "tertiary"
  | "colorless"
  | "transparent";

export type ButtonSize = "small" | "medium" | "large";

export type ButtonProps = PropsWithChildren<
  HTMLAttributes<HTMLButtonElement> & {
    color: ButtonColor;
    size: ButtonSize;
    disabled?: boolean;
    block?: boolean;
    prependIcon?: React.ReactNode;
    appendIcon?: React.ReactNode;
    loading?: boolean;
    type?: "button" | "submit" | "reset";
    minWidth?: CSSProperties["minWidth"];
    textAlignment?: CSSProperties["textAlign"];
    shouldReplaceTextWithSpinner?: boolean;
  }
>;

export type ButtonComponent = React.FC<ButtonProps>;
