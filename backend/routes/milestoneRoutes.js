import express from "express";
import { createMilestone, getMilestones } from "../controllers/milestoneControllers.js";
import { protect } from "../middleware/authMiddleware.js";
import multer from "multer";

const router = express.Router();

// Configure multer for file uploads
const upload = multer({ dest: "uploads/" });

// Protected routes
router.post("/", protect, upload.single("proof"), createMilestone); // Create a milestone
router.get("/", protect, getMilestones); // Get milestones for the logged-in user

export default router;