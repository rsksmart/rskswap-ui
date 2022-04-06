import Vue from "vue";
import { StoreOptions, createStore } from "vuex";
import { RootState } from "./types";
import { web3Session } from "./session";

const store = createStore<RootState>({
  state: {
    version: "1.0.0",
  },
  modules: {
    web3Session,
  },
});

export default store;
