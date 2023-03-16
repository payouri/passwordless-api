export const concatAnyOfFields = (params: {
  additionalProperties: {
    anyOf: {
      type: string | string[];
    }[];
  };
}): string[] => {
  const {
    additionalProperties: { anyOf },
  } = params;

  return anyOf.reduce<string[]>((acc, { type }) => {
    if (typeof type === "string") {
      return [...acc, type];
    }
    return [...acc, ...type];
  }, []);
};
