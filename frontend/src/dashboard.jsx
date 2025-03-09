import { useState, useEffect } from "react";
import "./dashboard.css"; // Ensure this import is present

const Dashboard = () => {
  const [shelters, setShelters] = useState([
    { _id: "1", name: "Happy Paws Shelter", location: "New York" },
    { _id: "2", name: "Furry Friends Haven", location: "Los Angeles" },
    { _id: "3", name: "Safe Haven for Pets", location: "Chicago" },
  ]); // Dummy data for shelters
  const [newShelter, setNewShelter] = useState({ name: "", location: "" });
  const [isAdmin, setIsAdmin] = useState(false); // Set to false for non-admin users by default

  useEffect(() => {
    fetchShelters();
  }, []);

  const fetchShelters = async () => {
    try {
      const response = await fetch('/api/shelters', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const shelters = await response.json();
      console.log('Shelters:', shelters); // Log the parsed JSON

      setShelters(shelters.data.shelters);
    } catch (error) {
      console.error('Error fetching shelters:', error);
    }
  };

  const addShelter = async () => {
    if (!isAdmin) {
      alert("Only admins can add a shelter.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/shelters", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newShelter),
      });
      if (response.ok) {
        fetchShelters();
        setNewShelter({ name: "", location: "" });
      }
    } catch (error) {
      console.error("Error adding shelter:", error);
    }
  };

  const deleteShelter = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/shelters/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        fetchShelters();
      }
    } catch (error) {
      console.error("Error deleting shelter:", error);
    }
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-box">
        <h1 className="text-3xl font-bold mb-4">🐾 Adoption Dashboard</h1>

        {/* Stats Section */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="stat-card bg-blue-200">
            <h2>Pets Adopted</h2>
            <p>50+</p>
          </div>
          <div className="stat-card bg-green-200">
            <h2>Pets in Care</h2>
            <p>30+</p>
          </div>
          <div className="stat-card bg-yellow-200">
            <h2>Pending Requests</h2>
            <p>10+</p>
          </div>
        </div>

        {/* Add Shelter Form (Visible to All, but Only Admins Can Add) */}
        <div className="add-shelter-form">
          <h3>➕ Add a Shelter</h3>
          <input
            type="text"
            placeholder="Shelter Name"
            className="input-field"
            value={newShelter.name}
            onChange={(e) => setNewShelter({ ...newShelter, name: e.target.value })}
          />
          <input
            type="text"
            placeholder="Location"
            className="input-field"
            value={newShelter.location}
            onChange={(e) => setNewShelter({ ...newShelter, location: e.target.value })}
          />
          <button className="add-btn" onClick={addShelter}>
            Add Shelter
          </button>
          {!isAdmin && (
            <p className="text-red-500 mt-2">Only admins can add a shelter.</p>
          )}
        </div>

        {/* List of All Shelters with Locations */}
        <div className="all-shelters-list">
          <h3>🏡 List of All Shelters</h3>
          <ul>
            {shelters.map((shelter) => (
              <li key={shelter._id} className="shelter-card">
                <span>{shelter.name} - {shelter.location}</span>
                {isAdmin && (
                  <button className="delete-btn" onClick={() => deleteShelter(shelter._id)}>
                    Remove
                  </button>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;