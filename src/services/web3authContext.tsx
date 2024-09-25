import { AuthAdapter, MFA_LEVELS } from "@web3auth/auth-adapter";
import { CHAIN_NAMESPACES, CustomChainConfig, UX_MODE, WEB3AUTH_NETWORK } from "@web3auth/base";
import { getDefaultExternalAdapters } from "@web3auth/default-evm-adapter";
import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider";
import { Web3AuthOptions } from "@web3auth/modal";
import { BUTTON_POSITION, CONFIRMATION_STRATEGY, WalletServicesPlugin } from "@web3auth/wallet-services-plugin";

const clientId = "BPi5PB_UiIZ-cPz1GtV5i1I2iOSOHuimiXBI0e-Oe_u6X3oVAbCiAZOTEBtTXw4tsluTITPqA8zMsfxIKMjiqNQ";

export const chainConfig: CustomChainConfig = {
  chainNamespace: CHAIN_NAMESPACES.EIP155,
  chainId: "0xafa",
  rpcTarget: "https://rpc-holesky.morphl2.io",
  displayName: "Morph Holesky",
  blockExplorerUrl: "https://explorer-holesky.morphl2.io/",
  ticker: "ETH",
  tickerName: "ETH",
  logo: "https://morphl2brand.notion.site/image/https%3A%2F%2Fprod-files-secure.s3.us-west-2.amazonaws.com%2Ffcab2c10-8da9-4414-aa63-4998ddf62e78%2F64fbcffc-0e7c-45e1-8900-1bb36dc90924%2FFrame_1597882262.png?table=block&id=0e6a22c3-ed4e-4c25-9575-11b95b1eade9&spaceId=fcab2c10-8da9-4414-aa63-4998ddf62e78&width=2000&userId=&cache=v2",
};

const privateKeyProvider = new EthereumPrivateKeyProvider({
  config: {
    chainConfig,
  },
});

const web3AuthOptions: Web3AuthOptions = {
  chainConfig,
  clientId,
  web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_MAINNET,
  privateKeyProvider,
};

const authAdapter = new AuthAdapter({
  loginSettings: {
    mfaLevel: MFA_LEVELS.OPTIONAL,
  },
  adapterSettings: {
    uxMode: UX_MODE.REDIRECT, // "redirect" | "popup"
  },
});

const walletServicesPlugin = new WalletServicesPlugin({
  wsEmbedOpts: {},
  walletInitOptions: {
    whiteLabel: { showWidgetButton: true, buttonPosition: BUTTON_POSITION.BOTTOM_RIGHT },
    confirmationStrategy: CONFIRMATION_STRATEGY.MODAL,
  },
});

const adapters = await getDefaultExternalAdapters({ options: web3AuthOptions });

const web3AuthContextConfig = {
  web3AuthOptions,
  adapters: [authAdapter, ...adapters],
  plugins: [walletServicesPlugin],
};

export default web3AuthContextConfig;
