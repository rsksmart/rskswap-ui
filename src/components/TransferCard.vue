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
            <!--            <div-->
            <!--              v-if="currentNetwork && isOrigin"-->
            <!--              class="dropdown-menu"-->
            <!--              aria-labelledby="dropdownMenuButton"-->
            <!--            >-->
            <!--              <li v-for="token in tokens" :key="token.token">-->
            <!--                <a class="dropdown-item" href="#" @click="selectToken(token, $event)">-->
            <!--                  <span><img :src="token.icon" class="token-logo" /></span>-->
            <!--                  {{ token.symbol }}-->
            <!--                </a>-->
            <!--              </li>-->
            <!--            </div>-->
          </div>
          <div class="invalid-feedback-container">
            <div class="invalid-feedback" name="tokenAddress">
              {{ selectedTokenError }}
            </div>
          </div>
        </div>
        <div class="col-2">
          <button class="btn btn-link swap-btn">
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
          <div class="invalid-feedback-container">
            <div class="invalid-feedback" name="tokenAddress">
              {{ selectedTokenError }}
            </div>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="offset-2 col-8">
          <div class="form-group amount">
            <label class="amount-label" for="receive-amount">Amount</label>
            <input
              id="receive-amount"
              name="receiveAmount"
              class="form-control text-center align-center"
              type="number"
              min="0"
              :value="amount"
              :disabled="!currentNetwork || !isOrigin || !selectedToken?.token"
              @input="handleChangeAmount"
            />
            <div>
              <h3>balance {{ originBalance }}</h3>
              <RangeInput
                v-model:value="percentage"
                step="1"
                :disabled="!currentNetwork || !selectedToken?.token"
              />
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
            :class="{ disabled: disabled }"
          >
            <div
              class="address-container"
              :class="{
                'col-12': isOrigin,
                'col-6': !isOrigin,
                active: typeDestinationAddress === 'connected',
              }"
              @click="selectAddressType('connected', $event)"
            >
              <div>Connected Address:</div>
              <div>{{ connectedAddress }}</div>
            </div>
            <div
              v-if="!isOrigin"
              class="col-6 address-container"
              :class="{ active: typeDestinationAddress === 'different' }"
              @click="selectAddressType('different', $event)"
            >
              <div>Different Address</div>
              <div>
                <input
                  type="text"
                  class="form-control transfer-different-address"
                  :disabled="typeDestinationAddress === 'connected' || disabled"
                  :readonly="typeDestinationAddress === 'connected'"
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
import RangeInput from "@/components/RangeInput.vue";
import { RBTC_TOKEN, RKOVWBTC_TOKEN } from "@/constants/tokens/tokens";
import store from "@/store/index.ts";

export default {
  name: "TransferCard",
  components: {
    RangeInput,
  },
  props: {
    amount: {
      type: Number,
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
  emits: [],
  data() {
    return {
      // sharedState: store.state,
      sharedState: store.state,
      tokens: [RBTC_TOKEN, RKOVWBTC_TOKEN],
      selectedToken: null,
      networks: [],
      percentage: 0,
    };
  },
  computed: {
    defaultToken() {
      return Object.keys(this.token).length > 0
        ? this.token
        : this.selectedToken;
    },
    originToken() {
      return RBTC_TOKEN;
    },
    destinationToken() {
      return RKOVWBTC_TOKEN;
    },
  },
  // computed() {},
  watch: {
    percentage(val) {
      console.log("percentage changed!");
      console.error("need to implement!");
    },
  },
  methods: {
    async originBalance() {
      if (this.sharedState.web3Session.enabled) {
        return this.sharedState.web3Session.web3.eth.getBalance(
          this.originToken.address
        );
      }
    },
  },
};
</script>
