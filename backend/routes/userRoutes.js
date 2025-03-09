import express from "express";
import {
  registerUser,
  loginUser,
  getUserProfile,
  uploadProfilePic,
  saveWalletAddress,
  getWalletAddress,
  getWalletAddressByUserId,
} from "../controllers/userControllers.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// User Authentication Routes
router.post("/register", registerUser);
router.post("/login", loginUser); // Remove duplicate manual login handling

// Protected Routes (Require Authentication)
router.get("/profile", protect, getUserProfile);
router.post("/uploadProfilePic", protect, uploadProfilePic);

// Wallet Routes
router.post("/wallet", protect, saveWalletAddress);
router.get("/wallet", protect, getWalletAddress);
router.get("/wallet/:userId", protect, getWalletAddressByUserId);

export default router;
