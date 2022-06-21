import { shallowMount, VueWrapper } from "@vue/test-utils";
import SwapBox from "@/components/swap/SwapBox.vue";
import { createStore } from "vuex";

import { session } from "@/store/session";
import { GAS_AVG } from "@/utils/transactions";
import { web3 } from "../mocks/web3Mock";

const store = createStore({
  mutations: {},
  actions: {},
  modules: {
    session,
  },
});

describe("SwapBox.vue", () => {
  let wrapper: VueWrapper<any>;

  beforeEach(async () => {
    wrapper = shallowMount(SwapBox, {
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
      global: {
        plugins: [store],
      },
    });
    await wrapper.setData({
      web3
    });
  });

  it("Should render the whole screen", async () => {
    expect(wrapper.find("box-body")).toBeDefined();
    expect(wrapper.find("currency-input")).toBeDefined();
    expect(wrapper.find("input-note")).toBeDefined();
    expect(wrapper.find("addressBox")).toBeDefined();
    expect(wrapper.find("clipboard-icon")).toBeDefined();
    expect(wrapper.find("tooltip-balance")).toBeDefined();
    expect(wrapper.find("btn btn-primary py-3 rounded w-50")).toBeDefined();
  });

  it("Should get correct gas price", async () => {
    const spyGetGasCost = jest.spyOn(wrapper.vm, "getGasCostWithDecimals");
    const input = wrapper.find("#swapInput");
    
    await wrapper.setData({ 'swapFrom.value': "0.1" });
    await wrapper.vm.$nextTick();

    input.setValue(0.1);
    
    await wrapper.setData({ maximumAllowed: 1 });

    await wrapper.vm.$nextTick();

    expect(spyGetGasCost).toBeCalledWith(GAS_AVG);
    expect(wrapper.vm.swapTo.value).toEqual("0.0999982");
  });

  it("Should select the correct address type", () => {
    expect(wrapper.vm.typeDestinationAddress).toEqual('connected');
    const connectedAddressBox = wrapper.find("#connectedAddress");
    const differentAddressBox = wrapper.find("#differentAddress");
    differentAddressBox.trigger('click');
    expect(wrapper.vm.typeDestinationAddress).toEqual('different');
    connectedAddressBox.trigger('click');
    expect(wrapper.vm.typeDestinationAddress).toEqual('connected');
  });

  it("Swap button needs to be disabled", () => {
    const swapButton = wrapper.find(".btn.btn-primary.py-3.rounded.w-50");
    expect(swapButton.attributes().disabled).toBe("");
  });
});
