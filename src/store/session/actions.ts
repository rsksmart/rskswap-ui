import Vue from "vue";
import Web3 from "web3";
import { ActionTree } from "vuex";
import RLogin from "@rsksmart/rlogin";
import WalletConnectProvider from "@walletconnect/web3-provider";
import * as constants from "@/store/constants";
import { SessionState } from "./types";
import { RootState } from "../types";

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
        // todo: check if we really need to make this available globally
        // Vue.prototype.$web3 = web3;
        commit(constants.SESSION_IS_ENABLED, true);
        commit(constants.SESSION_SET_RLOGIN, rLoginResponse);
        commit(constants.SESSION_SET_RLOGIN_INSTANCE, rLogin);
        commit(constants.SESSION_SET_WEB3_INSTANCE, web3);
        // return Vue.prototype.$web3.eth.getAccounts();
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
    // const accounts = await Vue.prototype.$web3.eth.getAccounts();
    // todo: check if we can access it from state
    const accounts = await state?.web3?.eth?.getAccounts();
    commit(constants.SESSION_SET_ACCOUNT, accounts ? accounts[0] : null);
  },
  [constants.WEB3_SESSION_CLEAR_ACCOUNT]: async ({ commit }) => {
    commit(constants.SESSION_SET_ACCOUNT, undefined);
    commit(constants.SESSION_CLOSE_RLOGIN);
    commit(constants.SESSION_SET_RLOGIN, undefined);
  },
};