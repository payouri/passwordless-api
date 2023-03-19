/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/jsx-props-no-spreading */
import { InputRef } from "rc-input";
import { forwardRef, useImperativeHandle, useMemo, useRef } from "react";
import { CustomInput, CustomLabel } from "./styles";
import { InputProps } from "./types";

export const Input = forwardRef<
  HTMLInputElement | null | undefined,
  InputProps
>(({ children, border, ...props }, ref) => {
  const inputRef = useRef<InputRef>(null);
  const inputId = useMemo(
    () => props.id || props.name || "input",
    [props.id, props.name]
  );

  useImperativeHandle(ref, () =>
    inputRef.current?.input ? inputRef.current.input : undefined
  );

  return (
    <CustomLabel htmlFor={inputId}>
      <CustomInput ref={inputRef} id={inputId} {...props} />
    </CustomLabel>
  );
});
