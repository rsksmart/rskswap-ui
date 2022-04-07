<template>
  <section class="container main-div">
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
