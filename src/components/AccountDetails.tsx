import { WALLET_ADAPTERS } from "@web3auth/base";
import { useWeb3Auth } from "@web3auth/modal-react-hooks";
import React, { JSX, useEffect, useState } from "react";

import { usePlayground } from "../services/playground";
import { chainConfig } from "../services/web3authContext";

interface AccountDetailsProps {
  children?: JSX.Element | JSX.Element[];
}

function AccountDetails({ children }: AccountDetailsProps) {
  const { address, balance, getUserInfo, userTokenBalance, contractTokenBalance, totalRewardsClaimed, focusTime } = usePlayground();
  const { userInfo, web3Auth, isConnected } = useWeb3Auth();
  const [addressToShow, setAddressToShow] = useState<string>(address || "");

  useEffect(() => {
    setAddressToShow(address || "");
  }, [address]);

  return (
    <div className="py-16 w-11/12 px-4 sm:px-6 lg:px-8 z-0">
      <div className="flex flex-col space-y-2 md:flex-row md:justify-between md:space-y-0">
        <h1 className="text-lg font-bold">Your Account Details</h1>
      </div>
      <div className="md:p-8 p-4 mt-6 space-y-4 rounded-lg bg-white overflow-hidden w-full">
        <div className="flex flex-col md:flex-row space-y-2 md:space-y-0">
          {userInfo?.profileImage && <img className="object-fill w-24 h-24 rounded-lg" src={userInfo?.profileImage} referrerPolicy="no-referrer" />}
          {!userInfo?.profileImage && userInfo?.name && (
            <span className="flex justify-center items-center bg-purple-100 font-bold w-24 h-24 rounded-lg text-[80px] text-purple-800">
              {userInfo?.name.charAt(0).toUpperCase()}
            </span>
          )}
          {!(userInfo?.profileImage || userInfo?.name) && (
            <span className="flex justify-center items-center bg-purple-100 font-bold w-24 h-24 rounded-lg text-[80px] text-purple-800">
              {web3Auth.connectedAdapterName.charAt(0).toUpperCase()}
            </span>
          )}
          <div className="space-y-2 md:space-y-0 md:pl-8 flex flex-col justify-between">
            {isConnected && web3Auth.connectedAdapterName === WALLET_ADAPTERS.AUTH ? (
              <span className="text-xl md:text-2xl text-gray-800 font-bold w-fit">{userInfo?.name}</span>
            ) : (
              <span className="text-xl md:text-2xl text-gray-800 font-bold w-fit">{`Connected to ${web3Auth.connectedAdapterName[0].toUpperCase()}${web3Auth.connectedAdapterName.slice(1).replace(/-/g, " ")}`}</span>
            )}
            <div
              className="w-fit text-[8px] sm:text-sm bg-gray-100 text-gray-600 p-1 pl-3 pr-3 rounded-full z-0 flex flex-row justify-between space-x-4 items-center cursor-pointer"
              onClick={() => {
                navigator.clipboard.writeText(address);
                setAddressToShow("Copied!");
                setTimeout(() => {
                  setAddressToShow(address);
                }, 1000);
              }}
            >
              <span>{addressToShow}</span>
              <svg className="w-2 sm:w-3.5" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M2.45166 2.26636C2.45166 1.16179 3.51498 0.266357 4.82666 0.266357H11.16C12.4717 0.266357 13.535 1.16179 13.535 2.26636V9.59969C13.535 10.7043 12.4717 11.5997 11.16 11.5997C11.16 12.7043 10.0967 13.5997 8.78499 13.5997H2.45166C1.13998 13.5997 0.0766602 12.7043 0.0766602 11.5997V4.26636C0.0766602 3.16179 1.13998 2.26636 2.45166 2.26636ZM2.45166 3.59969C2.01443 3.59969 1.65999 3.89817 1.65999 4.26636V11.5997C1.65999 11.9679 2.01443 12.2664 2.45166 12.2664H8.78499C9.22222 12.2664 9.57666 11.9679 9.57666 11.5997H4.82666C3.51498 11.5997 2.45166 10.7043 2.45166 9.59969V3.59969ZM4.82666 1.59969C4.38943 1.59969 4.03499 1.89817 4.03499 2.26636V9.59969C4.03499 9.96788 4.38943 10.2664 4.82666 10.2664H11.16C11.5972 10.2664 11.9517 9.96788 11.9517 9.59969V2.26636C11.9517 1.89817 11.5972 1.59969 11.16 1.59969H4.82666Z"
                  fill="#9CA3AF"
                />
              </svg>
            </div>
          </div>
        </div>
        {isConnected && web3Auth.connectedAdapterName === WALLET_ADAPTERS.AUTH && (
          <button className="w-full p-4 text-sm border-gray-200 rounded-lg shadow-sm" onClick={getUserInfo}>
            View User Info in Console
          </button>
        )}
      </div>
      <div className="p-8 mt-6 mb-0 rounded-lg bg-white flex flex-row justify-between flex-wrap">
        <div className="p-2 flex flex-col space-y-4">
          <span className="text-sm">Wallet Balance</span>
          <div className="flex flex-row space-x-1 items-start">
            <span className="text-2xl font-bold">{balance}</span>
            <span className="p-1 text-sm font-medium">{chainConfig.ticker || ""}</span>
          </div>
        </div>
        <div className="p-2 flex flex-col space-y-4">
          <span className="text-sm">User Token Balance</span>
          <div className="flex flex-row space-x-1 items-start">
            <span className="text-2xl font-bold">{userTokenBalance}</span>
            <span className="p-1 text-sm font-medium">FTX</span>
          </div>
        </div>
        <div className="p-2 flex flex-col space-y-4">
          <span className="text-sm">Contract Token Balance</span>
          <div className="flex flex-row space-x-1 items-start">
            <span className="text-2xl font-bold">{contractTokenBalance}</span>
            <span className="p-1 text-sm font-medium">FTX</span>
          </div>
        </div>
        <div className="p-2 flex flex-col space-y-4">
          <span className="text-sm">Total Rewards Claimed</span>
          <div className="flex flex-row space-x-1 items-start">
            <span className="text-2xl font-bold">{totalRewardsClaimed}</span>
            <span className="p-1 text-sm font-medium">FTX</span>
          </div>
        </div>
      </div>
      <div className="p-8 mt-6 mb-0 rounded-lg bg-white flex flex-row justify-between flex-wrap">
        <div className="p-2 flex flex-col space-y-4">
          <span className="text-sm">Focus Time</span>
          <div className="flex flex-row space-x-1 items-start">
            <span className="text-2xl font-bold">{focusTime}</span>
            <span className="p-1 text-sm font-medium">Sec</span>
          </div>
        </div>
        <div className="p-2 flex flex-col space-y-4">
          <span className="text-sm">Rewards Rate Per Second</span>
          <div className="flex flex-row space-x-1 items-start">
            <span className="text-2xl font-bold">1</span>
            <span className="p-1 text-sm font-medium">FTX/ Sec</span>
          </div>
        </div>
      </div>

      {children}
    </div>
  );
}

export default AccountDetails;
