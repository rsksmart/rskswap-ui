import ENVIRONMENTS from "@/constants/environments";

// TODO: need do double check the values for the main net
// todo: add swapRbtcProxyAddress to mainnet?
export const MAIN_NET_RSK_CONFIG = {
  networkId: 30,
  name: "RSK Mainnet",
  localStorageName: "rsk-mainnet",
  bridge: "0x9d11937e2179dc5270aa86a3f8143232d6da0e69",
  allowTokens: "0xcb789036894a83a008a2aa5b3c2dde41d0605a9a",
  federation: "0x7ecfda6072942577d36f939ad528b366b020004b",
  explorerAddress: "https://explorer.rsk.co",
  explorerTokenTab: "?__tab=tokens%20transfers",
  secondsPerBlock: 30,
  rpc: "https://public-node.rsk.co",
  v2UpdateBlock: 3540341,
  feePercentageDivider: 10_000,
  tokenPrefix: "r",
  env: ENVIRONMENTS.MAINNET,
  isRsk: true,
};

export const TEST_NET_RSK_CONFIG = {
  networkId: 31,
  name: "RSK Testnet",
  localStorageName: "rsk-testnet",
  bridge: "0x684a8a976635fb7ad74a0134ace990a6a0fcce84",
  allowTokens: "0xc65bf0ae75dc1a5fc9e6f4215125692a548c773a",
  federation: "0x5d663981d930e8ec108280b9d80885658148ab0f",
  relayer: "0x7c77704007C9996Ee591C516f7319828BA49d91E",
  swapRbtcProxyAddress: "0x7c77704007C9996Ee591C516f7319828BA49d91E",
  explorerAddress: "https://explorer.testnet.rsk.co",
  explorerTokenTab: "?__tab=tokens%20transfers",
  secondsPerBlock: 30,
  rpc: "https://public-node.testnet.rsk.co",
  v2UpdateBlock: 1945524,
  feePercentageDivider: 10_000,
  tokenPrefix: "r",
  env: ENVIRONMENTS.TESTNET,
  isRsk: true,
};

export const defaultNetworks = {
  [ENVIRONMENTS.MAINNET]: MAIN_NET_RSK_CONFIG,
  [ENVIRONMENTS.TESTNET]: TEST_NET_RSK_CONFIG,
};
