<template>
  <transition appear name="fade">
    <div
      v-if="show"
      aria-live="polite"
      aria-atomic="true"
      style="min-height: 200px"
      class="toast-container position-fixed justify-content-center align-items-center col-md-4 notification"
    >
      <div
        class="bg-danger box-header"
        tarnclass="toast"
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
      >
        <div class="toast-header">
          <strong class="ml-0">
            <i class="fa fa-exclamation-triangle" aria-hidden="true"></i>
            {{ error.message }} [code: {{ error.code }}]
          </strong>
          <button
            type="button"
            class="mr-2 mb-1 ml-auto close"
            data-dismiss="toast"
            aria-label="Close"
            @click="close()"
          >
            <span aria-hidden="true">&times;</span>
        </button>
        </div>
        <div class="toast-body">{{ error.data }}</div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: "ErrorNotification",
  props: {
    error: {
      type: Object,
      required: true,
    },
    delay: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      show: false,
      timeout: 0,
    };
  },
  watch: {
    error() {
      this.show = true;
      clearTimeout(this.timeout);
      const displayTime = this.delay;
      this.timeout = setTimeout(() => {
        this.show = false;
      }, displayTime);
    },
  },
  methods: {
    close() {
      this.show = false;
    },
  },
};
</script>

<style scoped>

.notification {
  position: fixed;
  top: 1vh;
  width: 50vw;
  left: 33.3vw;
}

.box-header {
  border-radius: 0.4rem;
}

.fade-enter-active,
.fade-leave-active {
  transition: top 3s ease;
}
.fade-enter,
.fade-leave-to {
  top: -2000px;
}
</style>
