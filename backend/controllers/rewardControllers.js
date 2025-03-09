import Reward from "../models/rewardModel.js";
import Milestone from "../models/milestoneModel.js";
import mongoose from "mongoose";

// Input validation middleware
const validateRewardInput = (req, res, next) => {
  const { userId, petId, amount } = req.body;

  if (!userId || !petId || !amount) {
    return res.status(400).json({
      success: false,
      error: "Validation Error",
      details: "User ID, pet ID, and amount are required"
    });
  }

  if (typeof amount !== "number" || amount <= 0) {
    return res.status(400).json({
      success: false,
      error: "Validation Error",
      details: "Amount must be a positive number"
    });
  }

  next();
};

// Create a new reward
export const createReward = [
  validateRewardInput,
  async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const { userId, petId, milestoneId, amount } = req.body;

      // Check for existing reward if milestone is provided
      if (milestoneId) {
        const existingReward = await Reward.findOne({ milestoneId }).session(session);
        if (existingReward) {
          await session.abortTransaction();
          return res.status(400).json({
            success: false,
            error: "Duplicate Error",
            details: "Reward already exists for this milestone"
          });
        }
      }

      const newReward = new Reward({
        userId,
        petId,
        milestoneId,
        amount,
        status: "pending",
        createdAt: new Date()
      });

      await newReward.save({ session });

      await session.commitTransaction();

      res.status(201).json({
        success: true,
        message: "Reward created successfully",
        data: newReward
      });
    } catch (error) {
      await session.abortTransaction();
      console.error("❌ Error creating reward:", error);
      res.status(500).json({
        success: false,
        error: "Internal Server Error",
        details: error.message
      });
    } finally {
      session.endSession();
    }
  }
];

// Get all rewards for a user with filtering and pagination
export const getAllRewards = async (req, res) => {
  try {
    const { status, petId, page = 1, limit = 10 } = req.query;
    const userId = req.user._id;

    const filter = { userId };
    if (status) filter.status = status;
    if (petId) filter.petId = petId;

    const rewards = await Reward.find(filter)
      .populate('milestoneId')
      .populate('petId')
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await Reward.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: {
        rewards,
        pagination: {
          total,
          page: parseInt(page),
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error("❌ Error fetching rewards:", error);
    res.status(500).json({
      success: false,
      error: "Internal Server Error",
      details: error.message
    });
  }
};

// Get a specific reward by ID
export const getRewardById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        error: "Validation Error",
        details: "Invalid reward ID format"
      });
    }

    const reward = await Reward.findById(id)
      .populate('milestoneId')
      .populate('petId');

    if (!reward) {
      return res.status(404).json({
        success: false,
        error: "Not Found",
        details: "Reward not found"
      });
    }

    // Check if the reward belongs to the requesting user
    if (reward.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        error: "Forbidden",
        details: "Access denied"
      });
    }

    res.status(200).json({
      success: true,
      data: reward
    });
  } catch (error) {
    console.error("❌ Error fetching reward:", error);
    res.status(500).json({
      success: false,
      error: "Internal Server Error",
      details: error.message
    });
  }
};
