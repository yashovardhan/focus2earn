import { IProvider } from "@web3auth/base";

import evmProvider from "./evmProvider";

export interface IWalletProvider {
  getAddress: () => Promise<string>;
  getBalance: () => Promise<string>;
  getChainId: () => Promise<string>;
  claimRewards: () => Promise<string>;
  claimInitialReward: () => Promise<string>;
  startFocus: (depositAmount: string, minimumTime: number) => Promise<any>;
  stopFocus: () => Promise<any>;
  getUserTokenBalance: () => Promise<any>;
  getContractTokenBalance: () => Promise<any>;
  getUserDetails: () => Promise<any>;
  getTotalRewardsClaimed: () => Promise<any>;
  getRewardRatePerSecond: () => Promise<any>;
  getInitialReward: () => Promise<any>;
  approveTokenSpending: () => Promise<any>;
}

export const getWalletProvider = (provider: IProvider | null, uiConsole: any): IWalletProvider => {
  return evmProvider(provider, uiConsole);
};
