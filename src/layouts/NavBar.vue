<template>
  <header>
    <!-- Navigation -->
    <nav class="navbar navbar-dark bg-dark">
      <div>
        <v-img alt="RSK" src="@/assets/swap-logo.png" width="90" height="90" />
      </div>
      <div>
        <div v-if="isConnected" class="menuItem badge-outline badge-pill">
          <span aria-describedby="tooltip-status" class="fromNetwork">
            {{ chainName }}
          </span>
        </div>
        <div
          v-if="isConnected"
          class="menuItem badge-pill text-truncate"
          style="width: 155px;"
        >
          <span id="address">{{ this.account }}</span>
        </div>
      </div>
      <div v-if="!isConnected" class="menuItem">
        <div class="menuItem ml-auto">
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
    </nav>
  </header>
</template>

<script>
import * as constants from '@/store/constants'
import { createNamespacedHelpers } from 'vuex'

const { mapState, mapGetters, mapActions } = createNamespacedHelpers('session')

export default {
  name: 'NavBar',
  data() {
    return {
      sideNetworkConfig: null,
    }
  },
  computed: {
    ...mapState(['enabled']),
    ...mapState(['account']),
    ...mapState(['currentChain']),
    isConnected() {
      console.log('enabled', this.enabled)
      return this.enabled
    },
    chainName() {
      return this.currentChain?.name
    },
  },
  methods: {
    ...mapActions([constants.SESSION_CONNECT_WEB3]),
    connectWalletClick() {
      // handle login
      return this.SESSION_CONNECT_WEB3()
    },
  },
}
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
}
</style>
