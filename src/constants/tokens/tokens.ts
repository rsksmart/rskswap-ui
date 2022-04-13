import { Token } from "@/types/token";

export const RBTC_TOKEN: Token = {
  token: "RBTC",
  name: "Rsk BTC",
  typeId: 0,
  decimals: 18,
  icon: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599/logo.png",
  symbol: "rBTC",
  address: "0x48288D0e3079A03f6EC1846554CFc58C2696Aaee",
  type: "NATIVE",
};

export const RKOVWBTC_TOKEN: Token = {
  token: "WBTC",
  name: "Wrapped BTC",
  typeId: 0,
  decimals: 18,
  icon: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599/logo.png",
  symbol: "rKovWBTC",
  address: "0xB8ae2CB769255359190Fbce89D3ad38687DA5E65",
  type: "ERC20",
};

export const ALL_TOKENS: Token[] = [RBTC_TOKEN, RKOVWBTC_TOKEN];
