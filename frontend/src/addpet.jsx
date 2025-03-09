import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./addpet.css"; // Add styles for this page

const AddPet = () => {
  const [petName, setPetName] = useState("");
  const [petType, setPetType] = useState("Dog"); // Default pet type
  const [petAge, setPetAge] = useState("");
  const [petDescription, setPetDescription] = useState("");

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const petData = {
      name: petName,
      type: petType,
      age: petAge,
      description: petDescription,
    };

    console.log("New Pet Added:", petData);
    
    // Here, you can send this data to a backend or store it in local state

    alert("Pet added successfully!");
    navigate("/"); // Redirect back to dashboard after adding pet
  };

  return (
    <div className="add-pet-container">
      <h2>Add a New Pet</h2>
      <form onSubmit={handleSubmit}>
        <label>Pet Name:</label>
        <input
          type="text"
          value={petName}
          onChange={(e) => setPetName(e.target.value)}
          required
        />

        <label>Pet Type:</label>
        <select value={petType} onChange={(e) => setPetType(e.target.value)}>
          <option value="Dog">Dog</option>
          <option value="Cat">Cat</option>
          <option value="Bird">Bird</option>
          <option value="Fish">Fish</option>
          <option value="Other">Other</option>
        </select>

        <label>Pet Age (in years):</label>
        <input
          type="number"
          value={petAge}
          onChange={(e) => setPetAge(e.target.value)}
          required
        />

        <label>Pet Description:</label>
        <textarea
          value={petDescription}
          onChange={(e) => setPetDescription(e.target.value)}
          required
        ></textarea>

        <button type="submit">Add Pet</button>
      </form>
    </div>
  );
};

export default AddPet;
