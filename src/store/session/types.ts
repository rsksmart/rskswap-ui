import RLogin from "@rsksmart/rlogin";
import Web3 from "web3";

export type ChainConfig = {
  id: number;
  name: string;
};

export type NetworkConfig = {
  networkId: number;
  name: string;
  localStorageName: string;
  bridge: string;
  swapRbtcProxyAddress?: string;
  allowTokens: string;
  federation: string;
  explorerAddress: string;
  explorerTokenTab: string;
  secondsPerBlock: number;
  rpc: string;
  v2UpdateBlock: number;
  feePercentageDivider: number;
  tokenPrefix: string;
  env: string;
  isRsk: boolean;
};

export interface SessionState {
  enabled: boolean;
  account?: string;
  web3?: Web3;
  rLogin?: {
    disconnect: () => Promise<void>;
  };
  rLoginInstance?: RLogin;
  currentChain?: ChainConfig;
  network: NetworkConfig;
}
