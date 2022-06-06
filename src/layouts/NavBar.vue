<template>
  <header>
    <!-- Navigation -->
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
      <nav class="menu-bar">
        <div class="group">
          <v-img
            alt="Vue logo"
            src="@/assets/swap-logo.png"
            width="90"
            height="90"
          />
        </div>
        <div class="group">
          <div
            v-if="isConnected"
            class="menuItem navbar-item indicator badge-outline badge-pill">
            <span aria-describedby="tooltip-status" class="fromNetwork">
              {{ chainName }}
            </span>
          </div>
          <div
            v-if="isConnected"
            class="menuItem navbar-item badge-pill text-truncate"
            style="width: 155px">
            <span id="address">{{ this.account }}</span>
          </div>
          <div
            v-if="!isConnected"
            id="navbarResponsive"
            class="menuItem navbar-collapse collapse">
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
      </nav>
      <!-- <div class="navRow">
        <div class="col">
          <v-img
            alt="Vue logo"
            src="@/assets/swap-logo.png"
            width="90"
            height="90"
          />
        </div>
        <div>
          <div
            v-if="isConnected"
            class="navbar-item indicator badge-outline badge-pill">
            <span aria-describedby="tooltip-status" class="fromNetwork">
              {{ chainName }}
            </span>
          </div>
          <div
            v-if="isConnected"
            class="navbar-item badge-pill text-truncate"
            style="width: 155px">
            <span id="address">{{ this.account }}</span>
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
      </div> -->
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
  .menu-bar {
    display: flex !important;
    flex-shrink: 0;
    flex-grow: 1 !important;
    justify-content: space-between !important;
    box-sizing: border-box;
  }

  .menuItem {
    background-color: transparent;
    font-size: 18px;
    box-sizing: border-box;
    padding: 14px 20px;
  }

  .menuItem.title {
    font-weight: 600;
  }

  .item:hover {
    background-color: rgba(0, 0, 0, 0.1);
  }
</style>
