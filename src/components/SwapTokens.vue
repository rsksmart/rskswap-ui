<template>
  <h3>Swap Tokens</h3>
  <div class="row justify-content-center">
    <div class="col-6">
      <!--      transfermodal-->
      <TransferCard
        v-model:sourceAmount="sourceAmount"
        v-model:destinationAmount="destinationAmount"
        title="Swap"
      />
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
    </div>
  </div>
</template>

<script>
import BigNumber from "bignumber.js";

import { createNamespacedHelpers } from "vuex";

const { mapState } = createNamespacedHelpers("session");

import TransferCard from "@/components/TransferCard.vue";
export default {
  name: "SwapTokens",
  components: {
    TransferCard,
  },
  inject: [],
  props: {},
  emits: [""],
  data() {
    return {
      sourceAmount: new BigNumber(0),
      destinationAmount: new BigNumber(0),
      error: "",
    };
  },
  computed: {
    ...mapState(["enabled"]),
    ...mapState(["account"]),
    disabledActionButtons() {
      return (
        // todo: check other cases to disable it
        !this.enabled ||
        this.showSpinner ||
        this.sourceAmount < 0 ||
        this.destinationAmount < 0
      );
    },
  },
  watch: {},
  methods: {
    async handleChangeNetwork() {
      console.error("not implemented!");
    },
    accountConnected() {
      console.error("not implemented!");
    },
    switchSwapTokens() {
      console.error("not implemented!");
    },
    async onApprove(event) {
      // TODO: fetch alllowance on connect - different function though-
      event.preventDefault();

      // get web3
      if (!this.enabled) {
        console.error("web3 session not instantiated or connected!");
        return;
      }

      // todo: get token address from TransferCard component
      const tokenAddress = "test";
      try {
        this.showSpinner = true;
        const receipt = await this.erc20TokenInstance.approve(tokenAddress, {
          from: this.account,
          gas: 70_000,
        });
        console.info("approval receipt", receipt);

        // set alloance to true
        this.showSpinner = false;
      } catch (err) {
        // set alloance to true
        this.showSpinner = false;

        console.error("approval error: ", err);
        this.error = `Couldn't approve. ${err?.message}`;
      }
    },
    submit() {
      console.error("not implemented!");
    },
    validateSwapInfo() {
      console.error("not implemented!");
    },
    validateAddress(value) {
      if (!value) return "destination address is required";
      if (!/^(0x)?[0-9a-f]{40}$/i.test(value)) {
        return "invalid address";
      }
      return true;
    },
    validateAmount(value) {
      console.error("not implemented!");
    },
  },
};
</script>
