import express from "express";
import {
  getAllShelters,
  addShelter,
  deleteShelter,
} from "../controllers/shelterControllers.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// Routes
router.get("/shelters", protect, adminOnly, getAllShelters);
router.post("/shelters", protect, adminOnly, addShelter);
router.delete("/shelters/:id", protect, adminOnly, deleteShelter);

export default router;
