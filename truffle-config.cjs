require('dotenv').config();  // This loads the .env variables

console.log("MNEMONIC:", process.env.MNEMONIC);  // Should print the mnemonic
console.log("PROJECT_ID:", process.env.PROJECT_ID);  // Should print the project ID

// require('dotenv').config();
const HDWalletProvider = require('@truffle/hdwallet-provider');
const { MNEMONIC, PROJECT_ID } = process.env;

console.log("MNEMONIC:", MNEMONIC);  // Check if mnemonic is correctly loaded
console.log("PROJECT_ID:", PROJECT_ID);  // Check if project ID is correctly loaded

module.exports = {
  networks: {
    sepolia: {
      provider: () => new HDWalletProvider(MNEMONIC, `https://sepolia.infura.io/v3/${PROJECT_ID}`),
      network_id: 11155111, // Sepolia's network ID
      gas: 3000000, // Gas limit
      gasPrice: 10000000000, // Gas price (in wei)
      confirmations: 2, // Confirmations before deployment
      timeoutBlocks: 500, // Timeout after 500 blocks
      skipDryRun: true // Skip dry run
    },
  },

  compilers: {
    solc: {
      version: "0.5.5", // Solidity compiler version
      optimizer: {
        enabled: true, // Enable optimization
        runs: 200, // Optimize for the number of runs
      },
    },
  }
};
