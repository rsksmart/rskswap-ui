<template>
  <div class="row justify-content-center">
    <section class="swap-box px-5">
      <header class="box-header"></header>

      <article class="box-body">
        <div class="w-100 d-flex flex-column">
          <span class="text-left ml-4">swap</span>
          <div class="currency-input">
            <div class="input-holder">
              <input placeholder="0.0" v-model="swapFrom.value" />
              <div
                class="w-60 d-flex flex-row align-items-center justify-content-end mr-3"
              >
                <span
                  class="input-note"
                  v-if="walletConnected && swapFrom.address"
                  @click="assignMaxValueToSwapValue"
                  @mouseover="toggleshowMaxTooltip"
                  @mouseleave="toggleshowMaxTooltip"
                >
                  <div v-if="showMaxTooltip" class="tooltip-balance">
                    <span> max: {{ this.swapFrom.balance }}</span>
                  </div>
                  max: {{ this.swapFrom.balance }}
                </span>
                <SelectTokenModal v-model="swapFrom" />
              </div>
            </div>
          </div>
        </div>
        <div>
          <button class="p-3 rounded btn-arrow">
            <i class="fa-solid fa-arrow-right-arrow-left fa-2xl"></i>
          </button>
        </div>
        <div class="w-100 d-flex flex-column">
          <span class="text-left ml-4">receive</span>
          <div class="currency-input">
            <div class="input-holder">
              <input placeholder="0.0" v-model="swapTo.value" />
              <div
                class="w-60 d-flex flex-row align-items-center justify-content-end mr-3"
              >
                <SelectTokenModal v-model="swapTo" />
              </div>
            </div>
          </div>
        </div>
      </article>
      <div class="mb-5">
        <div class="w-100">
          <div class="container-fluid box-button">
            <div class="row gx-4">
              <div class="col-md-6 col-sm-12 mb-3">
                <button
                  :class="paddingConnectedAddress"
                  :disabled="!walletConnected && swapFrom.address"
                >
                  <span :class="fontSizeConnectedAddress"
                    >connected address</span
                  >
                  <br />
                  <div v-if="walletConnected" class="text">
                    <span>{{ account }}</span>
                  </div>
                </button>
              </div>
              <div class="col-md-6 col-sm-12 mb-3">
                <div
                  id="diferentAddress"
                  class="rounded p-3"
                  :disabled="!walletConnected || !hasAllowance"
                  @click="onSubmit"
                >
                  <span v-if="!walletConnected"> different address </span>
                  <div
                    v-else
                    class="d-flex w-100 justify-content-center align-items-center"
                  >
                    <input
                      type="text"
                      class="input"
                      placeholder="paste address"
                      v-model="destinationAccount"
                    />
                    <div @click="pasteClipboard" class="clipboard-icon">
                      <i class="fa-regular fa-paste"></i>
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-md-6 col-sm-12 mb-3">
                <button
                  v-if="!hasAllowance"
                  class="btn btn-primary w-100 py-3 rounded"
                  :disabled="!walletConnected && swapFrom.address"
                  @click.prevent="onApprove"
                >
                  approve
                </button>
              </div>
              <div :class="[hasAllowance && walletConnected ? 'col-md-12 justify-content-center' : 'col-md-6 col-sm-12 mb-3']">
                <button
                  class="btn btn-primary py-3 rounded" :class="[hasAllowance ? 'w-50' : 'w-100']"
                  :disabled="!walletConnected || !hasAllowance"
                  @click="onSubmit"
                >
                  swap tokens
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import { createNamespacedHelpers } from "vuex";
import * as constants from "@/store/constants";

import Footer from "@/layouts/Footer.vue";
import SelectTokenModal from "@/components/shared/select-token/SelectTokenModal.vue";
import { getDefaultSwapFrom, getDefaultSwapTo, getTokenAllowance } from "@/utils/token-binding";

const { mapState, mapGetters, mapActions } = createNamespacedHelpers("session");

export default defineComponent({
  name: "SwapBox",
  components: {
    SelectTokenModal,
    Footer,
  },
  watch: {
    async account(value){
      if(value){
        this.swapFrom = await getDefaultSwapFrom(this.web3);
        this.swapTo = await getDefaultSwapTo(this.web3);    
      }
    },
    async swapFrom(model) {
      if (model) {
        this.hasAllowance = false;
        const allowance = await getTokenAllowance(this.web3, model, this.network.swapRbtcProxyAddress);
        this.hasAllowance = allowance > 0;
      }
      return 0;
    },
    async swapTo(model) {
      if (model) {
        this.swapTo.balance = this.web3.utils.fromWei(
          await this.web3.eth.getBalance(this.account)
        );
      }
      return 0;
    },
  },
  data() {
    return {
      swapFrom: {
        address: "",
        balance: 0,
        value: "",
      },
      swapTo: {
        address: "",
        balance: 0,
        value: "",
      },
      destinationAccount: "",
      hasAllowance: false,
      showMaxTooltip: false,
    };
  },
  computed: {
    ...mapState(["enabled"]),
    ...mapState(["account"]),
    ...mapState(["network"]),
    ...mapState(["web3"]),
    ...mapGetters(["allTokens"]),
    walletConnected() {
      return this.enabled;
    },
    paddingConnectedAddress() {
      return `btn btn-primary ${
        this.walletConnected ? "py-2" : "py-3"
      } rounded w-100`;
    },
    fontSizeConnectedAddress() {
      return this.walletConnected ? "12px" : "14px";
    },
  },
  methods: {
    ...mapActions([constants.WEB3_APPROVE_TOKEN]),

    getTokenByAddress(address) {
      return this.allTokens.find((token) => token.address === address);
    },
    async pasteClipboard() {
      this.destinationAccount = await navigator.clipboard.readText();
    },
    async onApprove() {
      // TODO: fetch alllowance on connect - different function though-
      if (!this.enabled) {
        console.error("web3 session not instantiated or connected!");
        return;
      }

      if (!this.swapFrom.address) {
        // TODO: add warning popup or disable approve button if no token selected?
        console.error("Selected token has no provided address!");
        return;
      }

      const tokenAddress = this.swapFrom.address;
      try {
        this.showSpinner = true;
        const receipt = await this.WEB3_APPROVE_TOKEN({
          tokenAddress,
          accountAddress: this.account,
          network: this.network,
        });
        console.info("approval receipt", receipt);

        // set allowance to true
        this.hasAllowance = true;
        this.showSpinner = false;
      } catch (err) {
        // set allowance to false
        this.showSpinner = false;
        this.hasAllowance = false;

        console.error("approval error: ", err);
      }
    },
    assignMaxValueToSwapValue() {
      this.swapFrom.value = this.swapFrom.balance;
    },

    toggleshowMaxTooltip() {
      this.showMaxTooltip = !this.showMaxTooltip;
    },
  },
});
</script>

<style lang="scss" scoped>
.swap-box {
  width: 100%;
  max-width: 560px;
  padding: 0rem 3rem;
  background-color: $darkBackground;
  border-radius: 24px;
  box-shadow: rgb(0 0 0 / 1%) 0px 0px 1px, rgb(0 0 0 / 4%) 0px 4px 8px,
    rgb(0 0 0 / 4%) 0px 16px 24px, rgb(0 0 0 / 1%) 0px 24px 32px;
  .box-header {
    display: flex;
    justify-content: space-between;
    padding: 8px 12px;
  }
  .box-title {
    font-size: 16px;
    margin: 0;
  }
}
.box-body {
  margin-bottom: 48px;
}
.currency-input {
  border-radius: 50px;
  padding: 0.5rem 1rem;
  border: 1px solid $darkBorderColor;
  background-color: $darkSecondaryBackground;
  &:hover {
    border-color: $darkBorderSecondaryColor;
  }
  .input-holder {
    display: flex;
    justify-content: space-between;
    position: relative;
    input {
      width: 40%;
      font-size: 0.9rem;
      &::placeholder {
        font-size: 0.9rem;
      }
    }
  }
  input {
    min-width: 50px;
    background: none;
    margin-left: 12px;
    border: none;
    font-size: 18px;
    color: #999;
    &:focus,
    &:active {
      outline: none;
    }
  }
  .input-note {
    font-size: 14px;
    cursor: pointer;
    width: 52%;
    text-align: right;
    font-weight: 400;
    color: $grayText;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
.w-45 {
  width: 45%;
}

.w-40 {
  width: 40%;
}

.w-60 {
  width: 60%;
}

.g-10 {
  gap: 10%;
}

.min-w-45 {
  min-width: 50%;
}
.box-button {
  padding: 0;
}

.text {
  font-size: 12px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.btn-arrow {
  background-color: $primary;
  border: none;
  color: $lightGray;
  margin-bottom: 1.5rem !important;
  margin-top: calc(1.5rem + 25px) !important;
}

#diferentAddress {
  background-color: $gray;
  color: white;
  font-size: 14px;
  .input {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    background-color: transparent;
    color: white;
    border: none;
    &::placeholder {
      color: white !important;
      font-size: 14px;
      text-transform: lowercase !important;
    }

    &:disabled {
      background-color: $lightGray;
    }
  }
  .clipboard-icon {
    cursor: pointer;
    width: 14px;
  }
}
.tooltip-balance {
  background-color: black;
  border-radius: 8px;
  font-weight: 500;
  padding-left: 0.7rem;
  padding-right: 0.7rem;
  max-height: 28px;
  text-align: center;
  position: absolute;
  bottom: 80%;
  left: 58%;
  z-index: 2000;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  transform: translate(-50%, -50%);

  &:before {
    content: "";
    display: block;
    width: 0;
    height: 0;
    position: absolute;

    border-left: 8px solid transparent;
    border-top: 8px solid black;
    border-right: 8px solid transparent;
    left: 50%;
    top: 26px;
  }
  span {
    white-space: nowrap;
  }
}
</style>
