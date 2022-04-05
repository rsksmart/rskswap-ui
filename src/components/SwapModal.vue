<template>
  <div class="swap-modal-title">
    <h4>swap modal to cross tokens</h4>
  </div>
  <div class="modal-body">
    <div class="network-row">
      <h3>{{ currentNetwork }} Network</h3>
    </div>
    <div>
      <h3>Swap {{ selectedToken }}</h3>
      <RangeInput v-model:value="percentage" step="1" :disabled="false" />
    </div>
  </div>
  <div v-if="isOrigin"></div>
</template>

<script>
import RangeInput from "@/components/RangeInput.vue";
export default {
  name: "SwapModal",
  components: {
    RangeInput,
  },
  props: {
    amount: {
      type: Number,
      required: true,
    },
    address: {
      type: String,
      required: false,
      validator(val) {
        return true;
      },
    },
    maxAmount: {
      type: [Number, String],
      default: "",
    },
    token: {
      type: Object,
      default: () => ({}),
    },
  },
  emits: [],
  data() {
    return {
      // sharedState: store.state,
      percentage: 0,
    };
  },
  // computed() {},
  watch: {
    percentage(val) {
      console.log("percentage changed!");
      console.error("need to implement!");
    },
  },
  methods: {},
};
</script>
