import BigNumber from "bignumber.js";

export const parseMessageToSign = (
  nonce: string,
  deadline: number,
  tokenName: string,
  verifyingContract: string,
  owner: string,
  value: number,
  decimals: number
) => {
  const messageData = {
    domain: {
      name: tokenName,
      version: "1",
      chainId: Number(process.env.VUE_APP_CHAIN_ID) || 31,
      verifyingContract,
    },
    message: {
      owner,
      to: process.env.VUE_APP_RELAYER_ADDRESS || "0x722D892e6dDaa0EFDe08aC23FF25571D86FBacD4",
      value: new BigNumber(value).shiftedBy(
        decimals
      ),
      deadline,
      nonce: nonce,
    },
    primaryType: "Transfer",
    types: {
      EIP712Domain: [
        { name: "name", type: "string" },
        { name: "version", type: "string" },
        { name: "chainId", type: "uint256" },
        { name: "verifyingContract", type: "address" },
      ],
      Transfer: [
        { name: "owner", type: "address" },
        { name: "to", type: "address" },
        { name: "value", type: "uint256" },
        { name: "nonce", type: "uint256" },
        { name: "deadline", type: "uint256" },
      ],
    },
  };

  return messageData;
};
