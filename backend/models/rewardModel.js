import mongoose from "mongoose";

const rewardSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true, // Index for better query performance
  },
  petId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Pet",
    required: true,
  },
  milestoneId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Milestone",
    required: false, // Make it optional if not always required
    index: true, // Index for better query performance
  },
  amount: {
    type: Number,
    required: true,
  },
  transactionHash: {
    type: String,
  },
  status: {
    type: String,
    enum: ["pending", "sent", "failed"],
    default: "pending",
  },
}, { timestamps: true });

const Reward = mongoose.model("Reward", rewardSchema);
export default Reward;
