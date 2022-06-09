export const parsedMessage = {
  domain: {
    name: "AnyswapV6ERC20",
    version: "1",
    chainId: 31,
    verifyingContract: "0xa7260287Ab1845CA27A921AaE0048090AADB5F75",
  },
  message: {
    owner: "0xC7E2506A8Aa65F35C7A524Aef399fa731aF1780d",
    to: "0x722D892e6dDaa0EFDe08aC23FF25571D86FBacD4",
    value: "100000000000000000",
    deadline: 1654847820,
    nonce: "0",
  },
  primaryType: "Transfer",
  types: {
    EIP712Domain: [
      {
        name: "name",
        type: "string",
      },
      {
        name: "version",
        type: "string",
      },
      {
        name: "chainId",
        type: "uint256",
      },
      {
        name: "verifyingContract",
        type: "address",
      },
    ],
    Transfer: [
      {
        name: "owner",
        type: "address",
      },
      {
        name: "to",
        type: "address",
      },
      {
        name: "value",
        type: "uint256",
      },
      {
        name: "nonce",
        type: "uint256",
      },
      {
        name: "deadline",
        type: "uint256",
      },
    ],
  },
};
