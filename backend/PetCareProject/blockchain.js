require("dotenv").config(); // Ensure your .env file is loaded
const { ethers } = require("ethers");
const contractArtifact = require("./artifacts/contracts/PetCareRewards.sol/PetCareRewards.json");

// Retrieve required variables from your environment
const { MAINNET_RPC_URL, TESTNET_RPC_URL, PRIVATE_KEY, CONTRACT_ADDRESS } = process.env;
if (!MAINNET_RPC_URL || !TESTNET_RPC_URL || !PRIVATE_KEY || !CONTRACT_ADDRESS) {
  console.error("Missing required environment variables: MAINNET_RPC_URL, TESTNET_RPC_URL, PRIVATE_KEY, or CONTRACT_ADDRESS.");
  process.exit(1);
}

// Create provider, wallet, and contract instance
const getProvider = (network) => {
  switch (network) {
    case "mainnet":
      return new ethers.providers.JsonRpcProvider(MAINNET_RPC_URL.trim());
    case "testnet":
      return new ethers.providers.JsonRpcProvider(TESTNET_RPC_URL.trim());
    case "localhost":
      return new ethers.providers.JsonRpcProvider("http://127.0.0.1:8545");
    default:
      throw new Error("Invalid network specified.");
  }
};

const getContract = (network) => {
  const provider = getProvider(network);
  const wallet = new ethers.Wallet(PRIVATE_KEY.trim(), provider);
  return new ethers.Contract(CONTRACT_ADDRESS.trim(), contractArtifact.abi, wallet);
};

/**
 * Sends a reward to a user by calling the rewardUser function on the PetCareRewards contract.
 *
 * @param {string} userWallet - The recipient's wallet address.
 * @param {number|string} rewardAmount - The reward amount (not used by the contract; provided for logging or future use).
 * @param {string} milestoneType - The milestone type (for logging or additional logic).
 * @param {string} network - The network to use ("mainnet", "testnet", or "localhost").
 * @returns {Promise<string>} The transaction hash.
 */
async function sendReward(userWallet, rewardAmount, milestoneType, network = "testnet") {
  try {
    console.log(`Sending reward for milestone "${milestoneType}" to ${userWallet} on ${network}. Reward amount (for logging): ${rewardAmount}`);
    const contract = getContract(network);
    const tx = await contract.rewardUser(userWallet);
    const receipt = await tx.wait();
    console.log("Reward sent! Transaction hash:", tx.hash);
    return tx.hash;
  } catch (error) {
    console.error("Error in sendReward:", error);
    throw error;
  }
}

module.exports = { sendReward };
