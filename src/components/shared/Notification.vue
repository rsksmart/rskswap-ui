<template>
  <transition appear name="fade">
    <div v-if="show" class="notification">
      <div class="title">{{ error.message }} [code: {{ error.code }}]</div>
      <div>
        <p>{{ error.data }}</p>
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
      this.timeout = setTimeout(() => {
        this.show = false;
      }, 3000);
    },
  },
};
</script>

<style scoped>
/* TODO: Adjust styles */

.notification {
  position: fixed;
  left: 25vw;
  top: 1vh;
  background-color: rgba(255, 0, 0, 70%);
  padding: 1rem;
  width: 50vw;
  border-radius: 0.4rem;
  box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
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
