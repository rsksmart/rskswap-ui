<template>
  <h3>Swap Tokens</h3>
  <div class="row">
    <div class="offset-2 col-8">
      <!--      transfermodal-->
      <TransferCard title="Swap" />
      <div class="row justify-content-center mt-4">
        <button
          v-if="!hasAllowance"
          id="approve"
          class="btn btn-primary mr-3"
          :disabled="disabledActionButtons"
          @click="approveClick"
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
      error: "",
    };
  },
  computed: {},
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
    approve() {
      // todo: this might not be needed
      console.error("not implemented!");
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
