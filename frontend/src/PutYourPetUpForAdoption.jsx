import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; 
import "./PutYourPetUpForAdoption.css";

const PutYourPetUpForAdoption = () => {
  const [formData, setFormData] = useState({
    name: "",
    breed: "",
    species: "",
    age: "",
  });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const data = new FormData();
    data.append("name", formData.name);
    data.append("breed", formData.breed);
    data.append("species", formData.species);
    data.append("age", formData.age);
    if (image) {
      data.append("image", image);
    }
    // Include a dummy shelterId (replace with actual shelter id from auth context)
    data.append("shelterId", "dummyShelterId");

    fetch("/api/pets", {
      method: "POST",
      body: data,
    })
      .then((res) => {
        if (!res.ok) {
          return res.json().then((data) => {
            throw new Error(data.message || "Error adding pet");
          });
        }
        return res.json();
      })
      .then((data) => {
        setSuccess("Pet added successfully!");
        setFormData({
          name: "",
          breed: "",
          species: "",
          age: "",
        });
        setImage(null);
        setImagePreview(null);
      })
      .catch((err) => {
        setError(err.message);
      });
  };

  return (
    <div className="put-your-pet-page">
      <div className="put-pet-container">
        <button className="back-button" onClick={() => navigate(-1)}>
          &larr; Back
        </button>

        <h2>Put Your Pet Up for Adoption</h2>
        
        {error && <p className="error">{error}</p>}
        {success && <p className="success">{success}</p>}
        
        <form className="put-pet-form" onSubmit={handleSubmit}>
          <label>Pet's Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <label>Breed:</label>
          <input
            type="text"
            name="breed"
            value={formData.breed}
            onChange={handleChange}
            required
          />

          <label>Species:</label>
          <input
            type="text"
            name="species"
            value={formData.species}
            onChange={handleChange}
            required
          />

          <label>Pet's Age:</label>
          <input
            type="number"
            name="age"
            value={formData.age}
            onChange={handleChange}
            required
          />

          <label>Upload Photo:</label>
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleFileChange}
            required
          />

          {imagePreview && (
            <div className="image-preview">
              <img src={imagePreview} alt="Pet Preview" />
            </div>
          )}

          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
};

export default PutYourPetUpForAdoption;
