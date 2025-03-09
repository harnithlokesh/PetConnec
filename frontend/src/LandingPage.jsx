import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./LandingPage.css";

const LandingPage = () => {
  const [showVideoPopup, setShowVideoPopup] = useState(false);
  const navigate = useNavigate();
 
  return (
    <div className="landing-container">
      <section className="hero">
        <div className="hero-content">
          <h2>Find Your New Best Friend</h2>
          <p>Bringing love and companionship to every home.</p>
          {/* Navigation buttons */}
          <Link to="/explore-pets" className="cta-button">Explore Pets</Link>
          <button 
            className="adopt-button" 
            onClick={() => navigate("/put-pet-up")}
          >
            Put Your Pet for Adoption
          </button>
          <button 
            className="video-button" 
            onClick={() => setShowVideoPopup(true)}
          >
            What Adoption Can Do
          </button>
        </div>
      </section>

      {/* Video Popup */}
      {showVideoPopup && (
        <div className="video-popup active">
          <span className="close-popup" onClick={() => setShowVideoPopup(false)}>&times;</span>
          <div className="video-container">
            <iframe 
              width="560" 
              height="315" 
              src="https://www.youtube.com/embed/YWGzaqigAo8?autoplay=1" 
              title="YouTube video player" 
              frameBorder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowFullScreen
            ></iframe>
          </div>
        </div>
      )}
    </div>
  );
};

export default LandingPage;
