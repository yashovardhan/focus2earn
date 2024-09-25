import "./App.css";

import { Web3AuthInnerContext, Web3AuthProvider } from "@web3auth/modal-react-hooks";
import { WalletServicesProvider } from "@web3auth/wallet-services-plugin-react-hooks";

import HomePage from "./pages/HomePage";
// import NFT from "./pages/NFT";
import { Playground } from "./services/playground";
import web3AuthContextConfig from "./services/web3authContext";

function App() {
  return (
    <div>
      <Web3AuthProvider config={web3AuthContextConfig}>
        <WalletServicesProvider context={Web3AuthInnerContext}>
          <Playground>
            <HomePage />
          </Playground>
        </WalletServicesProvider>
      </Web3AuthProvider>
    </div>
  );
}

export default App;
