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
        :class="[`bg-${type}`, 'box-header']"
        tarnclass="toast"
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
      >
        <div class="toast-header">
          <strong class="ml-0" v-if="type === 'success'">
            <i class="fa fa-check" aria-hidden="true"></i>
            Success
          </strong>
          <strong class="ml-0" v-else>
            <i class="fa fa-exclamation-triangle" aria-hidden="true"></i>
            {{ message.message }}
            {{ message.code ? `[code: ${message.code}]` : "" }}
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
        <div v-if="isHtmlData" v-html="message.data"></div>
        <div class="toast-body" v-else>
          {{ message.data }}
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: "ErrorNotification",
  props: {
    message: {
      type: Object,
      required: false,
    },
    type: {
      type: String,
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
    message() {
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
  computed: {
    isHtmlData() {
      return this.message.data.includes("</");
    },
  },
};
</script>

<style lang="scss" scoped>
.notification {
  position: fixed;
  top: 1vh;
  width: 50vw;
  left: 33.3vw;
}

.bg-success {
  background-color: $success !important;
}

.bg-info {
  background-color: $primaryLight !important;
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
