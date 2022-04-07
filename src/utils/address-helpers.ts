export const convertToNumber = (value: number | string): number => {
  if (typeof value === "number") {
    return value;
  }
  const radix = value.startsWith("0x") ? 16 : 10;
  return parseInt(value, radix);
};
