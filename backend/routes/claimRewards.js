import express from "express";
import { sendReward } from "../PetCareProject/blockchain.js"; // Import the blockchain function

const router = express.Router();

router.post("/claim", async (req, res) => {
    try {
        console.log("Claim request received:", req.body); // Debugging step

        const { userId, rewardAmount, milestoneType, network = "testnet" } = req.body;

        if (!userId || !rewardAmount || !milestoneType) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        // Call the blockchain function to send the reward
        const txHash = await sendReward(userId, rewardAmount, milestoneType, network);

        res.status(200).json({ message: "Reward claimed successfully!", txHash });
    } catch (error) {
        console.error("Error claiming reward:", error);
        res.status(500).json({ message: "Failed to claim reward", error: error.message });
    }
});

export default router;
