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
                placeholder="amount to swap"
                v-model="swapFrom.value"
                @change="handleSwapInput"
                @focus="clearSwapFrom"
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
              <input placeholder="amount to receive" v-model="swapTo.value" />
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
                  :disabled="
                    !walletConnected || typeDestinationAddress !== 'connected'
                  "
                  @click="selectAddressType('connected', $event)"
                >
                  <div>connected address</div>
                  <br />
                  <div v-if="walletConnected" class="text">
                    <i
                      v-if="
                        walletConnected &&
                        typeDestinationAddress === 'connected'
                      "
                      class="fa fa-check"
                    ></i>
                    {{ account }}
                  </div>
                </div>
              </div>
              <div class="col-md-6 col-sm-12 mb-3">
                <div
                  class="addressBox"
                  :class="handleDifferentDisabled"
                  @click="selectAddressType('different', $event)"
                >
                  <span v-if="!walletConnected"> different address </span>
                  <div
                    v-else
                    class="d-flex w-100 justify-content-center align-items-center"
                  >
                    <i
                      v-if="
                        walletConnected &&
                        typeDestinationAddress === 'different'
                      "
                      class="fa fa-check"
                    ></i>
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
import RELAYER_ABI from "@/constants/abis/relayer.json";

import SelectTokenModal from "@/components/shared/select-token/SelectTokenModal.vue";
import { RBTC_TOKEN } from "@/constants/tokens/tokens";
import { getDefaultSwapFrom, getDefaultSwapTo } from "@/utils/token-binding";
import { transactionCallback } from "@/utils/transactions";
import { txExplorerLink } from "@/utils/address-helpers";
import * as constants from "@/store/constants";
import { MAX_SWAP_AMOUNT, VALID_CODES } from "@/constants/variables";
import { GAS_AVG } from "@/utils/transactions";

const { mapState, mapActions } = createNamespacedHelpers("session");

export default defineComponent({
  name: "SwapBox",
  components: {
    SelectTokenModal,
  },
  watch: {
    "swapFrom.value"(value) {
      if (value > this.maximumAllowed) {
        this.swapFrom.value = this.maximumAllowed;
      }
    },
    async account(value) {
      if (value) {
        this.swapFrom = await getDefaultSwapFrom(this.web3, value);
        this.swapTo = await getDefaultSwapTo(this.web3, value);
      }
    },
    async swapFrom(model) {
      if (model) {
        this.hasAllowance = false;
        let balance;

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
        await this.getMaximumAllowed();
      }
    },
    async destinationAccount(value) {
      let code;
      this.destinationAccountValid = false;

      if (!value) {
        return;
      }

      try {
        code = await this.web3.eth.getCode(this.destinationAccount);
      } catch (err) {
        console.log("Invalid Address");
      }
      this.destinationAccountValid = VALID_CODES.includes(code);
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
      typeDestinationAddress: "connected",
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
      showSpinner: (state) => state.showSpinner,
    }),
    walletConnected() {
      return this.enabled;
    },
    handleConnectedDisabled() {
      if (
        !this.walletConnected ||
        this.typeDestinationAddress !== "connected"
      ) {
        return "boxDisabled";
      }

      return "";
    },
    handleSwapDisabled() {
      const WALLET_IS_NOT_CONNECTED = !this.walletConnected;
      const IS_SPINNER_RUNNING = this.showSpinner;
      const CONDITIONS_TO_ENABLE_BUTTON_SWAP = [
        this.isConnectedAndAccountPresent,
        this.isDestinationAddressDifferentAndDestinationAccountValid,
      ].some((condition) => condition);
      const IS_BUTTON_SWAP_DISABLED = !CONDITIONS_TO_ENABLE_BUTTON_SWAP;

      return (
        WALLET_IS_NOT_CONNECTED || IS_SPINNER_RUNNING || IS_BUTTON_SWAP_DISABLED
      );
    },
    isConnectedAndAccountPresent() {
      return this.typeDestinationAddress === "connected" && this.account;
    },
    isDestinationAddressDifferentAndDestinationAccountValid() {
      return (
        this.typeDestinationAddress === "different" &&
        this.destinationAccountValid
      );
    },
    handleDifferentDisabled() {
      if (
        !this.walletConnected ||
        this.typeDestinationAddress !== "different"
      ) {
        return "boxDisabled";
      }

      return "";
    },
    transferAddress() {
      return this.destinationAccount !== ""
        ? this.destinationAccount
        : this.account;
    },
  },
  methods: {
    getTokenByAddress(address) {
      return this.allTokens.find((token) => token.address === address);
    },
    async pasteClipboard() {
      this.destinationAccount = await navigator.clipboard.readText();
    },
    async assignMaxValueToSwapValue() {
      this.swapFrom.value = this.maximumAllowed;
      await this.handleSwapInput();
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
    clearSwapFrom() {
      this.swapFrom.value = null;
    },
    selectAddressType(type) {
      this.typeDestinationAddress = type;

      if (type === "connected") {
        this.destinationAccount = "";
      }
    },
    async onSwap() {
      if (!this.swapFrom.value || this.swapFrom.value <= 0) {
        this.SEND_NOTIFICATION({
          message: {
            message: "Error Message",
            data: `Amount is required for the swap.`,
            type: "danger",
          },
        });
        console.error("Amount is required for the swap.");
        return;
      }

      if (this.swapFrom.value > this.maximumAllowed) {
        console.error(
          `You cant swap a value greater than then ${this.maximumAllowed}!`
        );
        return;
      }

      if (!this.swapFrom.decimals) {
        this.SEND_NOTIFICATION({
          message: {
            message: "Error Message",
            data: "Origin token has no decimals defined!",
            type: "danger",
          },
        });
        console.error("Origin token has no decimals defined!");
        return;
      }

      this.START_SPINNER();

      const gasCost = await this.getGasCostWithDecimals(GAS_AVG);
      const gasFeeInWei = new BigNumber(gasCost).shiftedBy(18).toString();

      const estimatedGasFee = { amount: gasFeeInWei, unitType: "wei" };

      const deadline = Number(moment().add(12, "hours").unix());
      const signedAnyswapData = await this.signAnyswapWithMetamask(deadline); // needs to match what is in contract

      if (!signedAnyswapData) {
        this.SEND_NOTIFICATION({
          message: {
            message: "Error Message",
            data: `Connected wallet returned an error when trying to sign the transaction.`,
            type: "danger",
          },
        });
        console.error("no signed data!");
        this.STOP_SPINNER();
        return null;
      }

      const signedRelayerData = await this.signRelayerWithMetamask(
        deadline,
        estimatedGasFee
      );

      if (!signedRelayerData) {
        this.SEND_NOTIFICATION({
          message: {
            message: "Error Message",
            data: `Connected wallet returned an error when trying to sign the transaction.`,
            type: "danger",
          },
        });
        console.error("no signed data!");
        this.STOP_SPINNER();
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
              relayerV: signedRelayerData.v,
              relayerR: signedRelayerData.r,
              relayerS: signedRelayerData.s,
              anyswapV: signedAnyswapData.v,
              anyswapR: signedAnyswapData.r,
              anyswapS: signedAnyswapData.s,
              estimatedGasFee,
              sideTokenBtcContract: this.swapFrom.address,
              deadline: deadline,
            }),
          }
        );

        const receipt = await response.json();
        if (response.status !== 201) {
          console.error(receipt);
          this.SEND_NOTIFICATION({
            message: {
              message: "Error Message",
              data: receipt.response.error,
              type: "danger",
            },
          });
          return;
        }

        await new Promise((resolve, reject) =>
          transactionCallback({
            resolve,
            reject,
            web3: this.web3,
            explorer: txExplorerLink(
              receipt.transactionHash,
              process.env.VUE_APP_EXPLORER_ADDRESS
            ),
          })(null, receipt.transactionHash)
        );

        this.SEND_NOTIFICATION({
          message: {
            data: "swap receipt",
            type: "success",
          },
        });
      } catch (err) {
        console.error("couldnt swap", err);
        this.SEND_NOTIFICATION({
          message: {
            message: "Error Message",
            data: err.message,
            type: "danger",
          },
        });
      } finally {
        this.STOP_SPINNER();
      }
    },
    async signAnyswapWithMetamask(deadline) {
      try {
        const tokenContract = await new this.web3.eth.Contract(
          ERC20_ABI,
          this.swapFrom.address
        );

        const nonce = await tokenContract.methods.nonces(this.account).call();
        const tokenName = await tokenContract.methods.name().call();
        return await this.signMessage([
          this.account,
          JSON.stringify(
            this.parseAnyswapMessageToSign(nonce, deadline, tokenName)
          ),
        ]);
      } catch (err) {
        console.error("couldnt sign message", err);
      }
      return null;
    },
    async signRelayerWithMetamask(deadline, fee) {
      try {
        const relayerContract = await new this.web3.eth.Contract(
          RELAYER_ABI,
          process.env.VUE_APP_RELAYER_ADDRESS
        );

        const nonce = await relayerContract.methods.nonces(this.account).call();

        return await this.signMessage([
          this.account,
          JSON.stringify(this.parseRelayerMessageToSign(nonce, deadline, fee)),
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
            if (err) return reject(err);
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
    parseAnyswapMessageToSign(nonce, deadline, tokenName) {
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
          value: new BigNumber(this.swapFrom.value).shiftedBy(
            this.swapFrom.decimals
          ),
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
    parseRelayerMessageToSign(nonce, deadline, fee) {
      const messageData = {
        domain: {
          name: "RSK Relayer",
          version: "1",
          chainId: Number(process.env.VUE_APP_CHAIN_ID),
          verifyingContract: process.env.VUE_APP_RELAYER_ADDRESS,
        },
        message: {
          from: this.account,
          to: this.transferAddress,
          amount: new BigNumber(this.swapFrom.value).shiftedBy(
            this.swapFrom.decimals
          ),
          chainId: Number(process.env.VUE_APP_CHAIN_ID),
          relayer: process.env.VUE_APP_RELAYER_ADDRESS,
          fee: new BigNumber(fee.amount),
          deadline,
          nonce: nonce,
        },
        primaryType: "Swap",
        types: {
          EIP712Domain: [
            { name: "name", type: "string" },
            { name: "version", type: "string" },
            { name: "chainId", type: "uint256" },
            { name: "verifyingContract", type: "address" },
          ],
          Swap: [
            { name: "from", type: "address" },
            { name: "to", type: "address" },
            { name: "amount", type: "uint256" },
            { name: "chainId", type: "uint256" },
            { name: "relayer", type: "address" },
            { name: "fee", type: "uint256" },
            { name: "deadline", type: "uint256" },
            { name: "nonce", type: "uint256" },
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
      let relayerBalance = await this.web3.eth.getBalance(
        process.env.VUE_APP_RELAYER_ADDRESS
      );
      relayerBalance = +(new BigNumber(relayerBalance).shiftedBy(-RBTC_TOKEN.decimals).toString());

      const maxSwap = MAX_SWAP_AMOUNT;
      let userBalance = this.swapFrom.balance;
      Math.min(userBalance, relayerBalance) > maxSwap ? this.maximumAllowed = maxSwap :
        userBalance > relayerBalance ? this.maximumAllowed = relayerBalance : this.maximumAllowed = userBalance
    },
    ...mapActions([
      constants.START_SPINNER,
      constants.STOP_SPINNER,
      constants.SEND_NOTIFICATION,
    ]),
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
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
}
.boxDisabled {
  background-color: #e5e5e5;
  opacity: 0.65;
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
