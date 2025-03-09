import mongoose from "mongoose";

const shelterSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true, index: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date }
}, { timestamps: true });

const Shelter = mongoose.model("Shelter", shelterSchema);
export default Shelter;
