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
              <span id="address">{{ this.account }}</span>
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
import * as constants from "@/store/constants";
import { createNamespacedHelpers } from "vuex";

const { mapState, mapGetters, mapActions } = createNamespacedHelpers("session");

export default {
  name: "NavBar",
  data() {
    return {
      sideNetworkConfig: null,
    };
  },
  computed: {
    ...mapState(["enabled"]),
    ...mapState(["account"]),
    ...mapState(["currentChain"]),
    isConnected() {
      console.log("enabled", this.enabled);
      return this.enabled;
    },
    chainName() {
      return this.currentChain?.name;
    },
  },
  methods: {
    ...mapActions([constants.SESSION_CONNECT_WEB3]),
    connectWalletClick() {
      // handle login
      return this.SESSION_CONNECT_WEB3();
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
