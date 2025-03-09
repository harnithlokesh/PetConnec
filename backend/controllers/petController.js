import Pet from "../models/Pet.js";
import mongoose from "mongoose";

// Input validation middleware
const validatePetInput = (req, res, next) => {
  const { name, age, breed, species, shelterId } = req.body;

  if (!name || !species || !shelterId) {
    return res.status(400).json({
      success: false,
      error: "Validation Error",
      details: "Name, species, and shelter ID are required fields"
    });
  }

  if (age && (isNaN(age) || age < 0)) {
    return res.status(400).json({
      success: false,
      error: "Validation Error",
      details: "Age must be a positive number"
    });
  }

  next();
};

// Create a new pet
export const createPet = [
  validatePetInput,
  async (req, res) => {
    try {
      const { name, age, breed, species, shelterId } = req.body;

      const newPet = new Pet({
        name,
        age,
        breed,
        species,
        shelterId,
        createdBy: req.user.id,
        createdAt: new Date()
      });

      await newPet.save();

      res.status(201).json({
        success: true,
        message: "Pet added successfully",
        data: newPet
      });
    } catch (error) {
      console.error("❌ Error creating pet:", error);
      res.status(500).json({
        success: false,
        error: "Internal Server Error",
        details: error.message
      });
    }
  }
];

// Get all pets with filtering and pagination
export const getAllPets = async (req, res) => {
  try {
    const { species, breed, shelterId, page = 1, limit = 10 } = req.query;

    const filter = {};
    if (species) filter.species = species;
    if (breed) filter.breed = breed;
    if (shelterId) filter.shelterId = shelterId;

    const pets = await Pet.find(filter)
      .populate('shelterId', 'name location')
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await Pet.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: {
        pets,
        pagination: {
          total,
          page: parseInt(page),
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error("❌ Error fetching pets:", error);
    res.status(500).json({
      success: false,
      error: "Internal Server Error",
      details: error.message
    });
  }
};

// Get a pet by ID
export const getPetById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        error: "Validation Error",
        details: "Invalid pet ID format"
      });
    }

    const pet = await Pet.findById(id).populate('shelterId', 'name location');

    if (!pet) {
      return res.status(404).json({
        success: false,
        error: "Not Found",
        details: "Pet not found"
      });
    }

    res.status(200).json({
      success: true,
      data: pet
    });
  } catch (error) {
    console.error("❌ Error fetching pet:", error);
    res.status(500).json({
      success: false,
      error: "Internal Server Error",
      details: error.message
    });
  }
};

// Update a pet
export const updatePet = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        error: "Validation Error",
        details: "Invalid pet ID format"
      });
    }

    if (updates.age && (isNaN(updates.age) || updates.age < 0)) {
      return res.status(400).json({
        success: false,
        error: "Validation Error",
        details: "Age must be a positive number"
      });
    }

    const pet = await Pet.findByIdAndUpdate(
      id,
      { ...updates, updatedAt: new Date() },
      { new: true, runValidators: true }
    ).populate('shelterId', 'name location');

    if (!pet) {
      return res.status(404).json({
        success: false,
        error: "Not Found",
        details: "Pet not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Pet updated successfully",
      data: pet
    });
  } catch (error) {
    console.error("❌ Error updating pet:", error);
    res.status(500).json({
      success: false,
      error: "Internal Server Error",
      details: error.message
    });
  }
};

// Delete a pet
export const deletePet = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        error: "Validation Error",
        details: "Invalid pet ID format"
      });
    }

    const pet = await Pet.findByIdAndDelete(id);

    if (!pet) {
      return res.status(404).json({
        success: false,
        error: "Not Found",
        details: "Pet not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Pet deleted successfully",
      data: pet
    });
  } catch (error) {
    console.error("❌ Error deleting pet:", error);
    res.status(500).json({
      success: false,
      error: "Internal Server Error",
      details: error.message
    });
  }
};
