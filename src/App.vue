<template>
  <div id="main">
    <NavBar />
    <router-view />
    <Footer />
    <Notification :error="error" :delay="5000" />
  </div>
</template>

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
