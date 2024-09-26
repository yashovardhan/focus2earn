import { useWeb3Auth } from "@web3auth/modal-react-hooks";
import React, { useState } from "react";

import AccountDetails from "../components/AccountDetails";
import Console from "../components/Console";
import Form from "../components/Form";
import Header from "../components/Header";
import NotConnectedPage from "../components/NotConnectedPage";
import SourceCode from "../components/SourceCode";
import { usePlayground } from "../services/playground";

function HomePage() {
  const { isConnected } = useWeb3Auth();
  const [loading, setLoading] = useState(false);
  const [tokenToStake, setTokenToStake] = useState("");
  const { startFocus, stopFocus, claimRewards, claimInitialReward, approveTokenSpending } = usePlayground();

  const LoaderButton = ({ ...props }) => <button {...props}>{props.children}</button>;

  const formDetailsSignMessage = [
    {
      label: "Tokens to Stake",
      input: tokenToStake as string,
      onChange: setTokenToStake,
    },
  ];

  return (
    <main className="flex flex-col h-screen z-0">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        {isConnected ? (
          <>
            <div className=" w-full h-full flex flex-1 flex-col bg-gray-50 items-center justify-flex-start overflow-scroll">
              <h1 className="w-11/12 px-4 pt-16 sm:px-6 lg:px-8 text-2xl font-bold text-center sm:text-3xl">
                Focus Timer: Earn While You Concentrate
              </h1>
              <AccountDetails />
              <Form formDetails={formDetailsSignMessage}>
                {loading && (
                  <svg className="animate-spin h-5 w-5 text-black mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                )}
                <LoaderButton
                  className="w-full mt-10 mb-0 text-center justify-center items-center flex rounded-full px-6 py-3 text-white"
                  style={{ backgroundColor: "#0364ff" }}
                  onClick={async () => {
                    setLoading(true);
                    await startFocus(tokenToStake);
                    setLoading(false);
                  }}
                >
                  Start Focus
                </LoaderButton>
                <LoaderButton
                  className="w-full mt-10 mb-0 text-center justify-center items-center flex rounded-full px-6 py-3 text-white"
                  style={{ backgroundColor: "#ff0000" }}
                  onClick={async () => {
                    setLoading(true);
                    await stopFocus();
                    setLoading(false);
                  }}
                >
                  Stop Focus
                </LoaderButton>
                <LoaderButton
                  className="w-full mt-10 mb-0 text-center justify-center items-center flex rounded-full px-6 py-3 text-white"
                  style={{ backgroundColor: "#0364ff" }}
                  onClick={async () => {
                    setLoading(true);
                    await claimRewards();
                    setLoading(false);
                  }}
                >
                  Claim Focus Rewards
                </LoaderButton>
                <LoaderButton
                  className="w-full mt-10 mb-0 text-center justify-center items-center flex rounded-full px-6 py-3 text-white"
                  style={{ backgroundColor: "#0364ff" }}
                  onClick={async () => {
                    setLoading(true);
                    await claimInitialReward();
                    setLoading(false);
                  }}
                >
                  Claim First Time Login Reward
                </LoaderButton>
                <LoaderButton
                  className="w-full mt-10 mb-0 text-center justify-center items-center flex rounded-full px-6 py-3 text-white"
                  style={{ backgroundColor: "#0364ff" }}
                  onClick={async () => {
                    setLoading(true);
                    await approveTokenSpending();
                    setLoading(false);
                  }}
                >
                  Approve Token Spending
                </LoaderButton>
              </Form>
              <Console />
              <SourceCode />
            </div>
          </>
        ) : (
          <NotConnectedPage />
        )}
      </div>
    </main>
  );
}

export default HomePage;
