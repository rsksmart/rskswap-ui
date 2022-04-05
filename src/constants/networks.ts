import * as chainId from "./chainIds";

// todo: check tokens for rBTC and WBTC\
// todo: add proper tokens
// import {
//   TEST_NET_KOVAN_TOKENS,
//   TEST_NET_KOVAN_MAIN_TOKEN,
//   TEST_NET_KOVAN_GAS_TOKEN,
// } from "./tokens/testNetKovan";
// import {
//   TEST_NET_RSK_CROSS_KOVAN_TOKENS,
//   TEST_NET_RSK_CROSS_KOVAN_MAIN_TOKEN,
//   TEST_NET_RSK_CROSS_KOVAN_GAS_TOKEN,
// } from "./tokens/testNetRskCrossKovan";
const TEST_NET_KOVAN_TOKENS = "TBD";
const TEST_NET_KOVAN_MAIN_TOKEN = "TBD";
const TEST_NET_KOVAN_GAS_TOKEN = "TBD";
const TEST_NET_RSK_CROSS_KOVAN_TOKENS = "TBD";
const TEST_NET_RSK_CROSS_KOVAN_MAIN_TOKEN = "TBD";
const TEST_NET_RSK_CROSS_KOVAN_GAS_TOKEN = "TBD";

// todo: refactor this to a different file
const MAIN_NET_RSK_CROSS_ETHEREUM_TOKENS = [
  {
    symbol: "DOC",
    token: "DOC",
    name: "Dollar on Chain",
    typeId: 4,
    address: "0xe700691da7b9851f2f35f8b8182c69c53ccad9db",
    decimals: 18,
    methodType: "RECEIVER",
    icon: "N/A",
  },
  {
    symbol: "rDAI",
    token: "rDAI",
    name: "Rsk BTC",
    typeId: 4,
    address: "0x6b1a73d547f4009a26b8485b63d7015d248ad406",
    decimals: 18,
    methodType: "RECEIVER",
    icon: "N/A",
  },
];

const MAIN_NET_ETHEREUM_TOKENS = [
  {
    symbol: "DOC",
    token: "DOC",
    name: "Dollar on Chain",
    typeId: 4,
    address: "0xe700691da7b9851f2f35f8b8182c69c53ccad9db",
    decimals: 18,
    methodType: "RECEIVER",
    icon: "N/A",
  },
  {
    symbol: "rDAI",
    token: "rDAI",
    name: "Rsk BTC",
    typeId: 4,
    address: "0x6b1a73d547f4009a26b8485b63d7015d248ad406",
    decimals: 18,
    methodType: "RECEIVER",
    icon: "N/A",
  },
];

import ENVIRONMENTS from "@/constants/environments";
import { Token } from "@/types/token";

const infuraKey = process.env.VUE_APP_INFURA_KEY;

// --------- CONFIGS ----------
export const TEST_NET_KOVAN_CONFIG = {
  networkId: chainId.TEST_NET_KOVAN,
  name: "Kovan",
  localStorageName: "ethereum-kovan",
  bridge: "0x12ed69359919fc775bc2674860e8fe2d2b6a7b5d",
  allowTokens: "0x92BF86334583909B60F9b798A9Dd7Debd899fEc4",
  federation: "0xa347438BC288f56Cb6083A79133e70DD2d1f6c2d",
  explorer: "https://kovan.etherscan.io",
  explorerTokenTab: "#tokentxns",
  secondsPerBlock: 5,
  rpc: `https://kovan.infura.io/v3/${infuraKey}`,
  v2UpdateBlock: 25547922,
  feePercentageDivider: 10_000,
  tokenPrefix: "e",
  env: ENVIRONMENTS.TESTNET,
  mainToken: TEST_NET_KOVAN_MAIN_TOKEN,
  gasToken: TEST_NET_KOVAN_GAS_TOKEN,
  isRsk: false,
  isSide: true,
  // tokens: getTokensWithReceiveToken(
  //   TEST_NET_KOVAN_TOKENS,
  //   TEST_NET_RSK_CROSS_KOVAN_TOKENS
  // ),
  crossToNetwork: undefined,
};

export const TEST_NET_RSK_CROSS_KOVAN_CONFIG = {
  networkId: chainId.TEST_NET_RSK,
  name: "RSK Testnet",
  localStorageName: "rsk-testnet",
  bridge: "0x684a8a976635fb7ad74a0134ace990a6a0fcce84",
  allowTokens: "0xc65bf0ae75dc1a5fc9e6f4215125692a548c773a",
  federation: "0x5d663981d930e8ec108280b9d80885658148ab0f",
  relayer: "0x7c77704007C9996Ee591C516f7319828BA49d91E",
  swapRbtcProxy: "0x7c77704007C9996Ee591C516f7319828BA49d91E",
  explorer: "https://explorer.testnet.rsk.co",
  explorerTokenTab: "?__tab=tokens%20transfers",
  secondsPerBlock: 30,
  rpc: "https://public-node.testnet.rsk.co",
  v2UpdateBlock: 1945524,
  feePercentageDivider: 10_000,
  crossToNetwork: TEST_NET_KOVAN_CONFIG,
  tokenPrefix: "r",
  env: ENVIRONMENTS.TESTNET,
  mainToken: TEST_NET_RSK_CROSS_KOVAN_MAIN_TOKEN,
  gasToken: TEST_NET_RSK_CROSS_KOVAN_GAS_TOKEN,
  isRsk: true,
  isSide: false,
  // tokens: getTokensWithReceiveToken(
  //   TEST_NET_RSK_CROSS_KOVAN_TOKENS,
  //   TEST_NET_KOVAN_TOKENS
  // ),
};

// todo: solve this type error
// TEST_NET_KOVAN_CONFIG.crossToNetwork = TEST_NET_RSK_CROSS_KOVAN_CONFIG;

export const MAIN_NET_RSK_CONFIG = {
  networkId: chainId.MAIN_NET_RSK,
  name: "RSK Mainnet",
  localStorageName: "rsk-mainnet",
  bridge: "0x9d11937e2179dc5270aa86a3f8143232d6da0e69",
  allowTokens: "0xcb789036894a83a008a2aa5b3c2dde41d0605a9a",
  federation: "0x7ecfda6072942577d36f939ad528b366b020004b",
  explorer: "https://explorer.rsk.co",
  explorerTokenTab: "?__tab=tokens%20transfers",
  secondsPerBlock: 30,
  rpc: "https://public-node.rsk.co",
  v2UpdateBlock: 3540341,
  feePercentageDivider: 10_000,
  crossToNetwork: TEST_NET_KOVAN_CONFIG,
  tokenPrefix: "r",
  env: ENVIRONMENTS.MAINNET,
  // mainToken: MAIN_NET_RSK_CROSS_ETHEREUM_MAIN_TOKEN,
  mainToken: TEST_NET_RSK_CROSS_KOVAN_MAIN_TOKEN,
  // gasToken: MAIN_NET_RSK_CROSS_ETHEREUM_GAS_TOKEN,
  gasToken: TEST_NET_RSK_CROSS_KOVAN_GAS_TOKEN,
  isRsk: true,
  isSide: false,
  tokens: getTokensWithReceiveToken(
    MAIN_NET_RSK_CROSS_ETHEREUM_TOKENS,
    MAIN_NET_ETHEREUM_TOKENS
  ),
};

export const rskNetworks = [
  MAIN_NET_RSK_CONFIG,
  TEST_NET_RSK_CROSS_KOVAN_CONFIG,
];

export const defaultNetworks = {
  [ENVIRONMENTS.MAINNET]: {
    rskConfig: MAIN_NET_RSK_CONFIG,
  },
  [ENVIRONMENTS.TESTNET]: {
    rskConfig: TEST_NET_RSK_CROSS_KOVAN_CONFIG,
    sideConfig: TEST_NET_KOVAN_CONFIG,
  },
};

export const SWAP_RBTC_PROXY_ADDRESS = {
  address: "0x48288D0e3079A03f6EC1846554CFc58C2696Aaee",
  explorer: "0x74Ce26A2e4c1368C48A0157CE762944d282896Db",
  network: "rsk",
  identifier: "SWAP_RBTC_PROXY_V1",
  name: "SwapRbtcProxy v1",
  tag: "v1",
  networkId: chainId.MAIN_NET_RSK,
};

export const defaultProjectsAddress = [SWAP_RBTC_PROXY_ADDRESS];

function getReceiveToken(mainToken: Token, sideTokens: Token[]) {
  const receiveTokens = sideTokens.filter(
    (token) => token.token == mainToken.token
  );
  if (receiveTokens.length == 0) {
    return {};
  }
  return receiveTokens[0];
}

function getTokensWithReceiveToken(mainTokens: Token[], sideTokens: Token[]) {
  const mainTokensSort = mainTokens.sort(
    (first, second) => first.typeId - second.typeId
  );
  return mainTokensSort.map((token) => ({
    ...token,
    receiveToken: getReceiveToken(token, sideTokens),
  }));
}

export function findNetworkByChainId(
  chainId: number,
  crossToNetworkId: number
) {
  const networks = getNetworksAvailable();
  return networks.find(
    (net) =>
      net.networkId === chainId &&
      net.crossToNetwork.networkId === crossToNetworkId
  );
}

type NetworkConf = {
  networkId: number;
  name: string;
  localStorageName: string;
  bridge: string;
  allowTokens: string;
  federation: string;
  explorer: string;
  explorerTokenTab: string;
  secondsPerBlock: number;
  rpc: string;
  v2UpdateBlock: number;
  feePercentageDivider: number;
  crossToNetwork: NetworkConf;
  tokenPrefix: string;
  env: string;
  mainToken: Token;
  gasToken: Token;
  isRsk: boolean;
  isSide: boolean;
  tokens: [Token];
  networks: [];
};

// TODO: set proper type
export function getNetworksConf(
  selectedChainId: number,
  prevChainId: number | null
): any {
  const networksAvailable = getNetworksAvailable();
  const networks = networksAvailable.filter(
    (net) => net.networkId === selectedChainId
  );
  if (!networks || networks.length === 0) {
    throw new Error(`Network ${selectedChainId} not found`);
  }

  if (networks.length !== 1) {
    if (prevChainId) {
      const networkConfig = getNetworksConf(prevChainId, null);
      return {
        ...networkConfig,
        networks,
      };
    }
    if (process.env.VUE_APP_ENV && defaultNetworks[process.env.VUE_APP_ENV]) {
      return {
        ...defaultNetworks[
          process.env.VUE_APP_ENV ? process.env.VUE_APP_ENV : 0
        ],
        networks,
      };
    }
    throw new Error(`VUE APP ENV not found`);
  }

  const [network] = networks;
  return {
    rskConfig: network.isRsk ? network : network.crossToNetwork,
    sideConfig: network.isSide ? network : network.crossToNetwork,
    networks,
  };
}

// TODO: set proper type
export function getEnvironmentNetworks(): Array<any> {
  return rskNetworks.filter(
    (network) => network.env === process.env.VUE_APP_ENV
  );
}

export function getNetworksAvailable(): NetworkConf[] {
  const networksOnEnvironment: NetworkConf[] = getEnvironmentNetworks();
  const sideNetworks: NetworkConf[] = networksOnEnvironment.map(
    (network) => network.crossToNetwork
  );
  return [...networksOnEnvironment, ...sideNetworks];
}

// TODO: set proper type
export function getNonDuplicateNetworks() {
  const networks = getNetworksAvailable();
  const reducedNetworks = networks.reduce((acc, network) => {
    if (!acc.has(network.networkId)) {
      acc.set(network.networkId, network);
    }
    return acc;
  }, new Map());
  return [...reducedNetworks.values()];
}
