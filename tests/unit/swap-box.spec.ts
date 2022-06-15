import SwapBox from "@/components/swap/SwapBox.vue";
import { mount } from "@cypress/vue";

describe("SwapBox.vue", () => {
  beforeEach(() => {
    mount(SwapBox);
  });

  it("Should render the whole screen", async () => {
    cy.find('#swapInput').should('be.visible');
  });
});
