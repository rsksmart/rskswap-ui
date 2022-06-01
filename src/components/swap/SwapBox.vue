<template>
  <div class="row justify-content-center">
    <section class="swap-box px-5">
      <header class="box-header"></header>

      <article class="box-body">
        <div class="w-100 d-flex flex-column">
          <span class="text-left ml-4">swap</span>
          <div class="currency-input">
            <div class="input-holder">
              <input
                placeholder="0.0"
                v-model="swapFrom.value"
                @change="handleSwapInput"
                type="number"
              />
              <div
                class="w-60 d-flex flex-row align-items-center justify-content-end mr-3"
              >
                <span
                  class="input-note"
                  v-if="walletConnected && swapFrom.address"
                  @click="assignMaxValueToSwapValue"
                  @mouseover="toggleshowMaxTooltip"
                  @mouseleave="toggleshowMaxTooltip"
                >
                  <div v-if="showMaxTooltip" class="tooltip-balance">
                    <span> max: {{ maximumAllowed }}</span>
                  </div>
                  max: {{ maximumAllowed }}
                </span>
                <SelectTokenModal v-model="swapFrom" :allowSelect="false" />
              </div>
            </div>
          </div>
        </div>
        <div v-if="false">
          <button class="p-3 rounded btn-arrow">
            <i class="fa-solid fa-arrow-right-arrow-left fa-2xl"></i>
          </button>
        </div>
        <div class="w-100 d-flex flex-column">
          <span class="text-left ml-4">receive</span>
          <div class="currency-input">
            <div class="input-holder">
              <input placeholder="0.0" v-model="swapTo.value" />
              <div
                class="w-60 d-flex flex-row align-items-center justify-content-end mr-3"
              >
                <SelectTokenModal v-model="swapTo" :allowSelect="false" />
              </div>
            </div>
          </div>
        </div>
      </article>
      <div class="mb-5">
        <div class="w-100">
          <div class="container-fluid box-button">
            <div class="row gx-4">
              <div class="col-md-6 col-sm-12 mb-3">
                <div 
                  class="addressBox"
                  :class="handleConnectedDisabled"
                  :disabled="!walletConnected || typeDestinationAddress !== 'connected'"
                  @click="selectAddressType('connected', $event)">
                  <div>connected address</div>
                  <br />
                  <div v-if="walletConnected" class="text">
                  <i v-if="walletConnected && typeDestinationAddress === 'connected'" class="fa fa-check"></i>
                    {{ account }}
                  </div>
                </div>
              </div>
              <div class="col-md-6 col-sm-12 mb-3">
                <div
                  class="addressBox" 
                  :class="handleDifferentDisabled"
                  @click="selectAddressType('different', $event)">
                  <span v-if="!walletConnected"> different address </span>
                  <div
                    v-else
                    class="d-flex w-100 justify-content-center align-items-center"
                  >
                    <i v-if="walletConnected && typeDestinationAddress === 'different'" class="fa fa-check"></i>
                    <input
                      type="text"
                      class="input"
                      placeholder="paste address"
                      v-model="destinationAccount"
                    />
                    <div @click="pasteClipboard" class="clipboard-icon">
                      <i class="fa-regular fa-paste"></i>
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-md-12 justify-content-center">
                <button
                  class="btn btn-primary py-3 rounded w-50"
                  :disabled="handleSwapDisabled"
                  @click="onSwap"
                >
                  swap tokens
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import { createNamespacedHelpers } from "vuex";
import BigNumber from "bignumber.js";
import moment from "moment";

import ERC20_ABI from "@/constants/abis/erc20.json";

import SelectTokenModal from "@/components/shared/select-token/SelectTokenModal.vue";
import { RKOVWBTC_TOKEN } from "@/constants/tokens/tokens";
import { getDefaultSwapFrom, getDefaultSwapTo } from "@/utils/token-binding";
import { GAS_AVG } from "@/utils/transactions";

const { mapState } = createNamespacedHelpers("session");

export default defineComponent({
  name: "SwapBox",
  components: {
    SelectTokenModal,
  },
  watch: {
    async account(value) {
      if (value) {
        this.swapFrom = await getDefaultSwapFrom(this.web3);
        this.swapTo = await getDefaultSwapTo(this.web3);
      }
    },
    async swapFrom(model) {
      if (model) {
        this.hasAllowance = false;
        let balance;
        await this.getMaximumAllowed();
        if (model.type === "NATIVE") {
          if (!model.decimals) {
            console.error("decimals not defined for model ", model.token);
          }
          balance = await this.web3.eth.getBalance(this.account);

          this.swapFrom.balance = new BigNumber(balance).shiftedBy(
            -model.decimals
          );
        } else {
          const tokenInst = new this.web3.eth.Contract(
            ERC20_ABI,
            model.address
          );
          balance = await tokenInst.methods.balanceOf(this.account).call();
          this.swapFrom.balance = this.web3.utils.fromWei(balance);
        }
      }
    },
    async destinationAccount(value) {
      this.destinationAccountValid = false;
      if (value !== '') {
        try {
          const code = await this.web3.eth.getCode(this.destinationAccount);
          if (code === '0x' || code === '0x0') {
            this.destinationAccountValid = true
          } else {
            this.destinationAccountValid = false
          }
        } catch (err) {
          this.destinationAccountValid = false;
        }
      }
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
      destinationAccount: "",
      destinationAccountValid: false,
      showMaxTooltip: false,
      typeDestinationAddress: 'connected',
      maximumAllowed: 0,
    };
  },
  computed: {
    ...mapState({
      enabled: (state) => state.enabled,
      account: (state) => state.account,
      network: (state) => state.network,
      web3: (state) => state.web3,
      allTokens: (state) => state.allTokens,
    }),
    walletConnected() {
      return this.enabled;
    },
    handleConnectedDisabled() {
      if (!this.walletConnected || this.typeDestinationAddress !== 'connected') {
        return 'boxDisabled'
      }

      return '';
    },
    handleSwapDisabled() {
      let disabled = true;

      if (this.walletConnected) {
        if(this.typeDestinationAddress === 'connected' && this.account) {
          disabled = false;
        } else if (this.typeDestinationAddress === 'different' && this.destinationAccountValid) {
          disabled = false;
        }
      }

      return disabled;
    },
    handleDifferentDisabled() {
      if (!this.walletConnected || this.typeDestinationAddress !== 'different') {
        return 'boxDisabled'
      }

      return '';
    },
    transferAddress() {
      return this.destinationAccount !== '' ? this.destinationAccount : this.account;
    },
  },
  methods: {
    getTokenByAddress(address) {
      return this.allTokens.find((token) => token.address === address);
    },
    async pasteClipboard() {
      this.destinationAccount = await navigator.clipboard.readText();
    },
    assignMaxValueToSwapValue() {
      this.swapFrom.value = this.swapFrom.balance;
    },
    toggleshowMaxTooltip() {
      this.showMaxTooltip = !this.showMaxTooltip;
    },
    async getGasCostWithDecimals(estimatedGas) {
      const gasPrice = await this.web3.eth.getGasPrice();

      return new BigNumber(estimatedGas)
        .multipliedBy(gasPrice)
        .shiftedBy(-18)
        .toPrecision(18)
        .toString();
    },
    async handleSwapInput() {
      try {
        const gasCost = await this.getGasCostWithDecimals(GAS_AVG);
        this.swapTo.value = new BigNumber(this.swapFrom.value)
          .minus(gasCost)
          .toString();
      } catch (err) {
        console.error("[handleSwapInput] ERROR: ", err);
      }
    },
    selectAddressType(type) {
      this.typeDestinationAddress = type;

      if (type === 'connected') {
        this.destinationAccount = '';
      }
    },
    async onSwap() {
      if (!this.swapFrom.value) {
        console.error("You need to estimate a swap amount!");
        return;
      }

      if (this.swapFrom.value > this.maximumAllowed) {
        console.error(`You cant swap a value greater than then ${this.maximumAllowed}!`);
        return;
      }

      if (!this.swapFrom.decimals) {
        console.error("Origin token has no decimals defined!");
        return;
      }

      this.showSpinner = true;

      const gasCost = await this.getGasCostWithDecimals(GAS_AVG);
      const gasFeeInWei = new BigNumber(gasCost).shiftedBy(18).toString();

      const estimatedGasFee = { amount: gasFeeInWei, unitType: "wei" };

      const deadline = Number(moment().add(12, "hours").unix());
      const signedData = await this.signWithMetamask(deadline); // needs to match what is in contract

      if (!signedData) {
        // todo: display error
        console.error("no signed data!");
        return null;
      }

      try {
        const response = await fetch(
          `${process.env.VUE_APP_RELAYER_ENDPOINT}/swap`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              swapData: this.parseSwapData(deadline),
              relayerAddress: process.env.VUE_APP_RELAYER_ADDRESS,
              v: signedData.v,
              r: signedData.r,
              s: signedData.s,
              estimatedGasFee,
              sideTokenBtcContract: this.swapFrom.address,
            }),
          }
        );

        const receipt = await response.json();

        console.log("swap receipt", receipt);
      } catch (err) {
        console.error("couldnt swap", err);
      } finally {
        this.showSpinner = false;
      }
    },
    async signWithMetamask(deadline) {
      try {
        const CONTRACT = await new this.web3.eth.Contract(
          ERC20_ABI,
          this.swapFrom.address
        );

        const nonce = await CONTRACT.methods.nonces(this.account).call();
        const tokenName = await CONTRACT.methods.name().call();
        return this.signMessage([
          this.account,
          JSON.stringify(this.parseMessageToSign(nonce, deadline, tokenName)),
        ]);
      } catch (err) {
        console.error("couldnt sign message", err);
      }
      return null;
    },
    signMessage(params) {
      return new Promise((resolve, reject) => {
        this.web3.currentProvider.sendAsync(
          {
            method: "eth_signTypedData_v4",
            params,
            from: this.account,
          },
          (err, result) => {
            if (err) reject(err);
            if (result?.error) reject("result with error ", result?.error);
            if (!result.result) reject(new Error("Empty or undefined result!"));

            const signature = result.result.substring(2);
            const r = `0x${signature.substring(0, 64)}`;
            const s = `0x${signature.substring(64, 128)}`;
            const v = parseInt(signature.substring(128, 130), 16);

            resolve({ r, s, v });
          }
        );
      });
    },
    parseMessageToSign(nonce, deadline, tokenName) {
      const messageData = {
        domain: {
          name: tokenName,
          version: "1",
          chainId: Number(process.env.VUE_APP_CHAIN_ID),
          verifyingContract: this.swapFrom.address,
        },
        message: {
          owner: this.account,
          to: process.env.VUE_APP_RELAYER_ADDRESS,
          value: new BigNumber(this.swapFrom.value).shiftedBy(this.swapFrom.decimals),
          deadline,
          nonce: nonce,
        },
        primaryType: "Transfer",
        types: {
          EIP712Domain: [
            { name: "name", type: "string" },
            { name: "version", type: "string" },
            { name: "chainId", type: "uint256" },
            { name: "verifyingContract", type: "address" },
          ],
          Transfer: [
            { name: "owner", type: "address" },
            { name: "to", type: "address" },
            { name: "value", type: "uint256" },
            { name: "nonce", type: "uint256" },
            { name: "deadline", type: "uint256" },
          ],
        },
      };

      return messageData;
    },
    parseSwapData(deadline) {
      return {
        fromAddress: this.account,
        toAddress: this.transferAddress,
        amount: new BigNumber(this.swapFrom.value)
          .shiftedBy(this.swapFrom.decimals)
          .toString(),
        chainId: Number(process.env.VUE_APP_CHAIN_ID),
        deadline,
      };
    },
    async getMaximumAllowed() {
      let relayerBalance = await this.web3.eth.getBalance(process.env.VUE_APP_RELAYER_ADDRESS);
      relayerBalance = +(new BigNumber(relayerBalance).shiftedBy(-RKOVWBTC_TOKEN.decimals).toString());
      const maxSwap = 0.1;
      let userBalance = await this.web3.eth.getBalance(this.account);
      userBalance = +(new BigNumber(userBalance).shiftedBy(-18).toString());

      if (maxSwap > userBalance && relayerBalance > maxSwap) {
        this.maximumAllowed = relayerBalance;
      } else if (userBalance > relayerBalance && userBalance > maxSwap) {
        this.maximumAllowed = userBalance;
      } else {
        this.maximumAllowed =  maxSwap;
      }
    },
  },
});
</script>

<style lang="scss" scoped>
.swap-box {
  width: 100%;
  max-width: 560px;
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
    position: relative;
    input {
      width: 40%;
      font-size: 0.9rem;
      &::placeholder {
        font-size: 0.9rem;
      }
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
    cursor: pointer;
    width: 52%;
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

.g-10 {
  gap: 10%;
}

.min-w-45 {
  min-width: 50%;
}
.box-button {
  padding: 0;
}

.text {
  font-size: 12px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.btn-arrow {
  background-color: $primary;
  border: none;
  color: $lightGray;
  margin-bottom: 1.5rem !important;
  margin-top: calc(1.5rem + 25px) !important;
}
.tooltip-balance {
  background-color: black;
  border-radius: 8px;
  font-weight: 500;
  padding-left: 0.7rem;
  padding-right: 0.7rem;
  max-height: 28px;
  text-align: center;
  position: absolute;
  bottom: 80%;
  left: 58%;
  z-index: 2000;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  transform: translate(-50%, -50%);

  &:before {
    content: "";
    display: block;
    width: 0;
    height: 0;
    position: absolute;

    border-left: 8px solid transparent;
    border-top: 8px solid black;
    border-right: 8px solid transparent;
    left: 50%;
    top: 26px;
  }
  span {
    white-space: nowrap;
  }
}
.addressBox {
  color: #000;
  font-size: 14px;
  cursor: pointer;
  padding: 5px;
  background-color: #e1fce4;
  border: 1px solid #22de22;
  border-radius: 10px;
  height: 60px;
  display : flex;
  flex-wrap: wrap;
  align-items : center;
  justify-content : center;
}
.boxDisabled {
  background-color: #e5e5e5;
  opacity: .65;
  border: none;
}
.input {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  background-color: transparent;
  color: #000;
  border: none;
  &::placeholder {
    color: #000 !important;
    font-size: 14px;
    text-transform: lowercase !important;
  }
}
.clipboard-icon {
  cursor: pointer;
  width: 14px;
}
.fa-check {
  color: #69ed6f;
}
</style>
