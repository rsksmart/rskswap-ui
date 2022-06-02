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
  relayerAddress: string;
  swapRbtcProxyAddress: string;
  explorerAddress: string;
  explorerTokenTab: string;
  secondsPerBlock: number;
  relayerApiEndpoint: string;
  rpc: string;
  feePercentageDivider: number;
  tokenPrefix: string;
  env: string;
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
  showSpinner: boolean;
  message?: Message;
}

export interface Message {
  message?: string;
  data?: string;
  code?: string;
  type?: "danger" | "success";
}
