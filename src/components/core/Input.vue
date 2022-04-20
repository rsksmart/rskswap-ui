<template>
  <div
    class="w-100 d-flex justify-content-between align-items-center rounded default-border"
  >
    <input
      type="text"
      :class="`app-input size-${size}`"
      v-bind="$attrs"
      :value="modelValue"
      @input="inputHandler"
    />
    <div class="icon mr-4">
      <i :class="fontAwesomeIcon"></i>
    </div>
  </div>
</template>

<script>
export default {
  name: "Input",
  props: {
    modelValue: {
      type: String,
    },
    fontAwesomeIcon: {
      type: String,
      require: true,
    },
    size: {
      type: String,
      default: "medium",
      validator(value) {
        return ["medium", "large"].includes(value);
      },
    },
  },
  methods: {
    inputHandler(e) {
      this.$emit("update:modelValue", e.target.value);
    },
    getImgUrl(pic) {
      if (pic.indexOf("http") > -1) {
        return pic;
      }
      if (!pic.includes("assets")) {
        return require(`../../assets/images/icons/${pic}`);
      }
      require(`${pic}`);
    },
  },
};
</script>

<style lang="scss" scoped>
.default-border {
  border: 1px solid $darkBorderSecondaryColor;
}
.app-input {
  background: none;
  font-size: 0.75rem;
  padding: 5px 12px;
  border: none;
  // border-radius: 20px;
  // background-color: $darkSecondaryBackground;
  box-sizing: border-box;

  &::-webkit-input-placeholder {
    font-size: 0.75rem;
  }

  &.size-large {
    font-size: 18px;
    padding: 16px;
  }
  &,
  &:focus {
    outline: none;
    color: $gray;
  }
}

.icon {
  width: 16px;
  height: 16px;
  color: black;
}
</style>
