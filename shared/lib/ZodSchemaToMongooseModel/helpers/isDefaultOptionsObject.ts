import type { DefaultOptions } from "../convertFunctions/types";

export const isDefaultOptionsObject = (
  options: Record<string, unknown>
): options is DefaultOptions => {
  return (
    Reflect.has(options, "required") && typeof options.required === "boolean"
  );
};
