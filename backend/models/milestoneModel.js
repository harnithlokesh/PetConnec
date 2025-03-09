import mongoose from "mongoose";

const milestoneSchema = new mongoose.Schema(
  {
    petName: {
      type: String,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true, // Index for better query performance
    },
    type: {
      type: String,
      required: true,
      enum: [
        "Feeding Log",
        "Walk Tracking",
        "Playtime Proof",
        "Health Check",
        "Checkup",
        "Vaccination",
        "Grooming",
        "Training",
        "Adoption Anniversary",
      ],
    },
    date: {
      type: Date,
      required: true,
      validate: {
        validator: function (value) {
          return value <= new Date();
        },
        message: "Date cannot be in the future",
      },
    },
    details: {
      type: String,
      required: false,
    },
    proof: {
      type: String,
      required: function () {
        return ["Checkup", "Vaccination", "Grooming", "Training"].includes(this.type);
      },
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    verifierId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
      index: true, // Index for better query performance
    },
    rejectionReason: {
      type: String,
      required: function () {
        return this.status === "rejected";
      },
    },
    rewardAmount: {
      type: Number,
      default: 0,
    },
    txHash: {
      type: String,
      required: false,
    },
    completed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Milestone = mongoose.model("Milestone", milestoneSchema);
export default Milestone;
