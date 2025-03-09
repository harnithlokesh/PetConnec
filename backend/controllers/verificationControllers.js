import Milestone from "../models/milestoneModel.js";
import Verification from "../models/verification.js";
import mongoose from "mongoose";

// Verify a milestone
export const verifyMilestone = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { id } = req.params;
    const { status, comments, evidence, verificationMethod } = req.body;

    // Validate input
    if (!status || !["approved", "rejected", "pending"].includes(status)) {
      await session.abortTransaction();
      return res.status(400).json({
        success: false,
        error: "Validation Error",
        details: "Invalid status value. Must be 'approved', 'rejected', or 'pending'.",
      });
    }

    if (status === "rejected" && !comments) {
      await session.abortTransaction();
      return res.status(400).json({
        success: false,
        error: "Validation Error",
        details: "Comments are required when rejecting a milestone.",
      });
    }

    // Find the milestone
    const milestone = await Milestone.findById(id).session(session);

    if (!milestone) {
      await session.abortTransaction();
      return res.status(404).json({
        success: false,
        error: "Not Found",
        details: "Milestone not found.",
      });
    }

    // Update milestone status and verifier
    milestone.status = status;
    milestone.verifierId = req.user._id;
    milestone.verifiedAt = new Date();
    await milestone.save({ session });

    // Create a verification record
    const verification = new Verification({
      milestone: milestone._id,
      verifier: req.user._id,
      status,
      comments,
      evidence,
      verificationMethod: verificationMethod || "manual",
    });

    await verification.save({ session });

    await session.commitTransaction();

    res.status(200).json({
      success: true,
      message: `Milestone ${status} successfully!`,
      data: {
        milestone,
        verification,
      },
    });
  } catch (error) {
    await session.abortTransaction();
    console.error("❌ Error verifying milestone:", error);
    res.status(500).json({
      success: false,
      error: "Internal Server Error",
      details: error.message,
    });
  } finally {
    session.endSession();
  }
};

// Get pending milestones
export const getPendingMilestones = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const pendingMilestones = await Milestone.find({ status: "pending" })
      .populate("userId", "fullName email")
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await Milestone.countDocuments({ status: "pending" });

    res.status(200).json({
      success: true,
      data: {
        milestones: pendingMilestones,
        pagination: {
          total,
          page: parseInt(page),
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    console.error("❌ Error fetching pending milestones:", error);
    res.status(500).json({
      success: false,
      error: "Internal Server Error",
      details: error.message,
    });
  }
};

// Get verified milestones by the logged-in verifier
export const getVerifiedMilestonesByUser = async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;

    const filter = { verifierId: req.user._id };
    if (status) filter.status = status;

    const verifiedMilestones = await Milestone.find(filter)
      .populate("userId", "fullName email")
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .sort({ verifiedAt: -1 });

    const total = await Milestone.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: {
        milestones: verifiedMilestones,
        pagination: {
          total,
          page: parseInt(page),
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    console.error("❌ Error fetching verified milestones:", error);
    res.status(500).json({
      success: false,
      error: "Internal Server Error",
      details: error.message,
    });
  }
};