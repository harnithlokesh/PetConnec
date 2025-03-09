import Milestone from "../models/milestoneModel.js";
import mongoose from "mongoose";

// Create a new milestone
export const createMilestone = async (req, res) => {
  try {
    const { petName, type, date, details, status } = req.body;
    const userId = req.user._id; // Get the user ID from the request object

    // Validate input
    if (!petName || !type || !date || !details || !status) {
      return res.status(400).json({
        success: false,
        error: "Validation Error",
        details: "All fields are required.",
      });
    }

    // Handle file upload
    let proof = null;
    if (req.file) {
      proof = req.file.path; // Save the file path
    }

    const newMilestone = new Milestone({
      petName,
      type,
      date: new Date(date),
      details,
      status,
      userId,
      proof,
    });

    await newMilestone.save();

    res.status(201).json({
      success: true,
      message: "Milestone created successfully",
      data: newMilestone,
    });
  } catch (error) {
    console.error("❌ Error creating milestone:", error);
    res.status(500).json({
      success: false,
      error: "Internal Server Error",
      details: error.message,
    });
  }
};

// Get milestones for the logged-in user
export const getMilestones = async (req, res) => {
  try {
    const milestones = await Milestone.find({ userId: req.user._id }) // Fetch milestones for the logged-in user
      .populate("userId", "fullName email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: {
        milestones,
      },
    });
  } catch (error) {
    console.error("❌ Error fetching milestones:", error);
    res.status(500).json({
      success: false,
      error: "Internal Server Error",
      details: error.message,
    });
  }
};