<template>
  <div id="main">
    <NavBar />
    <router-view />
    <Footer />
    <Notification :message="message" :type="message.type" :delay="5000" />
  </div>
</template>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
<script>
import NavBar from "@/layouts/NavBar";
import Footer from "@/layouts/Footer";
import Notification from "@/components/shared/Notification.vue";
import { createNamespacedHelpers } from "vuex";

const { mapState } = createNamespacedHelpers("session");

export default {
  components: { NavBar, Footer, Notification },
  computed: {
    ...mapState({
      message: (state) => state.message,
    }),
  },
};
</script>
