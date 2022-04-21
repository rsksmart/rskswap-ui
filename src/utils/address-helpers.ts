import { sanitizeTxHash } from "@/utils/index";

export const convertToNumber = (value: number | string): number => {
  if (typeof value === "number") {
    return value;
  }
  const radix = value.startsWith("0x") ? 16 : 10;
  return parseInt(value, radix);
};

export const txExplorerLink = (txHash: string, explorerLink: string) => {
  const sanitizedTxHash = sanitizeTxHash(txHash);
  if (!txHash) {
    return "";
  }
  return `<a target="_blank" href="${explorerLink}/tx/${sanitizedTxHash}">see Tx</a>`;
};
