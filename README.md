# Focus2Earn

Focus2Earn is a decentralized application (dApp) built on the Morph Chain using React, Vite, Web3Auth, and Ethers.js. It incentivizes users to stay focused on their tasks by rewarding them with ERC20 tokens. Here's how it works:

1. Users can deposit tokens as a stake before starting a focus session.
2. A timer on the frontend allows users to track their focus time.
3. Based on the accumulated focus time, users earn rewards in the form of ERC20 tokens.
4. Users can claim their earned rewards through the dApp interface.
5. The smart contract keeps track of individual user rewards and the total rewards claimed by all users.
6. The frontend provides a user-friendly interface to:
   - Deposit tokens and start a focus timer
   - Check accumulated rewards based on focus time
   - Claim available rewards
   - View personal stats (focus time, rewards earned, etc.)
   - See protocol-wide statistics (total focus time, total rewards distributed, etc.)

This dApp aims to boost productivity by creating a financial incentive for maintaining focus, while leveraging blockchain technology for transparency and decentralized reward distribution.

## Features

- Web3Auth integration for easy wallet login using socials
- Solidity based contract deployed on the Morph L2
- Smart contract interaction using Ethers.js
- Focus timer functionality
- Token staking and rewards system

## Prerequisites

- Node.js (v20 or later)
- npm (v10 or later)
- MetaMask or any Web3-compatible wallet

## Setup

1. Clone the repository:
   ```
   git clone https://github.com/yashovardhan/focus2earn.git
   cd focus2earn
   ```

2. Install dependencies:
   ```
   npm install
   ```
   or
   ```
   yarn install
   ```

3. For personlising, you can edit your Web3Auth credentials in the `services/web3authContext.tsx` file:
   ```
   clientId = your_web3auth_client_id
   web3AuthNetwork = The network corresponding to the web3auth client id
   ```

4. Start the development server:
   ```
   npm start
   ```

5. Open your browser and navigate to `http://localhost:5173`

## Smart Contracts

The smart contracts for this project are located in the `src/contracts` directory. Make sure to deploy these contracts to the Morph Chain before interacting with the dApp.

## Further Development

To extend the functionality of Focus2Earn:

1. Modify the smart contracts in `src/contracts/focus2earn.sol` to add new features or adjust existing ones.

2. Update the ABI files in `src/contracts/focus2earnabi.json` and `src/contracts/focustokenexabi.json` if you make changes to the smart contracts.

3. Extend the `evmProvider.ts` file in `src/services` to include new contract interactions and update the addresses.

4. Add new components in the `src/components` directory to create additional UI elements.

5. Modify the `HomePage.tsx` in `src/pages` to incorporate new features into the main interface.

6. Update the `playground.tsx` in `src/services` to manage new state variables and functions.

Remember to test your changes thoroughly and ensure compatibility with the existing codebase.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.
