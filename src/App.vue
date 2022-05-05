<template>
  <div id="main">
    <NavBar />
    <router-view />
    <Footer />
    <Notification :error="error" />
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
import { ApiError, UserNotificationError } from "@/types/error";

export default {
  components: { NavBar, Footer, Notification },
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  data() {
    return {
      error: {},
    };
  },
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  errorCaptured(err) {
    // all user notification errors are handled here
    if (err instanceof UserNotificationError || err instanceof ApiError) {
      this.error = {
        message: err.message,
        data: err.errorData,
        code: err.errorCode,
      };
    }
    return false;
  },
};
</script>
