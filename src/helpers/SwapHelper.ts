import { MAX_SWAP_AMOUNT } from '@/constants/variables';

export function getMaximumAllowed(userBalance: number, relayerBalance: number, swapBalance: number) {
    let maxSwap = MAX_SWAP_AMOUNT;

    if (Math.min(userBalance, relayerBalance, swapBalance) <= maxSwap) {
        maxSwap = Math.min(userBalance, relayerBalance, swapBalance);
    }
    
    return maxSwap;
}