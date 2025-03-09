import express from "express";
import {
  createPet,
  getAllPets,
  getPetById,
  updatePet,
  deletePet,
} from "../controllers/petController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// Define routes
router.post("/", protect, adminOnly, createPet);
router.get("/", getAllPets);
router.get("/:id", getPetById);
router.put("/:id", protect, adminOnly, updatePet);
router.delete("/:id", protect, adminOnly, deletePet);

export default router;
