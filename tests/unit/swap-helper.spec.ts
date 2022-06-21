import { getMaximumAllowed } from "@/helpers/SwapHelper";
import { MAX_SWAP_AMOUNT } from "@/constants/variables";

describe("SwapHelper", () => {
  it("Should return the correct maximum swap allowed", () => {
    let userBalance = 0.01;
    let relayerBalance = 0.02;

    expect(getMaximumAllowed(userBalance, relayerBalance)).toEqual(userBalance);
    
    userBalance = 0.03;

    expect(getMaximumAllowed(userBalance, relayerBalance)).toEqual(relayerBalance);
    
    userBalance = 0.2;
    relayerBalance = 0.3;

    expect(getMaximumAllowed(userBalance, relayerBalance)).toEqual(MAX_SWAP_AMOUNT);
  });
});
