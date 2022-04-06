import RLogin from "@rsksmart/rlogin";
import Web3 from "web3";

export interface SessionState {
  enabled: boolean;
  account?: string;
  web3?: Web3;
  rLogin?: {
    disconnect: () => Promise<void>;
  };
  rLoginInstance?: RLogin;
}
