import { getMaximumAllowed } from "@/helpers/SwapHelper";
import { MAX_SWAP_AMOUNT } from "@/constants/variables";

describe("SwapHelper", () => {
  it("Should return the correct maximum swap allowed", () => {
    let userBalance = 0.01;
    let relayerBalance = 0.02;
    let swapBalance = 0.03;

    expect(getMaximumAllowed(userBalance, relayerBalance, swapBalance)).toEqual(userBalance);
    
    userBalance = 0.04;

    expect(getMaximumAllowed(userBalance, relayerBalance, swapBalance)).toEqual(relayerBalance);
    
    userBalance = 0.2;
    relayerBalance = 0.3;
    swapBalance = 0.4;

    expect(getMaximumAllowed(userBalance, relayerBalance, swapBalance)).toEqual(MAX_SWAP_AMOUNT);

    userBalance = 0.2;
    relayerBalance = 0.3;
    swapBalance = 0.05

    expect(getMaximumAllowed(userBalance, relayerBalance, swapBalance)).toEqual(swapBalance);
  });
});
