import { Module } from "vuex";
import { getters } from "./getters";
import { actions } from "./actions";
import { mutations } from "./mutations";
import { SessionState } from "./types";
import { RootState } from "../types";
import { defaultNetworks } from "@/constants/networks";

export const state: SessionState = {
  account: undefined,
  web3: undefined,
  enabled: false,
  rLogin: undefined,
  rLoginInstance: undefined,
  network: defaultNetworks[process.env.VUE_APP_ENV || "default"],
};

const namespaced = true;

export const session: Module<SessionState, RootState> = {
  namespaced,
  state,
  getters,
  actions,
  mutations,
};
