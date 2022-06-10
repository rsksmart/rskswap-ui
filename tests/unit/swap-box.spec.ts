import { shallowMount, VueWrapper } from "@vue/test-utils";
import SwapBox from "@/components/swap/SwapBox.vue";
import { createStore } from "vuex";
import { session } from "@/store/session";

const store = createStore({
  mutations: {},
  actions: {},
  modules: {
    session,
  },
});

describe("SwapBox.vue", () => {
  let wrapper: VueWrapper<any>;
  beforeEach(() => {
    wrapper = shallowMount(SwapBox, {
      global: {
        plugins: [store],
      },
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
});
