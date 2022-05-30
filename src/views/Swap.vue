<template>
  <section class="container main-div">
    <SwapBox />
    <WaitSpinner :show="showSpinner" :wait-seconds="defaultTime" />
    <ErrorMsg :error="error" />
  </section>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import SwapBox from "@/components/swap/SwapBox.vue";
import { createNamespacedHelpers } from "vuex";
import WaitSpinner from "../components/shared/WaitSpinner.vue";
import ErrorMsg from "../components/shared/ErrorMsg.vue";
import { SessionState } from "@/store/session/types";
import { MessageError } from "@/types/error";

const { mapState } = createNamespacedHelpers("session");

export default defineComponent({
  name: "Swap",
  components: {
    SwapBox,
    WaitSpinner,
    ErrorMsg,
  },
  data() {
    return {
      error: "",
      defaultTime: 30,
    };
  },
  computed: {
    ...mapState({
      showSpinner: (state) => (state as SessionState).showSpinner,
    }),
  },
  errorCaptured(err) {
    if (err instanceof MessageError) {
      this.error = err.message;
      return false;
    }
  },
});
</script>
