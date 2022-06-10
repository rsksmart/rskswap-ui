import { MAX_SWAP_AMOUNT } from '@/constants/variables';

export function getMaximumAllowed(userBalance: number, relayerBalance: number) {
    let maxSwap = MAX_SWAP_AMOUNT;
    
    Math.min(userBalance, relayerBalance) > maxSwap ? null :
        userBalance > relayerBalance ? maxSwap = relayerBalance : maxSwap = userBalance;
    
    return maxSwap;
}