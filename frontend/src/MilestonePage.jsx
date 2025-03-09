import React, { useState, useEffect } from "react";
import "./MilestonePage.css";
import axios from "axios";

const typesRequiringProof = ["Checkup", "Vaccination", "Grooming", "Training"];

const MilestonePage = () => {
  const [petName, setPetName] = useState("");
  const [type, setType] = useState("Feeding Log");
  const [date, setDate] = useState(new Date().toISOString().substring(0, 16));
  const [details, setDetails] = useState("");
  const [proofFile, setProofFile] = useState(null);
  const [status, setStatus] = useState("pending");
  const [milestones, setMilestones] = useState([]);
  const [formError, setFormError] = useState(null);
  const [formSuccess, setFormSuccess] = useState(null);

  // Get the JWT token from localStorage
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchMilestones();
  }, []);

  const fetchMilestones = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/milestones", {
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in the headers
        },
      });
      setMilestones(response.data.data.milestones);
    } catch (error) {
      console.error("Error fetching milestones:", error.response?.data || error.message);
      if (error.response?.status === 401) {
        setFormError("Unauthorized: Please log in again.");
      }
    }
  };

  const handleFileChange = (e) => {
    setProofFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);
    setFormSuccess(null);

    if (!token) {
      setFormError("User not authenticated. Please log in.");
      return;
    }

    if (typesRequiringProof.includes(type) && !proofFile) {
      setFormError("Proof is required for the selected milestone type.");
      return;
    }

    const formData = new FormData();
    formData.append("petName", petName);
    formData.append("type", type);
    formData.append("date", new Date(date).toISOString());
    formData.append("details", details);
    formData.append("status", status);
    if (proofFile) {
      formData.append("proof", proofFile);
    }

    try {
      const response = await axios.post("http://localhost:5000/api/milestones", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`, // Include the token in the headers
        },
      });

      if (!response.data.success) {
        throw new Error(response.data.message || "Error creating milestone");
      }

      setFormSuccess("Milestone submitted successfully!");
      setPetName("");
      setType("Feeding Log");
      setDate(new Date().toISOString().substring(0, 16));
      setDetails("");
      setProofFile(null);
      setStatus("pending");

      fetchMilestones();
    } catch (err) {
      setFormError(err.response?.data?.details || err.message);
    }
  };

  return (
    <div className="milestone-container">
      <h2>Pet Milestone Tracker</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Pet Name" value={petName} onChange={(e) => setPetName(e.target.value)} required />
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="Feeding Log">Feeding Log</option>
          <option value="Walk Tracking">Walk Tracking</option>
          <option value="Playtime Proof">Playtime Proof</option>
          <option value="Health Check">Health Check</option>
          <option value="Checkup">Checkup</option>
          <option value="Vaccination">Vaccination</option>
          <option value="Grooming">Grooming</option>
          <option value="Training">Training</option>
          <option value="Adoption Anniversary">Adoption Anniversary</option>
        </select>
        <input type="datetime-local" value={date} onChange={(e) => setDate(e.target.value)} required />
        <textarea placeholder="Details" value={details} onChange={(e) => setDetails(e.target.value)} required></textarea>
        {typesRequiringProof.includes(type) && (
          <input type="file" onChange={handleFileChange} required />
        )}
        <button type="submit">Submit Milestone</button>
      </form>
      {formError && <p className="error">{formError}</p>}
      {formSuccess && <p className="success">{formSuccess}</p>}
      <div className="milestones-list">
        <h3>Milestones</h3>
        <ul>
          {milestones.map((milestone) => (
            <li key={milestone._id}>
              {milestone.petName} - {milestone.type} - {milestone.status}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default MilestonePage;