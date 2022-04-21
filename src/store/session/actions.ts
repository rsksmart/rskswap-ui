import Vue from "vue";
import Web3 from "web3";
import { ActionTree } from "vuex";
import RLogin from "@rsksmart/rlogin";
import WalletConnectProvider from "@walletconnect/web3-provider";
import * as constants from "@/store/constants";
import { SessionState } from "./types";
import { RootState } from "../types";
import { convertToNumber } from "@/utils/address-helpers";
import ERC20_ABI from "@/constants/abis/erc20.json";
import { MAX_UINT256 } from "@/utils";
import { gasPriceHex, transactionCallback } from "@/utils/transactions";

export const actions: ActionTree<SessionState, RootState> = {
  [constants.SESSION_CONNECT_WEB3]: async ({ commit, state }) => {
    const rLogin =
      state.rLoginInstance === undefined
        ? new RLogin({
            cacheProvider: false,
            providerOptions: {
              walletconnect: {
                package: WalletConnectProvider,
                options: {
                  rpc: {
                    30: "https://public-node.rsk.co",
                    31: "https://public-node.testnet.rsk.co",
                  },
                },
              },
            },
            supportedChains: [30, 31],
          })
        : state.rLoginInstance;
    rLogin
      .connect()
      .then((rLoginResponse) => {
        const web3 = new Web3(rLoginResponse.provider);

        const chainId = convertToNumber(rLoginResponse.provider?.chainId);

        commit(constants.SESSION_IS_ENABLED, true);
        commit(constants.SESSION_SET_RLOGIN, rLoginResponse);
        commit(constants.SESSION_SET_RLOGIN_INSTANCE, rLogin);
        commit(constants.SESSION_SET_WEB3_INSTANCE, web3);
        commit(constants.SESSION_SET_CURRENT_CHAIN, chainId);
        return web3.eth.getAccounts();
      })
      .then((accounts) => {
        commit(constants.SESSION_SET_ACCOUNT, accounts[0]);
      })
      .catch(() => {
        commit(constants.SESSION_IS_ENABLED, false);
        commit(constants.SESSION_SET_RLOGIN_INSTANCE, rLogin);
      });
  },
  [constants.WEB3_SESSION_GET_ACCOUNT]: async ({ commit, state }) => {
    const accounts = await state?.web3?.eth?.getAccounts();
    commit(constants.SESSION_SET_ACCOUNT, accounts ? accounts[0] : null);
  },
  [constants.WEB3_SESSION_CLEAR_ACCOUNT]: async ({ commit }) => {
    commit(constants.SESSION_SET_ACCOUNT, undefined);
    commit(constants.SESSION_CLOSE_RLOGIN);
    commit(constants.SESSION_SET_RLOGIN, undefined);
  },

  [constants.WEB3_APPROVE_TOKEN]: async (
    { commit, state },
    { tokenAddress, accountAddress, network }
  ) => {
    //get gas price - optionall

    const CONTRACT_CLASS = state?.web3?.eth.Contract;
    // init token contract
    if (!CONTRACT_CLASS || !state?.web3) {
      console.error("web3 was not instantiated...");
      return;
    }

    // todo: remove this eslint warning
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const tokenContract = new CONTRACT_CLASS(ERC20_ABI, tokenAddress);

    if (!tokenContract) {
      console.error("token contract couldnt be resolved");
      return;
    }

    const gasPrice = await gasPriceHex(state.web3);

    return new Promise((resolve, reject) => {
      tokenContract.methods
        .approve(network.swapRbtcProxyAddress, MAX_UINT256)
        .send(
          {
            from: accountAddress,
            gasPrice,
          },
          transactionCallback({
            resolve,
            reject,
            web3: state.web3,
            explorer: network.explorerAddress,
          })
        );
    });
  },
};
