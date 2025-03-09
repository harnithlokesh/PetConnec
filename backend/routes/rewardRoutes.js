import express from "express";
import {
  createReward,
  getAllRewards,
  getRewardById,
} from "../controllers/rewardControllers.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";
import { sendReward } from "../PetCareProject/blockchain.js";
import Reward from "../models/rewardModel.js";
import Milestone from "../models/milestoneModel.js";
import { isAddress } from "ethers";

const router = express.Router();

// Create a new reward
router.post("/", protect, adminOnly, createReward);

// Get all rewards for the logged-in user
router.get("/", protect, getAllRewards);

// Get a specific reward by ID
router.get("/:id", protect, getRewardById);

// Send reward to a user
router.post("/send", protect, adminOnly, async (req, res) => {
  try {
    const { userWallet, rewardAmount, milestoneId, milestoneType } = req.body;

    // Validate input
    if (!userWallet || !rewardAmount) {
      return res.status(400).json({ error: "User wallet and reward amount are required." });
    }

    // Validate Ethereum wallet address
    if (!isAddress(userWallet)) {
      return res.status(400).json({ error: "Invalid Ethereum wallet address." });
    }

    // Validate reward amount
    if (isNaN(rewardAmount) || rewardAmount <= 0) {
      return res.status(400).json({ error: "Reward amount must be a positive number." });
    }

    // Check milestone (if provided)
    if (milestoneId) {
      const milestone = await Milestone.findById(milestoneId);
      if (!milestone || milestone.status !== "completed") {
        return res.status(400).json({ error: "Milestone not completed." });
      }
    }

    // Send reward using blockchain helper
    const txHash = await sendReward(userWallet, rewardAmount, milestoneType);
    console.log(`✅ Reward sent! Tx: ${txHash}`);

    // Save reward to database
    const newReward = new Reward({
      userId: req.user._id,
      petId: req.body.petId, // Add petId if available
      milestoneId: milestoneId || null,
      amount: rewardAmount,
      transactionHash: txHash,
      status: "sent",
    });

    await newReward.save();

    res.status(200).json({ message: "Reward sent successfully!", txHash, reward: newReward });
  } catch (error) {
    console.error("❌ Error sending reward:", error);
    res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
});

// Get total rewards for the logged-in user
router.get("/total", protect, async (req, res) => {
  try {
    const rewards = await Reward.find({ userId: req.user._id });
    const totalRewards = rewards.reduce((sum, reward) => sum + reward.amount, 0);
    res.json({ totalRewards });
  } catch (error) {
    console.error("❌ Error fetching total rewards:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

export default router;
