export const validateLength = <Val extends { length: number }>(
  value: Val,
  {
    min,
    max,
  }: {
    min?: number;
    max?: number;
  }
): boolean => {
  if (min && value.length < min) {
    return false;
  }
  if (max && value.length > max) {
    return false;
  }
  return true;
};
