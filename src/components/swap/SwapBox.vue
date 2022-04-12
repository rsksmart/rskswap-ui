<template>
  <div class="row justify-content-center">
    <section class="swap-box">
      <header class="box-header">
        <h3 class="box-title">Swap</h3>
      </header>

      <article class="box-body">
        <div class="currency-input">
          <div class="input-holder">
            <SelectTokenModal v-model="swapFrom.address" />
            <input placeholder="0.0" v-model="swapFrom.value" />
          </div>
          <p class="input-note" v-if="walletConnected && swapFrom.address">
            Balance: 0 {{ getTokenByAddress(swapFrom.address).symbol }}
          </p>
        </div>
        <div class="currency-input">
          <div class="input-holder">
            <SelectTokenModal v-model="swapTo.address" />
            <input placeholder="0.0" v-model="swapTo.value" />
          </div>
          <p class="input-note" v-if="walletConnected && swapTo.address">
            Balance: 0 {{ getTokenByAddress(swapTo.address).symbol }}
          </p>
        </div>
      </article>
    <div class="row justify-content-center mt-4">
      <button
        v-if="!hasAllowance"
        id="approve"
        class="btn btn-primary mr-3"
        :disabled="disabledActionButtons"
        @click="onApprove"
      >
        Approve
      </button>
      <button
        id="deposit"
        class="btn btn-primary"
        :disabled="disabledActionButtons || !hasAllowance"
        @click="onSubmit"
      >
        Cross tokens
      </button>
    </div>        
    </section>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import Button from "@/components/core/Button.vue";
import SelectTokenModal from "@/components/shared/select-token/SelectTokenModal.vue";
import store from "@/store/index.ts";

// TODO: MOVE to a "hook" like approach
// import { createNamespacedHelpers } from "vuex";

// const { mapState, mapGetters, mapActions } = createNamespacedHelpers(
//   "WalletModule"
// );

export default defineComponent({
  name: "SwapBox",
  components: {
    Button,
    SelectTokenModal,
  },
  data() {
    return {
      sharedState: store.state,

      swapFrom: {
        address: "",
        value: "",
      },
      swapTo: {
        address: "",
        value: "",
      },
    };
  },
  computed: {
    connectedAddress() {
      return this.sharedState.web3Session.account;
    },
    //...mapState(["accountAddress"]),
    allTokens() { return ALL_TOKENS }, // TODO: Tokens should come from a non hardcoded list (eg. from the allowed tokens in swap contract)
    walletConnected() {
      return this.sharedState.web3Session?.enabled;
    },
  },
  methods: {
    getTokenByAddress(address) {
      return this.allTokens.find((token) => token.address === address);
    },
  },
});
</script>

<style lang="scss" scoped>
.swap-box {
  width: 100%;
  max-width: 480px;
  padding: 8px;
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
  margin-bottom: 8px;
}
.currency-input {
  border-radius: 20px;
  border: 1px solid $darkBorderColor;
  background-color: $darkSecondaryBackground;
  padding: 16px;
  margin-bottom: 4px;
  &:hover {
    border-color: $darkBorderSecondaryColor;
  }
  .input-holder {
    display: flex;
    justify-content: space-between;
  }
  input {
    min-width: 50px;
    background: none;
    border: none;
    font-size: 24px;
    text-align: right;
    color: #fff;
    &:focus,
    &:active {
      outline: none;
    }
  }
  .input-note {
    font-size: 14px;
    font-weight: 400;
    color: $grayText;
    margin: 12px 0 0;
  }
}
</style>
