import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import { ethers } from "ethers";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Fix: Define `__dirname` before using it
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables **after** defining `__dirname`
dotenv.config({ path: path.join(__dirname, "../.env") });

import walletRoutes from "./routes/walletRoutes.js";
import petRoutes from "./routes/petRoutes.js";
import milestoneRoutes from "./routes/milestoneRoutes.js";
import rewardRoutes from "./routes/rewardRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import shelterRoutes from "./routes/shelterRoutes.js";
import claimRewardsRoute from "./routes/claimRewards.js"; // Import the claim rewards route
import { sendReward } from "./PetCareProject/blockchain.js";

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET;
const BLOCKCHAIN_RPC_URL = process.env.BLOCKCHAIN_RPC_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;

console.log("✅ JWT Secret Loaded");
console.log("✅ Blockchain Variables Loaded");
  
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log(`✅ MongoDB connected to ${mongoose.connection.name}`))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Blockchain Setup
const provider = new ethers.JsonRpcProvider(BLOCKCHAIN_RPC_URL);
const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

// Import the contract ABI
import PetCareRewards from "./PetCareProject/artifacts/contracts/PetCareRewards.sol/PetCareRewards.json" assert { type: "json" };

const contract = new ethers.Contract(CONTRACT_ADDRESS, PetCareRewards.abi, wallet);
console.log("✅ Blockchain Connected");

// API Routes
app.use("/api/pets", petRoutes);
app.use("/api/milestones", milestoneRoutes);
app.use("/api/rewards", rewardRoutes);
app.use("/api/users", userRoutes);
app.use("/api/shelters", shelterRoutes);
app.use("/api/wallet", walletRoutes);
app.use("/api/claim-reward", claimRewardsRoute); // Add the claim rewards route

app.use((err, req, res, next) => {
  console.error("❌ Error:", err.stack);
  res.status(500).json({ message: "Something went wrong!", error: err.message });
});

// Trigger Reward Route
app.post("/api/trigger-reward", async (req, res) => {
  const { userWallet, rewardAmount, milestoneType, network } = req.body;

  if (!userWallet || !rewardAmount || !milestoneType || !network) {
    return res.status(400).json({ success: false, error: "Missing required fields: userWallet, rewardAmount, milestoneType, or network." });
  }

  try {
    const txHash = await sendReward(userWallet, rewardAmount, milestoneType, network);
    res.status(200).json({ success: true, txHash });
  } catch (error) {
    console.error("Error in /trigger-reward route:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Check User Balance Route
app.get("/api/check-balance", async (req, res) => {
  const { userWallet, network } = req.query;

  if (!userWallet || !network) {
    return res.status(400).json({ error: "Missing required fields: userWallet or network." });
  }

  try {
    const dummyTokenAddress = process.env.DUMMY_TOKEN_ADDRESS; // DummyToken address
    const provider = new ethers.providers.JsonRpcProvider(network); // Use the network from query
    const DummyToken = new ethers.Contract(dummyTokenAddress, ["function balanceOf(address) view returns (uint256)"], provider);

    const balance = await DummyToken.balanceOf(userWallet);
    res.status(200).json({ success: true, balance: ethers.utils.formatEther(balance), unit: "ETN" });
  } catch (error) {
    console.error("Error in /check-balance route:", error);
    res.status(500).json({ error: "Failed to check balance." });
  }
});

// Sample API route
app.get("/", (req, res) => {
  res.send("🐾 Pet Adoption API is running!");
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("❌ Error:", err.stack);
  res.status(500).json({ message: "Something went wrong!", error: err.message });
});

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
