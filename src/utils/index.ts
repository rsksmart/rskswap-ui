import Web3 from "web3";
import { ApprovalReceipt } from "@/types/receipts";

export const MAX_UINT256 =
  "115792089237316195423570985008687907853269984665640564039457584007913129639935";

export function sanitizeTxHash(txHash: string) {
  const regExp = new RegExp(/^0x[0-9A-F]+$/i);
  return regExp.test(txHash) ? txHash : "";
}

export async function waitForReceipt(
  txHash: string,
  web3: Web3
): Promise<ApprovalReceipt> {
  let timeElapsed = 0;
  const interval = 10_000;
  return new Promise((resolve, reject) => {
    const checkInterval = setInterval(async () => {
      timeElapsed += interval;
      const receipt = await web3.eth.getTransactionReceipt(txHash);
      if (receipt != null) {
        clearInterval(checkInterval);
        return resolve(receipt);
      }
      if (timeElapsed > 300_000) {
        clearInterval(checkInterval);
        return reject(
          new Error(
            "Transaction was not mined within 300 seconds. Be aware that it might still be mined!"
          )
        );
      }
    }, interval);
  });
}
