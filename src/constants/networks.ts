import { NetworkConfig } from "@/store/session/types";


export const RSK_CONFIG: NetworkConfig = {
  networkId: parseInt(process.env.VUE_APP_CHAIN_ID || "31"),
  name: process.env.VUE_APP_NETWORK_NAME || "RSK Testnet",
  localStorageName: process.env.VUE_APP_LOCALSTORAGE_NAME || "rsk-testnet",
  relayerAddress: process.env.VUE_APP_RELAYER_ADDRESS || "",
  swapRbtcProxyAddress: process.env.VUE_APP_SWAP_ADDRESS || "",
  explorerAddress: process.env.VUE_APP_EXPLORER_ADDRESS || "",
  explorerTokenTab: process.env.VUE_APP_EXPLORER_TOKEN_TAB || "",
  secondsPerBlock: parseInt(process.env.VUE_APP_SECONDS_PER_BLOCK || "30"),
  relayerApiEndpoint: process.env.VUE_APP_RELAYER_ENDPOINT || "",
  rpc: process.env.VUE_APP_RPC || "",
  feePercentageDivider: 10000,
  tokenPrefix: "r",
  env: process.env.VUE_APP_ENV || "testnet",
};