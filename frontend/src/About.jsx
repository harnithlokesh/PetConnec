import React from "react";
import "./About.css"; // Ensure this file is imported

const About = () => {
  return (
    <div className="about-container">
      <div className="about-box">  {/* Ensure this div is present */}
        <h1>About Us</h1>
        <p>Welcome to PetConnect! We aim to connect pets with loving families.</p>
        <p>
          Our platform helps people adopt pets, put their pets up for adoption, 
          and contribute to a growing community of pet lovers.
        </p>
      </div>
    </div>
  );
};

export default About;
        