<template>
  <h3>Swap Tokens</h3>
  <div class="row">
    <div class="col-5">
      <!--      transfermodal-->
      <SwapModal />
    </div>
    <div class="col-2">
      <button class="btn btn-link swap-btn">
        <i class="fas fa-exchange-alt" />
      </button>
      <!--      arrows buttons-->
    </div>
    <div class="col-5">
      <!--      transfermodal-->
      <SwapModal />
    </div>
  </div>
</template>

<script>
import SwapModal from "@/components/SwapModal.vue";
export default {
  name: "SwapTokens",
  components: {
    SwapModal,
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

<style scoped>
.swap-btn {
  font-size: 5em;
  color: var(--primary);
}
.swap-btn:hover {
  color: var(--primary);
}
</style>
