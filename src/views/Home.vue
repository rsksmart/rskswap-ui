<template>
  <section class="container main-div">
    <v-img
      alt="Vue logo"
      src="@/assets/bridge-logo.png"
      width="233"
      height="188"
    />
    <h1>RSK Swap</h1>
    <SwapTokens />
  </section>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import SwapTokens from "@/components/SwapTokens.vue"; // @ is an alias to /src

@Options({
  components: {
    SwapTokens,
  },
})
export default class Home extends Vue {}
</script>
