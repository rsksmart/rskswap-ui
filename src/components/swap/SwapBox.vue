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
                  @click="assignMaxValueToSwapValue"
                  @mouseover="toggleshowMaxTooltip"
                  @mouseleave="toggleshowMaxTooltip"
                >
                  <div v-if="showMaxTooltip" class="tooltip-balance">
                    <span> max: {{ this.swapFrom.balance }}</span>
                  </div>
                  max: {{ this.swapFrom.balance }}
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
                <button
                  :class="paddingConnectedAddress"
                  :disabled="!walletConnected && swapFrom.address"
                >
                  <span :class="fontSizeConnectedAddress"
                    >connected address</span
                  >
                  <br />
                  <div v-if="walletConnected" class="text">
                    <span>{{ account }}</span>
                  </div>
                </button>
              </div>
              <div class="col-md-6 col-sm-12 mb-3">
                <div
                  id="diferentAddress"
                  class="rounded p-3"
                  :disabled="!walletConnected"
                  @click="onSubmit"
                >
                  <span v-if="!walletConnected"> different address </span>
                  <div
                    v-else
                    class="d-flex w-100 justify-content-center align-items-center"
                  >
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
                  :disabled="!walletConnected"
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

import * as constants from "@/store/constants";
import ERC20_ABI from "@/constants/abis/erc20.json";
import BRIDGE_ABI from "@/constants/abis/bridge.json";

import SelectTokenModal from "@/components/shared/select-token/SelectTokenModal.vue";
import { getDefaultSwapFrom, getDefaultSwapTo } from "@/utils/token-binding";

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
        // native tokens needs to approval?
        if (model.type === "NATIVE") {
          balance = await this.web3.eth.getBalance(this.account);

          // this.swapFrom.balance = this.web3.utils.fromWei(this.account); // todo: why this doesnt work?
          this.swapFrom.balance = new BigNumber(balance).shiftedBy(
            -model.decimals || -18
          );
        } else {
          const tokenInst = new this.web3.eth.Contract(
            ERC20_ABI,
            model.address
          );
          balance = await tokenInst.methods.balanceOf(this.account).call();
          this.swapFrom.balance = this.web3.utils.fromWei(balance);

          const spenderAddress = "0x7c77704007C9996Ee591C516f7319828BA49d91E"; //
          const allowance = await tokenInst.methods
            .allowance(this.account, spenderAddress)
            .call();
          this.hasAllowance = allowance > 0;
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
      showMaxTooltip: false,
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
    paddingConnectedAddress() {
      return `btn btn-primary ${
        this.walletConnected ? "py-2" : "py-3"
      } rounded w-100`;
    },
    fontSizeConnectedAddress() {
      return this.walletConnected ? "12px" : "14px";
    },
    transferAddress() {
      return this.destinationAccount || this.account;
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
    async onApprove() {
      if (!this.enabled) {
        console.error("web3 session not instantiated or connected!");
        return;
      }

      if (!this.swapFrom.address) {
        // TODO: add warning popup or disable approve button if no token selected?
        console.error("Selected token has no provided address!");
        return;
      }

      const tokenAddress = this.swapFrom.address;
      try {
        this.showSpinner = true;
        const receipt = await this.WEB3_APPROVE_TOKEN({
          tokenAddress,
          accountAddress: this.account,
        });
        console.info("approval receipt", receipt);

        this.hasAllowance = true;
        this.showSpinner = false;
      } catch (err) {
        this.showSpinner = false;
        this.hasAllowance = false;

        console.error("approval error: ", err);
      }
    },
    async onSwap() {
      if (!this.swapFrom.value) {
        console.error("You need to estimate a swap amount!");
        return;
      }

      this.showSpinner = true;

      const estimatedGasFee = await fetch(
        `${process.env.VUE_APP_RELAYER_ENDPOINT}/estimated-gas`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            amount: this.swapFrom.value,
            unitType: "wei",
          }),
        }
      );

      const signedData = await this.signWithMetamask(estimatedGasFee); // needs to match what is in contract
      // calll swap
      if (!signedData) {
        // todo: display error
        console.error("no signed data!");
        return null;
      }

      try {
        const response = await fetch(
          // 0xCa1D8715989D70173DdaE7e7b2111f49dE88d1c4
          `${process.env.VUE_APP_RELAYER_ENDPOINT}/swap`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              swapData: signedData.message.swapData,
              deadline: signedData.message.deadline,
              relayerAddress: process.env.VUE_APP_RELAYER_ADDRESS,
              v: signedData.v,
              r: signedData.r,
              s: signedData.s,
              estimatedGasFee,
              sideTokenBtcContractAddress: this.swapFrom.address,
            }),
          }
        );
      } catch (err) {
        console.error("couldnt swap", err);
      } finally {
        this.showSpinner = false;
      }
    },
    async signWithMetamask(estimatedGas) {
      const contract = new this.web3.eth.Contract(
        BRIDGE_ABI,
        this.network.bridge
      );

      try {
        const nonce = await contract.methods.nonces(this.account).call();
        const signedData = await this.signMessage([
          this.account,
          JSON.stringify(this.parseMessageToSign(estimatedGas, nonce)),
        ]);
        return signedData;
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
    // parseMessageToSign(nonce) {
    parseMessageToSign(estimatedGas) {
      return {
        domain: {
          name: "RSK Token Swap", // todo: what is the correct name?
          version: "1",
          chainId: process.env.VUE_APP_CHAIN_ID,
          verifyingContract: "bridge address maybe?", // this.sharedState.currentConfig.bridge
        },
        message: {
          // swapData: {
          from: this.account,
          toAddress: this.transferAddress,
          address: this.transferAddress,
          amount: this.swapFrom.value,
          chainId: process.env.VUE_APP_CHAIN_ID,
          fee: estimatedGas, // this.amountInWei
          deadline: moment().add(3, "hours").unix().toString(), // this.deadline
          // },
          // deadline: "what?", // this.deadline
          relayerAddress: process.env.VUE_APP_RELAYER_ADDRESS,
          // transactionHash: "??", //this.transaction.transactionHash // todo: transactionHash not needed?
          // nonce, // todo: nonce not needed?
        },
        primaryType: "Claim",
        types: {
          EIP712Domain: [
            { name: "name", type: "string" },
            { name: "version", type: "string" },
            { name: "chainId", type: "uint256" },
            { name: "verifyingContract", type: "address" },
          ],
          Claim: [
            { name: "to", type: "address" },
            { name: "amount", type: "uint256" },
            { name: "transactionHash", type: "bytes32" },
            { name: "originChainId", type: "uint256" },
            { name: "relayer", type: "address" },
            { name: "fee", type: "uint256" },
            { name: "nonce", type: "uint256" },
            { name: "deadline", type: "uint256" },
          ],
        },
      };
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
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.btn-arrow {
  background-color: $primary;
  border: none;
  color: $lightGray;
  margin-bottom: 1.5rem !important;
  margin-top: calc(1.5rem + 25px) !important;
}

#diferentAddress {
  background-color: $gray;
  color: white;
  font-size: 14px;
  .input {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    background-color: transparent;
    color: white;
    border: none;
    &::placeholder {
      color: white !important;
      font-size: 14px;
      text-transform: lowercase !important;
    }

    &:disabled {
      background-color: $lightGray;
    }
  }
  .clipboard-icon {
    cursor: pointer;
    width: 14px;
  }
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
</style>
