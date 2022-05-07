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
  // address: "0xB8ae2CB769255359190Fbce89D3ad38687DA5E65", // wbtc token
  address: "0xe8937adC8Fab7346f9D18583C67C6a980eCe6aeD", // anyswap wbtc deployed token on testnet
  type: "ERC20",
};

export const WBTC_TOKEN: Token = {
  token: "WBTC",
  name: "Wrapped BTC",
  typeId: 0,
  decimals: 18,
  icon: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599/logo.png",
  symbol: "rWBTC",
  // address: "0xB8ae2CB769255359190Fbce89D3ad38687DA5E65", // TODO: replace with the mainnet address of the WBTC token
  address: "0xe8937adC8Fab7346f9D18583C67C6a980eCe6aeD", // anyswap wbtc deployed token on testnet
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
