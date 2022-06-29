<template>
  <div>
    <Button
      v-if="walletConnected"
      class="d-flex align-items-center select-token-button"
      :variant="modelValue ? 'dark' : 'primary'"
      rounded
      @click="openModal"
    >
      <template v-if="modelValue.address && selectedToken">
        <div class="d-flex">
          <img
            class="token-image"
            :src="selectedToken.icon"
            :alt="`${selectedToken.name} logo`"
          />
          <h3 class="token-name">
            {{ selectedToken.token }}
          </h3>
        </div>
      </template>
      <template v-else><span class="py-1">select a token</span> </template>
      <i v-if="allowSelect" class="ml-2 fa-solid fa-angle-down"></i>
    </Button>
    <Modal ref="modal" title="select a token" no-body-padding>
      <SelectToken :model-value="modelValue" @selectToken="selectToken" />
    </Modal>
  </div>
</template>

<script>
import Modal from "@/components/core/Modal.vue";
import Button from "@/components/core/Button.vue";
import SelectToken from "@/components/shared/select-token/SelectToken.vue";
import { createNamespacedHelpers } from "vuex";

const { mapGetters, mapState } = createNamespacedHelpers("session");

export default {
  name: "SelectTokenModal",
  components: {
    Modal,
    Button,
    SelectToken,
  },
  props: {
    modelValue: {},
    allowSelect: {},
  },
  data() {
    return {
      manageTokenListsVisibility: false,
    };
  },
  computed: {
    ...mapState(["enabled"]),
    ...mapState(["account"]),
    ...mapGetters(["allTokens"]),
    selectedToken() {
      return this.allTokens.find(
        (token) => token.address === this.modelValue.address
      );
    },
    walletConnected() {
      return this.enabled;
    },
  },
  methods: {
    openModal() {
      if (this.allowSelect) {
        this.$refs["modal"].show();
      }
    },
    hideModal() {
      this.$refs["modal"].hide();
    },
    async selectToken(token) {
      if (token.address !== this.modelValue.address) {
        this.$emit("update:modelValue", token);
        this.hideModal();
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.header-title {
  margin: 0;
}
.back-to-select-token-button {
  img {
    width: 24px;
  }
}
.select-token-icon {
  width: 11px;
  margin-left: 10px;
}
.select-token-button {
  font-size: 18px;
  white-space: nowrap;

  .token-image {
    width: 24px;
    border-radius: 50%;
    margin-right: 4px;
  }
  .token-name {
    font-size: 16px;
    margin: 0;
    text-align: right;
    text-transform: uppercase;
    .full-name {
      font-size: 12px;
      color: black;
      display: block;
      font-weight: 400;
    }
  }
}
</style>
