import { MutationTree } from "vuex";
import Web3 from "web3";
import * as constants from "@/store/constants";
import { SessionState } from "./types";
import { CHAINS_MAP } from "@/constants/chainIds";

export const mutations: MutationTree<SessionState> = {
  [constants.SESSION_SET_ACCOUNT]: (state, account: string) => {
    state.account = account;
  },
  [constants.SESSION_SET_WEB3_INSTANCE]: (state, web3Instance: Web3) => {
    state.web3 = web3Instance;
  },
  [constants.SESSION_IS_ENABLED]: (state, flag: boolean) => {
    state.enabled = flag;
  },
  [constants.SESSION_SET_RLOGIN]: (state, rLogin) => {
    state.rLogin = rLogin;
  },
  [constants.SESSION_SET_RLOGIN_INSTANCE]: (state, rLoginInstance) => {
    state.rLoginInstance = rLoginInstance;
  },
  [constants.SESSION_CLOSE_RLOGIN]: async (state) => {
    await state.rLogin?.disconnect();
  },
  [constants.SESSION_SET_SPINNER]: (state, showSpinner) => {
    state.showSpinner = showSpinner;
  },
  [constants.SESSION_SET_CURRENT_CHAIN]: (state, chainId: number) => {
    state.currentChain = {
      id: chainId,
      name: CHAINS_MAP[chainId],
    };
  },
};
