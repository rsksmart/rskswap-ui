<template>
  <div class="row justify-content-center">
    <section class="swap-box px-5">
      <header class="box-header"></header>

      <article class="box-body">
        <div class="w-100 d-flex flex-column">
          <span class="text-left ml-4">swap</span>
          <div class="currency-input">
            <div class="input-holder">
              <input placeholder="0.0" v-model="swapFrom.value" />
              <div
                class="w-60 d-flex flex-row align-items-center justify-content-end mr-3"
              >
                <span
                  class="input-note"
                  v-if="walletConnected && swapFrom.address"
                >
                  Balance: {{ this.swapFrom.balance }}
                  {{ getTokenByAddress(swapFrom.address).symbol }}
                </span>
                <SelectTokenModal v-model="swapFrom" />
              </div>
            </div>
          </div>
        </div>
        <div>
          <button class="btn btn-primary btn-lg rounded my-4">X</button>
        </div>
        <div class="w-100 d-flex flex-column">
          <span class="text-left ml-4">receive</span>
          <div class="currency-input">
            <div class="input-holder">
              <input placeholder="0.0" v-model="swapTo.value" />
              <div
                class="w-60 d-flex flex-row align-items-center justify-content-end mr-3"
              >
                <span
                  class="input-note"
                  v-if="walletConnected && swapTo.address"
                >
                  Balance: {{ this.swapTo.balance }}
                  {{ getTokenByAddress(swapTo.address).symbol }}
                </span>
                <SelectTokenModal v-model="swapTo" />
              </div>
            </div>
          </div>
        </div>
      </article>
      <div class="mb-5">
        <div class="d-flex flex-column mb-3 w-100">
          <span class="text-left ml-4">to address</span>
          <div class="d-flex flex-row flex-wrap justify-content-between">
            <button
              v-if="!hasAllowance"
              id="approve"
              class="btn btn-primary w-45 py-3 rounded"
              :disabled="!walletConnected && swapFrom.address"
              @click="onApprove"
            >
              Connected address
            </button>
            <button
              id="deposit"
              class="btn btn-primary w-45 py-3 rounded"
              :disabled="!walletConnected || !hasAllowance"
              @click="onSubmit"
            >
              Different address
            </button>
          </div>
        </div>
        <div>
          <div class="d-flex flex-row flex-wrap justify-content-between mt-4">
            <button
              v-if="!hasAllowance"
              id="approve"
              class="btn btn-primary w-45 py-3 rounded"
              :disabled="!walletConnected && swapFrom.address"
              @click="onApprove"
            >
              Approve
            </button>
            <button
              id="deposit"
              class="btn btn-primary w-45 py-3 rounded"
              :disabled="!walletConnected || !hasAllowance"
              @click="onSubmit"
            >
              Swap tokens
            </button>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import Button from "@/components/core/Button.vue";
import SelectTokenModal from "@/components/shared/select-token/SelectTokenModal.vue";
import { createNamespacedHelpers } from "vuex";
import Footer from "@/layouts/Footer.vue";

const { mapState, mapGetters, mapActions } = createNamespacedHelpers("session");

export default defineComponent({
  name: "SwapBox",
  components: {
    Button,
    SelectTokenModal,
    Footer,
  },
  watch: {
    async swapFrom(model) {
      if (model) {
        const tokenAbi = [
          {
            constant: true,
            inputs: [
              {
                name: "_owner",
                type: "address",
              },
            ],
            name: "balanceOf",
            outputs: [
              {
                name: "balance",
                type: "uint256",
              },
            ],
            payable: false,
            type: "function",
          },
        ];
        const tokenInst = new this.web3.eth.Contract(tokenAbi, model.address);
        const balance = await tokenInst.methods.balanceOf(this.account).call();
        this.swapFrom.balance = this.web3.utils.fromWei(balance);
      }
      return 0;
    },
    async swapTo(model) {
      if (model) {
        this.swapTo.balance = this.web3.utils.fromWei(
          await this.web3.eth.getBalance(this.account)
        );
      }
      return 0;
    },
  },
  data() {
    return {
      swapFrom: {
        address: "",
        balance: 0,
        value: "",
      },
      swapTo: {
        address: "",
        balance: 0,
        value: "",
      },
    };
  },
  computed: {
    ...mapState(["enabled"]),
    ...mapState(["account"]),
    ...mapState(["web3"]),
    ...mapGetters(["allTokens"]),
    walletConnected() {
      return this.enabled;
    },
  },
  methods: {
    getTokenByAddress(address) {
      return this.allTokens.find((token) => token.address === address);
    },
  },
});
</script>

<style lang="scss" scoped>
.swap-box {
  width: 100%;
  max-width: 480px;
  padding: 0rem 3rem;
  background-color: $darkBackground;
  border-radius: 24px;
  box-shadow: rgb(0 0 0 / 1%) 0px 0px 1px, rgb(0 0 0 / 4%) 0px 4px 8px,
    rgb(0 0 0 / 4%) 0px 16px 24px, rgb(0 0 0 / 1%) 0px 24px 32px;
  .box-header {
    display: flex;
    justify-content: space-between;
    padding: 8px 12px;
  }
  .box-title {
    font-size: 16px;
    margin: 0;
  }
}
.box-body {
  margin-bottom: 48px;
}
.currency-input {
  border-radius: 50px;
  padding: 0.5rem 1rem;
  border: 1px solid $darkBorderColor;
  background-color: $darkSecondaryBackground;
  &:hover {
    border-color: $darkBorderSecondaryColor;
  }
  .input-holder {
    display: flex;
    justify-content: space-between;
    input {
      width: 40%;
    }
  }
  input {
    min-width: 50px;
    background: none;
    margin-left: 12px;
    border: none;
    font-size: 18px;
    color: #999;
    &:focus,
    &:active {
      outline: none;
    }
  }
  .input-note {
    font-size: 14px;
    width: 80%;
    text-align: right;
    font-weight: 400;
    color: $grayText;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
.w-45 {
  width: 45%;
}

.w-40 {
  width: 40%;
}

.w-60 {
  width: 60%;
}
</style>
