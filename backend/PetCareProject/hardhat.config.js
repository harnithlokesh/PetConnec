require("dotenv").config({ path: "../.env" });
require("@nomiclabs/hardhat-waffle");

const { MAINNET_RPC_URL, TESTNET_RPC_URL, PRIVATE_KEY } = process.env;

if (!MAINNET_RPC_URL || !TESTNET_RPC_URL || !PRIVATE_KEY) {
  console.error("Missing required environment variables: MAINNET_RPC_URL, TESTNET_RPC_URL, or PRIVATE_KEY.");
  process.exit(1);
}

module.exports = {
  solidity: "0.8.20",
  networks: {
    mainnet: {
      url: MAINNET_RPC_URL.trim(),
      accounts: [PRIVATE_KEY.trim()],
    },
    testnet: {
      url: TESTNET_RPC_URL.trim(),
      accounts: [PRIVATE_KEY.trim()],
    },
    localhost: {
      url: "http://127.0.0.1:8545", // Local development network
      accounts: [PRIVATE_KEY.trim()],
    },
  },
};
