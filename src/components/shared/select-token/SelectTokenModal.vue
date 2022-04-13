<template>
  <div>
    <Button
      :disabled="!walletConnected"
      class="select-token-button"
      :variant="modelValue ? 'dark' : 'primary'"
      rounded
      @click="openModal"
    >
      <template v-if="modelValue.address && selectedToken">
        <div class="select-token-button mr-3">
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
      <template v-else><span> Select a token</span> </template>
      <v-img
        class="svg-image-to-white select-token-icon"
        src="@/assets/images/icons/angle-bottom.svg"
      />
    </Button>
    <Modal ref="modal" title="Select a token" no-body-padding>
      <template v-if="manageTokenListsVisibility" v-slot:headerTitle>
        <Button
          class="back-to-select-token-button svg-image-to-white"
          variant="text"
          noPadding
          @click="closeManageTokenLists"
        >
          <v-img src="@/assets/images/icons/arrow-left.svg" />
        </Button>
        <h3 class="header-title">Manage</h3>
      </template>

      <SelectToken
        v-if="!manageTokenListsVisibility"
        :model-value="modelValue"
        @selectToken="selectToken"
      />
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
      this.manageTokenListsVisibility = false;
      this.$refs["modal"].show();
    },
    hideModal() {
      this.$refs["modal"].hide();
    },
    openManageTokenLists() {
      this.manageTokenListsVisibility = true;
    },
    closeManageTokenLists() {
      this.manageTokenListsVisibility = false;
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
  margin-top: 4px;
  margin-left: 10px;
}
.select-token-button {
  display: inline-flex;
  padding: 0px;
  margin: 0px;
  margin-top: 4px;
  align-items: center;
  font-size: 18px;
  white-space: nowrap;

  .token-image {
    width: 24px;
    border-radius: 50%;
    margin-right: 15px;
  }
  .token-name {
    font-size: 16px;
    margin: 0;
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
