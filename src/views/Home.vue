<template>
  <div class="home">
    <img
      alt="Vue logo"
      src="../assets/bridge-logo.png"
      width="233"
      height="188"
    />
    <h1>RSK Swap</h1>
    <SwapTokens />
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import HelloWorld from "@/components/HelloWorld.vue"; // @ is an alias to /src
import SwapTokens from "@/components/SwapTokens.vue"; // @ is an alias to /src

@Options({
  components: {
    HelloWorld,
    SwapTokens,
  },
})
export default class Home extends Vue {}
</script>
