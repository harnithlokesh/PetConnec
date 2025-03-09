import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  profilePicture: String,
  fullName: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String },
  password: { type: String, required: true }, // Plaintext password
  role: { type: String, required: true, default: "user" },
  walletAddress: { type: String, unique: true, index: true },
  pets: [
    {
      name: String,
      breed: String,
      age: Number,
      vaccinations: [String],
      adoptionStatus: { type: String, enum: ["Available", "Adopted"], default: "Available" },
    },
  ],
  adoptionPreferences: {
    petType: [String],
    ageRange: String,
    location: String,
    adoptionHistory: [{ petName: String, date: Date }],
  },
}, { timestamps: true });

// Compare entered password with the plaintext password in the database
userSchema.methods.comparePassword = async function (enteredPassword) {
  try {
    console.log("Entered Password:", enteredPassword);
    console.log("Stored Password:", this.password);
    return enteredPassword === this.password; // Direct comparison
  } catch (error) {
    console.error("❌ Error comparing passwords:", error);
    throw error;
  }
};

const User = mongoose.model("User", userSchema);
export default User;