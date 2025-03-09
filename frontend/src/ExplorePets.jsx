import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import VantaExplorePets from "./VantaExplorePets";
import "./ExplorePets.css";

const ExplorePets = () => {
  const navigate = useNavigate();
  const [showBackButton, setShowBackButton] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setShowBackButton(e.clientY < 60);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const handleBack = () => {
    navigate(-1);
  };

  const pets = [
    { id: 1, name: "Buddy", type: "Dog", image: "/dog1.jpg" },
    { id: 2, name: "Whiskers", type: "Cat", image: "/cat1.jpg" },
    { id: 3, name: "Charlie", type: "Rabbit", image: "/rabbit1.jpg" },
    { id: 4, name: "Luna", type: "Dog", image: "/dog2.jpg" },
    { id: 5, name: "Mittens", type: "Cat", image: "/cat2.jpg" },
    { id: 6, name: "Daisy", type: "Rabbit", image: "/rabbit2.jpg" },
    { id: 7, name: "Rocky", type: "Dog", image: "/dog3.jpg" },
    { id: 8, name: "Snowball", type: "Cat", image: "/cat3.jpg" },
    { id: 9, name: "Coco", type: "Rabbit", image: "/rabbit3.jpg" },
    { id: 10, name: "Rex", type: "Dog", image: "/dog4.jpg" },
    { id: 11, name: "Shadow", type: "Cat", image: "/cat4.jpg" },
    { id: 12, name: "Pumpkin", type: "Rabbit", image: "/rabbit4.jpg" },
  ];

  return (
    <div className="explore-pets-page">
      <VantaExplorePets />

      {/* Back Button */}
      {showBackButton && (
        <button className="back-button" onClick={handleBack}>⬅</button>
      )}

      <div className="explore-pets-container">
        <h2>Meet Your New Best Friend</h2>
        <div className="pets-list">
          {pets.map((pet) => (
            <div key={pet.id} className="pet-card">
              <img src={pet.image} alt={pet.name} className="pet-image" />
              <h3>{pet.name}</h3>
              <p>{pet.type}</p>
              <Link to={`/pet/${pet.id}`} className="view-details-button">
                View Details
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ExplorePets;
