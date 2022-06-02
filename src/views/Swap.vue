<template>
  <section class="container main-div">
    <SwapBox />
    <WaitSpinner :show="showSpinner" :wait-seconds="defaultTime" />
  </section>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import SwapBox from "@/components/swap/SwapBox.vue";
import { createNamespacedHelpers } from "vuex";
import WaitSpinner from "../components/shared/WaitSpinner.vue";
import { SessionState } from "@/store/session/types";

const { mapState } = createNamespacedHelpers("session");

export default defineComponent({
  name: "Swap",
  components: {
    SwapBox,
    WaitSpinner,
  },
  data() {
    return {
      defaultTime: 30,
    };
  },
  computed: {
    ...mapState({
      showSpinner: (state) => (state as SessionState).showSpinner,
    }),
  },
});
</script>
