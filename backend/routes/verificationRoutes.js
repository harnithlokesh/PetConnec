import express from "express";
import {
  getPendingMilestones,
  verifyMilestone,
  getVerifiedMilestonesByUser,
} from "../controllers/verificationControllers.js";
import { protect, verifierOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// Protected routes for verifiers
router.get("/pending", protect, verifierOnly, getPendingMilestones); // Get pending milestones
router.put("/:id", protect, verifierOnly, verifyMilestone); // Verify a milestone
router.get("/my-verifications", protect, verifierOnly, getVerifiedMilestonesByUser); // Get verified milestones by the logged-in verifier

export default router;