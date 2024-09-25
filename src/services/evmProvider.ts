import type { IProvider } from "@web3auth/base";
import { ethers, formatUnits, parseUnits } from "ethers";

import focus2EarnAbi from "../contracts/focus2earnabi.json";
import focusTokenExAbi from "../contracts/focustokenexabi.json";
import { IWalletProvider } from "./walletProvider";

const ethersWeb3Provider = (provider: IProvider | null, uiConsole: (...args: unknown[]) => void): IWalletProvider => {
  const focusTokenExAddress = "0xEdb522211B4cab110B76B57b6D0691e297B4d921";
  const focus2EarnAddress = "0xCD6372C8f10017295d80F9d66f80f6da61B35dc0";

  const getAddress = async (): Promise<string> => {
    try {
      const ethersProvider = new ethers.BrowserProvider(provider as any);

      const signer = await ethersProvider.getSigner();

      // Get user's Ethereum public address
      const address = await signer.getAddress();
      return address;
    } catch (error: any) {
      uiConsole(error);
      return error.toString();
    }
  };

  const getChainId = async (): Promise<string> => {
    try {
      const ethersProvider = new ethers.BrowserProvider(provider as any);

      return (await ethersProvider.getNetwork()).chainId.toString(16);
    } catch (error: any) {
      uiConsole(error);
      return error.toString();
    }
  };

  const getBalance = async (): Promise<string> => {
    try {
      const ethersProvider = new ethers.BrowserProvider(provider as any);

      const signer = await ethersProvider.getSigner();

      // Get user's Ethereum public address
      const address = signer.getAddress();

      // Get user's balance in ether
      const res = ethers.formatEther(
        await ethersProvider.getBalance(address) // Balance is in wei
      );
      const balance = (+res).toFixed(4);
      return balance;
    } catch (error: any) {
      uiConsole(error);
      return error.toString();
    }
  };

  const claimRewards = async (): Promise<string> => {
    try {
      const ethersProvider = new ethers.BrowserProvider(provider);
      const signer = await ethersProvider.getSigner();

      const focusToEarn = new ethers.Contract(focus2EarnAddress, focus2EarnAbi, signer);
      const tx = await focusToEarn.claimRewards();
      await tx.wait();
      return `Reward claimed successfully! Transaction hash: ${tx.hash}`;
    } catch (err) {
      console.error("Error claiming ßinitial reward:", err);
      return `Failed to claim reward. Message: ${(err as Error).message}`;
    }
  };

  const claimInitialReward = async (): Promise<string> => {
    try {
      const ethersProvider = new ethers.BrowserProvider(provider);
      const signer = await ethersProvider.getSigner();

      const focusToEarn = new ethers.Contract(focus2EarnAddress, focus2EarnAbi, signer);
      const tx = await focusToEarn.claimInitialReward();
      await tx.wait();
      return `Reward claimed successfully! Transaction hash: ${tx.hash}`;
    } catch (err) {
      console.error("Error claiming ßinitial reward:", err);
      return `Failed to claim reward. Message: ${(err as Error).message}`;
    }
  };

  const startFocus = async (depositAmount: string, minimumTime: number): Promise<any> => {
    try {
      const ethersProvider = new ethers.BrowserProvider(provider);
      const signer = await ethersProvider.getSigner();
      const focusToEarn = new ethers.Contract(focus2EarnAddress, focus2EarnAbi, signer);

      const depositInWei = parseUnits(depositAmount, 18);
      const tx = await focusToEarn.startFocus(depositInWei, minimumTime);
      await tx.wait();
      return `Focus session started with ${depositAmount} tokens. Transaction hash: ${tx.hash}`;
    } catch (err) {
      console.error("Error starting focus session:", err);
      throw new Error(`Failed to start focus session. Message: ${(err as Error).message}`);
    }
  };

  const stopFocus = async (): Promise<any> => {
    try {
      const ethersProvider = new ethers.BrowserProvider(provider);
      const signer = await ethersProvider.getSigner();
      const focusToEarn = new ethers.Contract(focus2EarnAddress, focus2EarnAbi, signer);

      const tx = await focusToEarn.stopFocus();
      await tx.wait();
      return tx.hash;
    } catch (err) {
      console.error("Error stopping focus session:", err);
      throw new Error(`Failed to stop focus session. Message: ${(err as Error).message}`);
    }
  };

  const getUserTokenBalance = async (): Promise<any> => {
    try {
      const ethersProvider = new ethers.BrowserProvider(provider);
      const signer = await ethersProvider.getSigner();
      const userAddress = signer.getAddress();

      const tokenContract = new ethers.Contract(focusTokenExAddress, focusTokenExAbi, signer);
      const balance = await tokenContract.balanceOf(userAddress);

      console.log(`User balance: ${formatUnits(balance, 18)} tokens.`);
      return formatUnits(balance, 18);
    } catch (err) {
      console.error("Error fetching user balance:", err);
    }
  };

  const getContractTokenBalance = async (): Promise<any> => {
    try {
      const ethersProvider = new ethers.BrowserProvider(provider);
      const signer = await ethersProvider.getSigner();

      const tokenContract = new ethers.Contract(focusTokenExAddress, focusTokenExAbi, signer);
      const balance = await tokenContract.balanceOf(focus2EarnAddress);
      console.log(`Contract balance: ${formatUnits(balance, 18)} tokens.`);
      return formatUnits(balance, 18);
    } catch (err) {
      console.error("Error fetching contract balance:", err);
    }
  };

  const getUserDetails = async (): Promise<any> => {
    try {
      const ethersProvider = new ethers.BrowserProvider(provider);
      const signer = await ethersProvider.getSigner();
      const userAddress = signer.getAddress();

      const focusToEarn = new ethers.Contract(focus2EarnAddress, focus2EarnAbi, signer);
      const user = await focusToEarn.users(userAddress);
      return {
        deposit: formatUnits(user[0], 18), // Convert deposit from wei to human-readable format
        startTime: user[1] > 0 ? new Date(user[1] * 1000).toLocaleString() : "N/A", // Convert UNIX timestamp to readable date
        unclaimedRewards: formatUnits(user[2], 18), // Unclaimed rewards (convert from wei)
        totalClaimedRewards: formatUnits(user[3], 18), // Total claimed rewards (convert from wei)
        minimumTimeToFocus: user[4].toString(), // Minimum time to focus (in seconds)
      };
    } catch (err) {
      console.error("Error fetching user details:", err);
    }
  };

  const getTotalRewardsClaimed = async (): Promise<any> => {
    try {
      const ethersProvider = new ethers.BrowserProvider(provider);
      const signer = await ethersProvider.getSigner();
      const focusToEarn = new ethers.Contract(focus2EarnAddress, focus2EarnAbi, signer);

      const rewardsClaimed = await focusToEarn.totalRewardsClaimed();
      return ethers.formatUnits(rewardsClaimed, 18); // Format the value
    } catch (err) {
      console.error("Error fetching total rewards claimed:", err);
    }
  };

  const getRewardRatePerSecond = async (): Promise<any> => {
    try {
      const ethersProvider = new ethers.BrowserProvider(provider);
      const signer = await ethersProvider.getSigner();
      const focusToEarn = new ethers.Contract(focus2EarnAddress, focus2EarnAbi, signer);

      const rate = await focusToEarn.rewardRatePerSecond();
      return ethers.formatUnits(rate, 18); // Format the value
    } catch (err) {
      console.error("Error fetching reward rate per second:", err);
    }
  };

  const getInitialReward = async (): Promise<any> => {
    try {
      const ethersProvider = new ethers.BrowserProvider(provider);
      const signer = await ethersProvider.getSigner();
      const focusToEarn = new ethers.Contract(focus2EarnAddress, focus2EarnAbi, signer);

      const reward = await focusToEarn.initialReward();
      return ethers.formatUnits(reward, 18); // Format the value
    } catch (err) {
      console.error("Error fetching initial reward:", err);
    }
  };

  return {
    getAddress,
    getBalance,
    getChainId,
    claimRewards,
    claimInitialReward,
    startFocus,
    stopFocus,
    getUserTokenBalance,
    getContractTokenBalance,
    getUserDetails,
    getTotalRewardsClaimed,
    getRewardRatePerSecond,
    getInitialReward,
  };
};

export default ethersWeb3Provider;
