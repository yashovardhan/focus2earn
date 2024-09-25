import { ADAPTER_STATUS, IProvider } from "@web3auth/base";
import { useWeb3Auth } from "@web3auth/modal-react-hooks";
import React, { createContext, ReactNode, useCallback, useContext, useEffect, useRef, useState } from "react";

import { getWalletProvider, IWalletProvider } from "./walletProvider";

export interface IPlaygroundContext {
  walletProvider: IWalletProvider | null;
  isLoading: boolean;
  address: string;
  balance: string;
  focusTime: number;
  userTokenBalance: string;
  contractTokenBalance: string;
  totalRewardsClaimed: string;
  chainId: string;
  playgroundConsole: string;
  getUserInfo: () => Promise<any>;
  getAddress: () => Promise<string>;
  getBalance: () => Promise<string>;
  getChainId: () => Promise<string>;
  claimInitialReward: () => Promise<any>;
  claimRewards: () => Promise<any>;
  startFocus: (depositAmount: string) => Promise<any>;
  stopFocus: () => Promise<any>;
  getUserTokenBalance: () => Promise<any>;
  getContractTokenBalance: () => Promise<any>;
  getUserDetails: () => Promise<any>;
  getTotalRewardsClaimed: () => Promise<any>;
  getRewardRatePerSecond: () => Promise<any>;
  getInitialReward: () => Promise<any>;
}

export const PlaygroundContext = createContext<IPlaygroundContext>({
  walletProvider: null,
  isLoading: false,
  address: null,
  balance: null,
  focusTime: 0,
  userTokenBalance: null,
  contractTokenBalance: null,
  totalRewardsClaimed: null,
  chainId: null,
  playgroundConsole: "",
  getUserInfo: async () => null,
  getAddress: async () => "",
  getBalance: async () => "",
  getChainId: async () => "",
  claimInitialReward: async () => {},
  claimRewards: async () => {},
  startFocus: async () => {},
  stopFocus: async () => {},
  getUserTokenBalance: async () => {},
  getContractTokenBalance: async () => {},
  getUserDetails: async () => {},
  getTotalRewardsClaimed: async () => {},
  getRewardRatePerSecond: async () => {},
  getInitialReward: async () => {},
});

interface IPlaygroundProps {
  children?: ReactNode;
}

export function usePlayground(): IPlaygroundContext {
  return useContext(PlaygroundContext);
}

export const Playground = ({ children }: IPlaygroundProps) => {
  const [walletProvider, setWalletProvider] = useState<IWalletProvider | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [address, setAddress] = useState<string | null>(null);
  const [balance, setBalance] = useState<string | null>(null);
  const [userTokenBalance, setUserTokenBalance] = useState<string | null>(null);
  const [contractTokenBalance, setContractTokenBalance] = useState<string | null>(null);
  const [chainId, setChainId] = useState<any>(null);
  const [totalRewardsClaimed, setTotalRewardsClaimed] = useState<string | null>(null);
  const [playgroundConsole, setPlaygroundConsole] = useState<string>("");
  const [focusTime, setFocusTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const uiConsole = (...args: unknown[]) => {
    setPlaygroundConsole(`${JSON.stringify(args || {}, null, 2)}\n\n\n\n${playgroundConsole}`);
    console.log(...args);
  };

  const { status, connect, userInfo, provider, web3Auth, authenticateUser } = useWeb3Auth();
  // const { showCheckout, showWalletConnectScanner, showWalletUI } = useWalletServicesPlugin();

  const setNewWalletProvider = useCallback(
    async (web3authProvider: IProvider) => {
      setWalletProvider(getWalletProvider(web3authProvider, uiConsole));
      setAddress(await walletProvider?.getAddress());
      setBalance(await walletProvider?.getBalance());
      setChainId(await walletProvider?.getChainId());
      setUserTokenBalance(await walletProvider?.getUserTokenBalance());
      setContractTokenBalance(await walletProvider?.getContractTokenBalance());
      setTotalRewardsClaimed(await walletProvider?.getTotalRewardsClaimed());
    },
    [chainId, address, balance, userTokenBalance, contractTokenBalance, totalRewardsClaimed, playgroundConsole]
  );

  useEffect(() => {
    if (status === ADAPTER_STATUS.READY) {
      connect();
    } else if (status === ADAPTER_STATUS.CONNECTED) {
      setNewWalletProvider(provider);
    }
  }, [web3Auth, status, provider, connect, setNewWalletProvider]);

  const startTimer = () => {
    if (!isRunning) {
      setIsRunning(true);
      intervalRef.current = setInterval(() => {
        setFocusTime((prevSeconds) => prevSeconds + 1);
      }, 1000);
    }
  };

  const stopTimer = () => {
    if (isRunning) {
      clearInterval(intervalRef.current!);
      setIsRunning(false);
      setFocusTime(0);
    }
  };

  const getUserInfo = async () => {
    if (!web3Auth) {
      uiConsole("web3Auth not initialized yet");
      return;
    }
    uiConsole(userInfo);
    return userInfo;
  };

  const getAddress = async () => {
    if (!web3Auth) {
      uiConsole("web3Auth not initialized yet");
      return "";
    }

    const updatedAddress = await walletProvider.getAddress();
    setAddress(updatedAddress);
    uiConsole(updatedAddress);
    return address;
  };

  const getBalance = async () => {
    if (!web3Auth) {
      uiConsole("web3Auth not initialized yet");
      return "";
    }
    const updatedBalance = await walletProvider.getBalance();

    setBalance(updatedBalance);
    uiConsole(updatedBalance);
    return balance;
  };

  const getUserTokenBalance = async () => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    try {
      const tokenBalance = await walletProvider.getUserTokenBalance();
      setUserTokenBalance(tokenBalance);
      uiConsole(tokenBalance);
      return tokenBalance;
    } catch (error) {
      uiConsole(`Error getting user token balance: ${(error as Error).message}`);
    }
  };

  const getContractTokenBalance = async () => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    try {
      const tokenBalance = await walletProvider.getContractTokenBalance();
      setContractTokenBalance(tokenBalance);
      return tokenBalance;
    } catch (error) {
      uiConsole(`Error getting contract token balance: ${(error as Error).message}`);
    }
  };

  const getTotalRewardsClaimed = async () => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    try {
      const tokenBalance = await walletProvider.getTotalRewardsClaimed();
      setTotalRewardsClaimed(tokenBalance);
      return tokenBalance;
    } catch (error) {
      uiConsole(`Error getting total rewards claimed: ${(error as Error).message}`);
    }
  };

  const getChainId = async () => {
    if (!web3Auth) {
      uiConsole("web3Auth not initialized yet");
      return "";
    }

    await walletProvider.getChainId();
  };

  const parseToken = (token: any) => {
    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace("-", "+").replace("_", "/");
      return JSON.parse(window.atob(base64 || ""));
    } catch (err) {
      console.error(err);
      return null;
    }
  };

  const claimInitialReward = async () => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    setIsLoading(true);
    uiConsole("Claiming tokens...");
    try {
      const result = await walletProvider.claimInitialReward();
      uiConsole(result);
    } catch (error) {
      uiConsole(`Error claiming initial reward: ${(error as Error).message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const claimRewards = async () => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    setIsLoading(true);
    uiConsole("Claiming tokens...");
    try {
      const result = await walletProvider.claimRewards();
      uiConsole(result);
    } catch (error) {
      uiConsole(`Error claiming tokens: ${(error as Error).message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const startFocus = async (depositAmount: string) => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    try {
      setIsLoading(true);
      uiConsole("Starting focus mode...");
      const focusModeStatus = await walletProvider.startFocus(depositAmount, 10);
      // Start the timer
      setFocusTime(0);
      startTimer();
      uiConsole(focusModeStatus);
    } catch (error) {
      uiConsole(`Error starting focus mode: ${(error as Error).message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const stopFocus = async () => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    try {
      setIsLoading(true);
      uiConsole("Stopping focus mode...");
      const focusModeStatus = await walletProvider.stopFocus();
      stopTimer();
      setIsLoading(false);
      uiConsole(`Focus mode stopped.${focusModeStatus}`);
    } catch (error) {
      setIsLoading(false);
      uiConsole(`Error stopping focus mode: ${(error as Error).message}`);
    }
  };

  const getUserDetails = async () => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    try {
      const userDetails = await walletProvider.getUserDetails();
      uiConsole("User details: ", userInfo, userDetails);
    } catch (error) {
      uiConsole(`Error getting user details: ${(error as Error).message}`);
    }
  };

  const getRewardRatePerSecond = async () => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    try {
      const rewardRatePerSecond = await walletProvider.getRewardRatePerSecond();
      uiConsole(`Reward rate per second: ${rewardRatePerSecond}`);
    } catch (error) {
      uiConsole(`Error getting reward rate per second: ${(error as Error).message}`);
    }
  };

  const getInitialReward = async () => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    try {
      const initialReward = await walletProvider.getInitialReward();
      uiConsole(`Initial reward: ${initialReward}`);
    } catch (error) {
      uiConsole(`Error getting initial reward: ${(error as Error).message}`);
    }
  };

  const getIdToken = async () => {
    const idToken = await authenticateUser();
    uiConsole("Id Token: ", parseToken(idToken.idToken));
    return idToken.idToken;
  };

  const contextProvider = {
    walletProvider,
    isLoading,
    address,
    balance,
    userTokenBalance,
    contractTokenBalance,
    totalRewardsClaimed,
    focusTime,
    chainId,
    playgroundConsole,
    getUserInfo,
    getAddress,
    getBalance,
    getChainId,
    getIdToken,
    claimInitialReward,
    claimRewards,
    startFocus,
    stopFocus,
    getUserTokenBalance,
    getContractTokenBalance,
    getUserDetails,
    getTotalRewardsClaimed,
    getRewardRatePerSecond,
    getInitialReward,
  };
  return <PlaygroundContext.Provider value={contextProvider}>{children}</PlaygroundContext.Provider>;
};
