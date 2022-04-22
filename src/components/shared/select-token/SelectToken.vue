<template>
  <div class="container p-5">
    <div class="mb-4">
      <Input
        size="large"
        placeholder="Search name or paste address"
        v-model="searchText"
        fontAwesomeIcon="fa-solid fa-magnifying-glass fa-lg"
      />
    </div>
    <ul class="currencies-list">
      <template v-for="token in allTokens">
        <li
          :class="[
            'token-item',
            'p-3',
            'w-100',
            'mb-3',
            'container-fluid',
            'rounded',
            { selected: token.address === modelValue.address },
          ]"
          @click="selectToken(token)"
          :key="token.token"
          v-if="isTokenVisible(token)"
        >
          <div class="row no-gutters">
            <div class="col-10">
              <div class="ml-2 row no-gutters">
                <div class="col-1">
                  <div class="row justify-content-center">
                    <img
                      class="token-image"
                      :src="token.icon"
                      :alt="`${token.token} logo`"
                    />
                  </div>
                </div>
                <div class="col-8">
                  <div class="d-flex align-items-center">
                    <h3 class="token-name text-left">
                      {{ token.token }}
                    </h3>
                    <span class="description d-none d-sm-block ml-3">{{
                      token.name
                    }}</span>
                  </div>
                </div>
                <div class="col-3">
                  <div class="row justify-content-end">
                    <span class="description">
                      {{ token.balance || 0 }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-2 d-flex justify-content-center align-items-center">
              <i
                v-if="token.address === modelValue.address"
                class="fa-solid fa-check"
              ></i>
            </div>
          </div>
        </li>
      </template>
    </ul>
  </div>
</template>

<script>
import Button from "@/components/core/Button.vue";
import Input from "@/components/core/Input.vue";
import InfoTooltip from "@/components/shared/InfoTooltip.vue";
// TODO: Move to a "hook" like state
import { createNamespacedHelpers } from "vuex";

const { mapState, mapGetters } = createNamespacedHelpers("session");
export default {
  name: "SelectToken",
  components: {
    Button,
    Input,
    InfoTooltip,
  },
  props: {
    modelValue: {},
  },
  data() {
    return {
      searchText: "",
    };
  },
  computed: {
    ...mapState(["enabled"]),
    ...mapState(["account"]),
    ...mapGetters(["allTokens"]),
    connectedAddress() {
      return this.account;
    },
  },
  methods: {
    selectToken(token) {
      this.$emit("selectToken", token);
    },
    isTokenVisible(token) {
      return (
        !this.searchText ||
        token.token.toLowerCase().includes(this.searchText.toLowerCase()) ||
        token.name.toLowerCase().includes(this.searchText.toLowerCase()) ||
        token.address === this.searchText
      );
    },
  },
};
</script>

<style lang="scss" scoped>
.container {
  background-color: $lightGray;
}
.currencies-list {
  max-height: 450px;
  overflow-y: auto;
  list-style: none;
  margin: 0;
  padding: 0;
}
.token-item {
  background-color: $darkBackground;
  cursor: pointer;
  &:hover {
    background-color: $darkBorderColor;
    animation: fadeIn;
    animation-duration: 0.75s;
  }
  &.selected {
    opacity: 0.5;
    cursor: default;
  }
}

.token-image {
  width: 24px;
  border-radius: 50%;
  margin-right: 15px;
}
.token-name {
  font-size: 14px;
  margin: 0px;
  text-transform: uppercase;
}
.description {
  font-size: 14px;
  color: $gray;
  font-weight: 500;
}

#check {
  width: 24px;
  height: 24px;
}
</style>
