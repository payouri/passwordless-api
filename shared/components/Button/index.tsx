/* eslint-disable react/jsx-props-no-spreading */
import { FC } from "react";
import { CSSProperties } from "styled-components";
import { SpinnerElement } from "../Spinner/Spinner";
import { getSpinnerProps } from "./helpers/getSpinnerProps";
import { StyledButton } from "./styles";
import { ButtonProps } from "./types";

export type { ButtonProps } from "./types";

const convertTextAlignmentToFlexJustify = (
  textAlignment: ButtonProps["textAlignment"]
): CSSProperties["justifyContent"] => {
  if (textAlignment === "center") {
    return "center";
  }
  if (textAlignment === "right") {
    return "flex-end";
  }
  if (textAlignment === "left" || textAlignment === "start") {
    return "flex-start";
  }
  return "center";
};

export const Button: FC<ButtonProps> = ({
  color,
  size = "medium",
  appendIcon,
  prependIcon,
  block,
  loading,
  disabled,
  minWidth,
  textAlignment,
  shouldReplaceTextWithSpinner,
  "aria-disabled": ariaDisabled,
  ...props
}) => {
  return (
    <StyledButton
      {...props}
      minWidth={minWidth}
      size={size}
      aria-disabled={ariaDisabled || disabled || loading}
      disabled={loading || disabled}
      color={color}
      block={block}
      loading={loading}
    >
      {loading && !shouldReplaceTextWithSpinner ? (
        <SpinnerElement {...getSpinnerProps({ size })} />
      ) : (
        prependIcon
      )}
      {props.children ? (
        <span
          style={{
            flex: "1 1 auto",
            textAlign: textAlignment,
            justifyContent: convertTextAlignmentToFlexJustify(textAlignment),
            display: "flex",
          }}
        >
          {shouldReplaceTextWithSpinner && loading ? (
            <SpinnerElement {...getSpinnerProps({ size })} />
          ) : (
            props.children
          )}
        </span>
      ) : null}
      {appendIcon}
    </StyledButton>
  );
};
