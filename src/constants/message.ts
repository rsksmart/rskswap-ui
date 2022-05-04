export const signTypes = {
  EIP712Domain: [
    { name: "name", type: "string" },
    { name: "version", type: "string" },
    { name: "chainId", type: "uint256" },
    { name: "verifyingContract", type: "address" },
  ],
  Claim: [
    { name: "to", type: "address" },
    { name: "amount", type: "uint256" },
    { name: "transactionHash", type: "bytes32" },
    { name: "originChainId", type: "uint256" },
    { name: "relayer", type: "address" },
    { name: "fee", type: "uint256" },
    { name: "nonce", type: "uint256" },
    { name: "deadline", type: "uint256" },
  ],
};
