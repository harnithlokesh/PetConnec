import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Profile.css";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profilePic, setProfilePic] = useState(null);
  const [updatedUser, setUpdatedUser] = useState({});
  const [password, setPassword] = useState({ current: "", new: "" });
  const [pets, setPets] = useState([]);
  const [editingPet, setEditingPet] = useState(null);
  const [adoptionHistory, setAdoptionHistory] = useState([]);
  const [newPet, setNewPet] = useState({ name: "", breed: "", age: "", vaccinated: false });
  const [adoptionPreferences, setAdoptionPreferences] = useState({ petType: "", breed: "", location: "" });
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [error, setError] = useState("");

  // Fetch user profile data
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("/api/users/profile", { headers: { Authorization: `Bearer ${token}` } });
        setUser(res.data);
        setUpdatedUser(res.data);
        setPets(res.data.pets || []);
        setAdoptionPreferences(res.data.adoptionPreferences || {});
        setAdoptionHistory(res.data.adoptionHistory || []);
        setMessages(res.data.messages || []);
        setProfilePic(res.data.profilePic || null);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching profile:", error);
        setError("Failed to load profile. Please try again later.");
        setLoading(false);
      }
    };
    fetchUserProfile();
  }, []);

  // Handle input changes for user info
  const handleInputChange = (e) => {
    setUpdatedUser({ ...updatedUser, [e.target.name]: e.target.value });
  };

  // Handle input changes for pet info
  const handlePetChange = (e) => {
    setNewPet({ ...newPet, [e.target.name]: e.target.value });
  };

  // Handle input changes for adoption preferences
  const handlePreferenceChange = (e) => {
    setAdoptionPreferences({ ...adoptionPreferences, [e.target.name]: e.target.value });
  };

  // Update user profile
  const handleProfileUpdate = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.put("/api/users/profile", updatedUser, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data);
      setError("");
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      setError("Failed to update profile. Please try again.");
    }
  };

  // Change password
  const handlePasswordChange = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.put("/api/users/change-password", password, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setError("");
      alert("Password updated successfully!");
    } catch (error) {
      console.error("Error changing password:", error);
      setError("Failed to change password. Please try again.");
    }
  };

  // Add a new pet
  const handlePetUpload = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post("/api/users/add-pet", newPet, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPets([...pets, res.data]);
      setNewPet({ name: "", breed: "", age: "", vaccinated: false });
      setError("");
      alert("Pet added successfully!");
    } catch (error) {
      console.error("Error adding pet:", error);
      setError("Failed to add pet. Please try again.");
    }
  };

  // Delete user account
  const handleDeleteAccount = async () => {
    if (!window.confirm("Are you sure you want to delete your account? This action is irreversible!")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete("/api/users/delete", {
        headers: { Authorization: `Bearer ${token}` },
      });
      localStorage.removeItem("token");
      alert("Account deleted successfully!");
      window.location.href = "/";
    } catch (error) {
      console.error("Error deleting account:", error);
      setError("Failed to delete account. Please try again.");
    }
  };

  // Upload profile picture
  const handleProfilePicUpload = async (file) => {
    const formData = new FormData();
    formData.append("profilePic", file); // Key must match backend

    try {
        const res = await fetch("http://localhost:5000/uploadProfilePic", {
            method: "POST",
            body: formData,
        });

        const data = await res.json();
        console.log(data);
    } catch (error) {
        console.error("Upload failed:", error);
    }
  };

  // Edit pet details
  const handleEditPet = (index) => {
    setEditingPet(index);
  };

  // Save edited pet details
  const handleSavePet = async (index) => {
    const originalPet = pets[index];
    const updatedPet = pets[editingPet];

    if (
      originalPet.name === updatedPet.name &&
      originalPet.breed === updatedPet.breed &&
      originalPet.age === updatedPet.age
    ) {
      setEditingPet(null);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.put("/api/users/update-pet", updatedPet, { headers: { Authorization: `Bearer ${token}` } });
      setEditingPet(null);
      setError("");
      alert("Pet details updated!");
    } catch (error) {
      console.error("Error updating pet:", error);
      setError("Failed to update pet details. Please try again.");
    }
  };

  // Cancel editing pet details
  const handleCancelEdit = () => {
    setEditingPet(null);
  };

  // Send a message
  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post("/api/messages/send", { text: newMessage }, { headers: { Authorization: `Bearer ${token}` } });
      setMessages([...messages, res.data]);
      setNewMessage("");
      setError("");
    } catch (error) {
      console.error("Error sending message:", error);
      setError("Failed to send message. Please try again.");
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="profile-page">
      <div className="profile-header">
        <h1>User Profile</h1>
      </div>

      {/* Error Message Display */}
      {error && <div className="error-message">{error}</div>}

      {/* Profile Picture */}
      <div className="profile-picture-section">
        <label>Profile Picture:</label>
        <input type="file" onChange={handleProfilePicUpload} />
        {profilePic && <img src={profilePic} alt="Profile Preview" className="profile-picture" />}
      </div>

      {/* User Info */}
      <div className="user-info-section">
        <input name="fullName" value={updatedUser.fullName} onChange={handleInputChange} placeholder="Full Name" />
        <input name="username" value={updatedUser.username} onChange={handleInputChange} placeholder="Username" />
        <input name="email" value={updatedUser.email} readOnly placeholder="Email (non-editable)" />
        <input name="phone" value={updatedUser.phone} onChange={handleInputChange} placeholder="Phone Number" />
        <button onClick={handleProfileUpdate}>Update Profile</button>
      </div>

      {/* Pets Section */}
      <div className="pets-section">
        <h2>My Pets</h2>
        {pets.length > 0 ? (
          pets.map((pet, index) => (
            <div key={pet._id || index} className="pet-card">
              {editingPet === index ? (
                <>
                  <input name="name" value={pet.name} onChange={(e) => { let updatedPets = [...pets]; updatedPets[index].name = e.target.value; setPets(updatedPets); }} placeholder="Pet Name" />
                  <input name="breed" value={pet.breed} onChange={(e) => { let updatedPets = [...pets]; updatedPets[index].breed = e.target.value; setPets(updatedPets); }} placeholder="Breed" />
                  <input name="age" value={pet.age} onChange={(e) => { let updatedPets = [...pets]; updatedPets[index].age = e.target.value; setPets(updatedPets); }} placeholder="Age" />
                  <button onClick={() => handleSavePet(index)}>Save</button>
                  <button onClick={handleCancelEdit}>Cancel</button>
                </>
              ) : (
                <>
                  <p><strong>Name:</strong> {pet.name}</p>
                  <p><strong>Species:</strong> {pet.species}</p>
                  <p><strong>Breed:</strong> {pet.breed}</p>
                  <p><strong>Age:</strong> {pet.age}</p>
                  <p><strong>Location:</strong> {pet.location}</p>
                  {pet.image && <img src={pet.image} alt={pet.name} className="pet-image" />}
                  <button onClick={() => handleEditPet(index)}>Edit</button>
                </>
              )}
            </div>
          ))
        ) : (
          <p>No pets registered yet.</p>
        )}
      </div>

      {/* Add New Pet */}
      <div className="add-pet-section">
        <h3>Add New Pet</h3>
        <input name="name" value={newPet.name} onChange={handlePetChange} placeholder="Pet Name" />
        <input name="breed" value={newPet.breed} onChange={handlePetChange} placeholder="Breed" />
        <input name="age" value={newPet.age} onChange={handlePetChange} placeholder="Age" />
        <button onClick={handlePetUpload}>Add Pet</button>
      </div>

      {/* Adoption Preferences */}
      <div className="adoption-preferences-section">
        <h2>Adoption Preferences</h2>
        <input name="petType" value={adoptionPreferences.petType} onChange={handlePreferenceChange} placeholder="Preferred Pet Type" />
        <input name="breed" value={adoptionPreferences.breed} onChange={handlePreferenceChange} placeholder="Breed Preference" />
        <input name="location" value={adoptionPreferences.location} onChange={handlePreferenceChange} placeholder="Preferred Location" />
      </div>

      {/* Adoption Interest Count */}
      <div className="adoption-history-section">
        <h2>Adoption Interest</h2>
        {pets.map((pet) => (
          <p key={pet._id}>{pet.name} has {pet.interestCount || 0} adoption interests.</p>
        ))}
      </div>

      {/* Adoption History */}
      <div className="adoption-history-section">
        <h2>Adoption History</h2>
        {adoptionHistory.length > 0 ? (
          adoptionHistory.map((record) => (
            <p key={record._id}>{record.petName} was adopted on {record.date}.</p>
          ))
        ) : (
          <p>No past adoptions.</p>
        )}
      </div>

      {/* Messaging Section */}
      <div className="messaging-section">
        <h2>Messages</h2>
        <div className="messages-container">
          {messages.length > 0 ? (
            messages.map((msg) => <p key={msg._id}>{msg.text}</p>)
          ) : (
            <p>No messages yet.</p>
          )}
          <input type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} placeholder="Type a message..." />
          <button onClick={handleSendMessage}>Send</button>
        </div>
      </div>

      {/* Security & Account Management */}
      <div className="security-section">
        <h2>Security & Account</h2>
        <input
          type="password"
          placeholder="New Password"
          onChange={(e) => setPassword({ ...password, new: e.target.value })}
        />
        <div className="button-container">
          <button onClick={handlePasswordChange}>Change Password</button>
          <button onClick={handleDeleteAccount}>Delete Account</button>
        </div>
      </div>
    </div>
  );
};

export default Profile;