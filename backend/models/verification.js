import mongoose from "mongoose";

const verificationSchema = new mongoose.Schema({
  milestone: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Milestone",
    required: true
  },
  verifier: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  status: {
    type: String,
    enum: ["approved", "rejected", "pending"],
    required: true
  },
  comments: {
    type: String,
    required: function() {
      return this.status === "rejected";
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  evidence: {
    type: String, // URL or file path to verification evidence
    required: false
  },
  verificationMethod: {
    type: String,
    enum: ["manual", "automated", "blockchain"],
    default: "manual"
  },
  metadata: {
    type: Map,
    of: mongoose.Schema.Types.Mixed,
    default: new Map()
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Index for faster queries
verificationSchema.index({ milestone: 1, verifier: 1 }, { unique: true });
verificationSchema.index({ status: 1 });
verificationSchema.index({ createdAt: -1 });

// Virtual for time since verification
verificationSchema.virtual('timeSinceVerification').get(function() {
  return Date.now() - this.createdAt;
});

// Middleware to validate comments for rejected status
verificationSchema.pre('save', function(next) {
  if (this.status === 'rejected' && !this.comments) {
    next(new Error('Comments are required when rejecting a verification'));
  }
  next();
});

// Static method to find latest verification for a milestone
verificationSchema.statics.findLatestForMilestone = function(milestoneId) {
  return this.findOne({ milestone: milestoneId })
    .sort({ createdAt: -1 })
    .populate('verifier', 'fullName email');
};

// Instance method to check if verification is recent
verificationSchema.methods.isRecent = function(hours = 24) {
  const hoursInMs = hours * 60 * 60 * 1000;
  return (Date.now() - this.createdAt) < hoursInMs;
};

const Verification = mongoose.model("Verification", verificationSchema);

export default Verification;