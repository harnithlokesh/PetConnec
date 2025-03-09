import React, { useState } from "react";
import axios from "axios";
import "./RegisterPet.css";

const RegisterPet = () => {
  const [petDetails, setPetDetails] = useState({
    name: "",
    age: "",
    breed: "",
    description: "",
    location: "",
    image: null,
  });

  const handleChange = (e) => {
    setPetDetails({ ...petDetails, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (e) => {
    setPetDetails({ ...petDetails, image: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    for (const key in petDetails) {
      formData.append(key, petDetails[key]);
    }

    try {
      const response = await axios.post("http://localhost:5000/api/pets", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (!response.data.success) {
        throw new Error(response.data.message || "Error registering pet");
      }

      alert("Pet registered successfully!");
      setPetDetails({
        name: "",
        age: "",
        breed: "",
        description: "",
        location: "",
        image: null,
      });
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  return (
    <div className="register-pet-container">
      <h2>Register a Pet</h2>
      <form onSubmit={handleSubmit} className="register-pet-form">
        <label>Pet Name:</label>
        <input
          type="text"
          name="name"
          value={petDetails.name}
          onChange={handleChange}
          required
        />

        <label>Age:</label>
        <input
          type="number"
          name="age"
          value={petDetails.age}
          onChange={handleChange}
          required
        />

        <label>Breed:</label>
        <input
          type="text"
          name="breed"
          value={petDetails.breed}
          onChange={handleChange}
          required
        />

        <label>Description:</label>
        <textarea
          name="description"
          value={petDetails.description}
          onChange={handleChange}
          required
        ></textarea>

        <label>Location:</label>
        <input
          type="text"
          name="location"
          value={petDetails.location}
          onChange={handleChange}
          required
        />

        <label>Upload Image:</label>
        <input type="file" accept="image/*" onChange={handleImageUpload} required />

        <button type="submit" className="submit-button">Register Pet</button>
      </form>
    </div>
  );
};

export default RegisterPet;
