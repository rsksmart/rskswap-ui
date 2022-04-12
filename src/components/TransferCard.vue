<template>
  <div class="transfer">
    <div class="transfer-title">
      <span>{{ title }}</span>
    </div>
    <div class="transfer-body">
      <div class="row">
        <div class="col-5">
          <label class="tokenAddress-label" for="tokenAddress">
            Tokens to send
          </label>
          <div class="dropdown">
            <!--            TODO: add swap (change swap way) functionallity here-->
            <div>
              <a class="dropdown-item" href="#">
                <span><img :src="originToken.icon" class="token-logo" /></span>
                {{ originToken.symbol }}
              </a>
            </div>
          </div>
        </div>
        <div class="col-2">
          <button
            class="btn btn-link swap-btn"
            @click="changeSwap"
            :disabled="!walletConnected"
          >
            <i class="fas fa-exchange-alt swap-btn" />
          </button>
        </div>
        <div class="col-5">
          <label class="tokenAddress-label"> Tokens to receive </label>
          <div class="dropdown">
            <div>
              <a class="dropdown-item" href="#">
                <span>
                  <img :src="destinationToken.icon" class="token-logo" />
                </span>
                {{ destinationToken.symbol }}
              </a>
            </div>
          </div>
        </div>
      </div>
      <div class="row justify-content-center">
        <div class="col-6">
          <div class="form-group amount">
            <label class="amount-label" for="receive-amount">Amount</label>
            <input
              id="receive-amount"
              name="receiveAmount"
              class="form-control text-center align-center"
              type="number"
              min="0"
              :value="sourceAmount"
              :disabled="!walletConnected || !isOrigin || !selectedToken?.token"
              @input="(e) => handleChangeAmount(e, 'source')"
            />
            <div>
              <h3>balance {{ currentBalance }}</h3>
            </div>
            <div>
              <h3>amount to receive {{ destinationAmount }}</h3>
            </div>
            <!--            <div v-else class="holder"></div>-->
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-12">
          <label class="sender-label" for="sender-address">
            {{ isOrigin ? "Sender" : "Receiver" }} address
          </label>
          <div
            class="form-group transfer-address d-flex"
            :class="{ disabled: !walletConnected }"
          >
            <div
              class="address-container"
              :class="{
                'col-12': isOrigin,
                'col-6': !isOrigin,
                active: walletConnected,
              }"
              @click="setConnectedAddress()"
            >
              <div>Connected Address:</div>
              <div>{{ connectedAddress }}</div>
            </div>
            <div
              v-if="!isOrigin"
              class="col-6 address-container"
              :class="{ active: !isOrigin }"
            >
              <div>Different Address</div>
              <div>
                <input
                  type="text"
                  class="form-control transfer-different-address"
                  :disabled="isOrigin || !walletConnected"
                  :readonly="isOrigin"
                  @input="handleChangeAddress"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="transfer-footer">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script>
import { RBTC_TOKEN, RKOVWBTC_TOKEN } from "@/constants/tokens/tokens";
import store from "@/store/index.ts";

export default {
  name: "TransferCard",
  components: {},
  props: {
    sourceAmount: {
      required: true,
    },
    destinationAmount: {
      required: true,
    },
    address: {
      type: String,
      required: false,
      validator(val) {
        return true;
      },
    },
    maxAmount: {
      type: [Number, String],
      default: "",
    },
    token: {
      type: Object,
      default: () => ({}),
    },
    title: {
      type: String,
      required: true,
    },
  },
  emits: ["update:source-amount", "update:destination-amount"],
  data() {
    return {
      // sharedState: store.state,
      sharedState: store.state,
      tokens: [RBTC_TOKEN, RKOVWBTC_TOKEN],
      selectedToken: null,
      networks: [],
      percentage: 0,
      currentBalance: 0,
      destinationToken: RBTC_TOKEN,
      originToken: RKOVWBTC_TOKEN,
      selectedAddress: this.connectedAddress || "",
    };
  },
  computed: {
    defaultToken() {
      return Object.keys(this.token).length > 0
        ? this.token
        : this.selectedToken;
    },
    connectedAddress() {
      return this.sharedState.web3Session.account;
    },
    isOrigin() {
      return this.connectedAddress === this.selectedAddress;
    },
    walletConnected() {
      return this.sharedState.web3Session?.enabled;
    },
  },
  watch: {},
  methods: {
    // todo: add types here
    handleChangeAmount(
      event,
      // event: Event,
      amountType
      // amountType: "source" | "destination"
      // ): void {
    ) {
      // TODO: add update of destination amount
      this.$nextTick(() =>
        this.$emit(`update:${amountType}-amount`, event.target.value)
      );
    },
    async getOriginBalance() {
      if (this.walletConnected) {
        return this.sharedState.web3Session.web3.eth.getBalance(
          this.originToken.address
        );
      }
      return 0;
    },
    async changeSwap() {
      const _destinationToken = this.originToken;
      this.originToken = this.destinationToken;
      this.destinationToken = _destinationToken;
      this.currentBalance = await this.getOriginBalance();
    },
    handleChangeAddress($event) {
      this.selectedAddress = $event.target.value;
    },
    setConnectedAddress() {
      this.selectedAddress = this.connectedAddress;
    },
  },
};
</script>
