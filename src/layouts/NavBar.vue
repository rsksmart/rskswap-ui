<template>
  <header>
    <!-- Navigation -->
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
      <v-img
        alt="Vue logo"
        src="@/assets/bridge-logo.png"
        width="233"
        height="188"
      />
      <div class="w-100">
        <div class="row w-100">
          <div class="col-4 offset-8 d-flex justify-content-end">
            <div
              v-if="isConnected"
              class="wallet-status navbar-item indicator badge-outline badge-pill"
            >
              <span aria-describedby="tooltip-status" class="fromNetwork">
                {{ chainName }}
              </span>
            </div>
            <div
              v-if="isConnected"
              class="wallet-status navbar-item badge-pill text-truncate"
              style="width: 155px"
            >
              <span id="address">{{ sharedState.web3Session.account }}</span>
            </div>
          </div>
          <div
            v-if="!isConnected"
            id="navbarResponsive"
            class="navbar-collapse collapse"
          >
            <div class="navbar-item ml-auto">
              <button
                id="logIn"
                type="button"
                class="btn btn-primary badge-pill"
                @click="connectWalletClick"
              >
                Connect wallet
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  </header>
</template>

<script>
import store from "@/store/index.ts";
import * as constants from "@/store/constants";

export default {
  name: "NavBar",
  data() {
    return {
      sharedState: store.state,
      sideNetworkConfig: null,
    };
  },
  computed: {
    sideConfig: {
      get: function () {
        return store.state.sideConfig;
      },
      set: function (value) {
        this.sideNetworkConfig = value;
      },
    },
    networks() {
      return this.sharedState.networksAvailable;
    },
    isConnected() {
      console.log("enabled", this.sharedState.web3Session?.enabled);
      return this.sharedState.web3Session?.enabled;
      // && !this.sharedState.preSettingsEnabled
    },
    chainName() {
      return this.sharedState.web3Session?.currentChain?.name;
    },
  },
  methods: {
    connectWalletClick() {
      // handle login
      return store.dispatch(`web3Session/${constants.SESSION_CONNECT_WEB3}`, 0);
    },
  },
};
</script>

<style scoped>
.fromNetwork {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
