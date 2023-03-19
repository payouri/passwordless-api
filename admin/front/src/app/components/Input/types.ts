import { InputProps as RCInputProps } from "rc-input";
import { CSSProperties } from "styled-components";

export type InputProps = RCInputProps & {
  border?: CSSProperties["border"];
  hasError?: boolean;
};
