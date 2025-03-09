import User from "../models/User.js";
import jwt from "jsonwebtoken";
import { ethers } from "ethers";
import rateLimit from "express-rate-limit";

// Rate limiting for login attempts
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 login requests per windowMs
  message: "Too many login attempts. Please try again later.",
});

// Enhanced input validation
const validateRegistrationInput = (req, res, next) => {
  const { fullName, username, email, password } = req.body;

  if (!fullName || !username || !email || !password) {
    return res.status(400).json({
      success: false,
      error: "Validation Error",
      details: "Missing required fields",
    });
  }

  // Email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      error: "Validation Error",
      details: "Invalid email format",
    });
  }

  // Password strength validation
  if (password.length < 8) {
    return res.status(400).json({
      success: false,
      error: "Validation Error",
      details: "Password must be at least 8 characters long",
    });
  }

  next();
};

// Register a new user
export const registerUser = [
  validateRegistrationInput,
  async (req, res) => {
    try {
      const { profilePicture, fullName, username, email, phone, password, role } = req.body;

      // Check for existing user
      const existingUser = await User.findOne({
        $or: [{ email }, { username }],
      });

      if (existingUser) {
        return res.status(400).json({
          success: false,
          error: "Duplicate Error",
          details: "Email or username already exists",
        });
      }

      // Save plaintext password
      const newUser = new User({
        profilePicture,
        fullName,
        username,
        email,
        phone,
        password, // Save plaintext password
        role: role || "user",
        walletAddress: ethers.Wallet.createRandom().address, // Generate wallet address
        createdAt: new Date(),
      });

      await newUser.save();

      // Generate JWT token
      const token = jwt.sign(
        { id: newUser._id },
        process.env.JWT_SECRET,
        { expiresIn: "10000000h" }
      );

      res.status(201).json({
        success: true,
        message: "User registered successfully",
        data: {
          token,
          user: {
            id: newUser._id,
            fullName: newUser.fullName,
            username: newUser.username,
            email: newUser.email,
            role: newUser.role,
            walletAddress: newUser.walletAddress,
          },
        },
      });
    } catch (error) {
      console.error("❌ Registration error:", error);
      res.status(500).json({
        success: false,
        error: "Internal Server Error",
        details: error.message,
      });
    }
  },
];

// Login user
export const loginUser = [
  loginLimiter,
  async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          success: false,
          error: "Validation Error",
          details: "Email and password are required",
        });
      }

      const user = await User.findOne({ email });

      if (!user) {
        console.log("User not found:", email);
        return res.status(401).json({
          success: false,
          error: "Authentication Error",
          details: "Invalid email or password",
        });
      }

      // Compare plaintext passwords
      const isPasswordValid = await user.comparePassword(password);

      if (!isPasswordValid) {
        console.log("Password comparison failed");
        return res.status(401).json({
          success: false,
          error: "Authentication Error",
          details: "Invalid email or password",
        });
      }

      // Generate JWT token
      const token = jwt.sign(
        { id: user._id },
        process.env.JWT_SECRET,
        { expiresIn: "10h" }
      );

      res.status(200).json({
        success: true,
        message: "Login successful",
        data: {
          token,
          user: {
            id: user._id,
            fullName: user.fullName,
            username: user.username,
            email: user.email,
            role: user.role,
            walletAddress: user.walletAddress,
          },
        },
      });
    } catch (error) {
      console.error("❌ Login error:", error);
      res.status(500).json({
        success: false,
        error: "Internal Server Error",
        details: error.message,
      });
    }
  },
];

// Get user profile
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) {
      return res.status(404).json({
        success: false,
        error: "Not Found",
        details: "User not found",
      });
    }
    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error("❌ Error fetching user profile:", error);
    res.status(500).json({
      success: false,
      error: "Internal Server Error",
      details: error.message,
    });
  }
};

// Upload profile picture
export const uploadProfilePic = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: "Not Found",
        details: "User not found",
      });
    }

    user.profilePicture = req.file.path;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Profile picture uploaded successfully",
      profilePicture: req.file.path,
    });
  } catch (error) {
    console.error("❌ Error uploading profile picture:", error);
    res.status(500).json({
      success: false,
      error: "Internal Server Error",
      details: error.message,
    });
  }
};

// Save wallet address
export const saveWalletAddress = async (req, res) => {
  const { walletAddress } = req.body;

  if (!walletAddress) {
    return res.status(400).json({
      success: false,
      error: "Validation Error",
      details: "Wallet address is required",
    });
  }

  if (!ethers.utils.isAddress(walletAddress)) {
    return res.status(400).json({
      success: false,
      error: "Validation Error",
      details: "Invalid Ethereum wallet address format",
    });
  }

  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: "Not Found",
        details: "User not found",
      });
    }

    user.walletAddress = walletAddress;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Wallet address saved",
      walletAddress,
    });
  } catch (error) {
    console.error("❌ Error saving wallet address:", error);
    res.status(500).json({
      success: false,
      error: "Internal Server Error",
      details: error.message,
    });
  }
};

// Get wallet address for the logged-in user
export const getWalletAddress = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user || !user.walletAddress) {
      return res.status(404).json({
        success: false,
        error: "Not Found",
        details: "Wallet not found",
      });
    }
    res.status(200).json({
      success: true,
      walletAddress: user.walletAddress,
    });
  } catch (error) {
    console.error("❌ Error fetching wallet address:", error);
    res.status(500).json({
      success: false,
      error: "Internal Server Error",
      details: error.message,
    });
  }
};

// Get wallet address by user ID
export const getWalletAddressByUserId = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user || !user.walletAddress) {
      return res.status(404).json({
        success: false,
        error: "Not Found",
        details: "Wallet not found",
      });
    }
    res.status(200).json({
      success: true,
      walletAddress: user.walletAddress,
    });
  } catch (error) {
    console.error("❌ Error fetching wallet address:", error);
    res.status(500).json({
      success: false,
      error: "Internal Server Error",
      details: error.message,
    });
  }
};