import mongoose from "mongoose";

const petSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number, required: true },
  breed: { type: String, required: true },
  species: { type: String, required: true }, // Dog, Cat, etc.
  shelterId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true }, // Shelters
  status: { type: String, enum: ["available", "adopted"], default: "available" },
  adoptionRequests: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Users who applied for adoption
  createdAt: { type: Date, default: Date.now },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
}, { timestamps: true });

const Pet = mongoose.model("Pet", petSchema);
export default Pet;
