import { isObject } from "../../../guards/isObject.js";

export const hasAnyOfArrayField = (
  options: Record<string, unknown>
): options is {
  additionalProperties: {
    anyOf: {
      type: string | string[];
    }[];
  };
} => {
  return (
    "additionalProperties" in options &&
    typeof options.additionalProperties === "object" &&
    options.additionalProperties !== null &&
    "anyOf" in options.additionalProperties &&
    Array.isArray(options.additionalProperties.anyOf) &&
    options.additionalProperties.anyOf.length > 0 &&
    isObject(options.additionalProperties.anyOf[0]) &&
    (typeof options.additionalProperties.anyOf[0].type === "string" ||
      (Array.isArray(options.additionalProperties.anyOf[0].type) &&
        options.additionalProperties.anyOf[0].type.length > 0 &&
        options.additionalProperties.anyOf[0].type.every(
          (type) => typeof type === "string"
        )))
  );
};
