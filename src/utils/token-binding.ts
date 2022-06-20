import { ALL_TOKENS } from "@/constants/tokens/tokens";
import ERC20_ABI from "@/constants/abis/erc20.json";
import BigNumber from "bignumber.js";
import { Token } from "@/types/token";

export const getDefaultSwapFrom = async (web3: any, accountAddress: string) => {
  return getSwapData(web3, accountAddress, "WBTC");
};

export const getDefaultSwapTo = async (web3: any, accountAddress: string) => {
  return getSwapData(web3, accountAddress, "RBTC");
};

export const getSwapData = async (
  web3: any,
  account: string,
  tokenName: string
) => {
  const token = findTokenByName(tokenName);
  if (!token) throw Error("Token not found"); // TODO: Display a message to the user.
  let balance;

  if (token.type === "NATIVE") {
    balance = new BigNumber(await web3.eth.getBalance(account)).shiftedBy(
      -token.decimals
    );
  } else {
    const tokenInst = new web3.eth.Contract(ERC20_ABI, token.address);
    balance = new BigNumber(
      await tokenInst.methods.balanceOf(account).call()
    ).shiftedBy(-token.decimals);
  }

  return {
    address: token?.address || "",
    balance: balance,
    value: null,
    decimals: token?.decimals,
  };
};

export const getTokenAllowance = async (
  web3: any,
  token: Token,
  spenderAddress: string
) => {
  if (token.type === "NATIVE") {
    return await web3.eth.getBalance(web3.currentProvider.selectedAddress);
  }

  const tokenInst = new web3.eth.Contract(ERC20_ABI, token.address);
  return await tokenInst.methods
    .allowance(web3.currentProvider.selectedAddress, spenderAddress)
    .call();
};

export const getTokenByAddress = (address: string) => {
  return ALL_TOKENS.find((token) => token.address === address);
};

export const findTokenByName = (value: string) => {
  return ALL_TOKENS.find((token) => token.token === value);
};
