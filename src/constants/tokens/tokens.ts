import { Token } from "@/types/token";
import ENVIRONMENTS from "../environments";

export const RBTC_TOKEN: Token = {
  token: "RBTC",
  name: "Rsk BTC",
  typeId: 0,
  decimals: 18,
  icon: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599/logo.png",
  symbol: "rBTC",
  type: "NATIVE",
  address: "0x",
};

export const RKOVWBTC_TOKEN: Token = {
  token: "WBTC",
  name: "Wrapped BTC",
  typeId: 0,
  decimals: 18,
  icon: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599/logo.png",
  symbol: "rKovWBTC",
  address: "0xa7260287Ab1845CA27A921AaE0048090AADB5F75", // anyswap wbtc deployed token on testnet
  type: "ERC20",
};

export const WBTC_TOKEN: Token = {
  token: "WBTC",
  name: "Wrapped BTC",
  typeId: 0,
  decimals: 18,
  icon: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599/logo.png",
  symbol: "rWBTC",
  address: "0x80a16016cc4a2e6a2caca8a4a498b1699ff0f844", // anyswap wbtc deployed token on testnet
  type: "ERC20",
};

const getAllTokens = () => {
  switch (process.env.VUE_APP_ENV) {
    case ENVIRONMENTS.MAINNET:
      return [RBTC_TOKEN, WBTC_TOKEN];
    default: // TESTNET
      return [RBTC_TOKEN, RKOVWBTC_TOKEN];
  }
};

export const ALL_TOKENS: Token[] = getAllTokens();
