import express from "express";
import { saveWalletAddress, getWalletAddress, getWalletAddressByUserId } from "../controllers/userControllers.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/wallet", protect, saveWalletAddress);
router.get("/wallet", protect, getWalletAddress);
router.get("/users/:userId/wallet", protect, getWalletAddressByUserId);

export default router;
