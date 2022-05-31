import { waitForReceipt } from "@/utils";
import { txExplorerLink } from "@/utils/address-helpers";
import Web3 from "web3";

// TODO: add functions type parameters
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export function transactionCallback({ resolve, reject, web3, explorer }) {
  return async (err: Record<string, unknown>, txHash: string) => {
    const textExplorerLink = txExplorerLink(txHash, explorer);
    if (err) {
      return reject(
        new Error(`Execution failed ${err?.message} ${textExplorerLink}`)
      );
    }
    try {
      const receipt = await waitForReceipt(txHash, web3);
      if (receipt.status) {
        return resolve(receipt);
      } else {
        const url = `${process.env.VUE_APP_EXPLORER_ADDRESS}/tx/${txHash}`;
        return reject(
          new Error(
            `<span>Error: Transaction Info <a class="error-message" href="${url}">${url}</a></span>`
          )
        );
      }
    } catch (error) {
      return reject(new Error(`${error} ${textExplorerLink}`));
    }
  };
}

type Block = {
  minimumGasPrice: string;
};

export const gasPriceHex = async (web3: Web3): Promise<string> => {
  // check possibllle other networks?
  const block = (await web3.eth.getBlock("latest")) as unknown as Block;

  let gasPriceParsed = parseInt(block.minimumGasPrice);
  gasPriceParsed = gasPriceParsed <= 1 ? 1 : gasPriceParsed * 1.03;

  return `0x${Math.ceil(gasPriceParsed).toString(16)}`;
};
