import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css"; 

const Navbar = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".profile-container, .dropdown-menu")) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  // Signout: clear token and navigate to login
  const handleSignOut = (e) => {
    e.stopPropagation();
    localStorage.removeItem("token");
    navigate("/login"); // Redirect to the correct login route
  };
  document.addEventListener("DOMContentLoaded", function () {
    const body = document.body;
    const path = window.location.pathname;
  
    if (path === "/") {
      body.classList.add("landing-page");
      body.classList.remove("inner-page");
    } else {
      body.classList.add("inner-page");
      body.classList.remove("landing-page");
    }
  });  
  
  return (
    <header className="header">
      <Link to="/" className="logo-link">
        <img src="/petconnect-logo.png" alt="PetConnect Logo" className="logo" />
      </Link>
      <nav>
        <ul className="nav-links">
          <li><Link to="/about">About</Link></li>
          <li><Link to="/milestones">Milestones</Link></li>
          <li><Link to="/dashboard">Dashboard</Link></li>
          <li><Link to="/rewards">Rewards</Link></li>
        </ul>
      </nav>
      <div
        className="profile-container"
        onClick={(e) => {
          e.stopPropagation();
          setShowDropdown(!showDropdown);
        }}
      >
        <img src="/profile-icon.png" alt="Profile" className="profile-icon" />
        {showDropdown && (
          <div className="dropdown-menu">
            <ul>
            <li><Link to="/profile">Manage Profile</Link></li>
              <li><Link to="/register-pet">Register a Pet</Link></li>
              <li><Link to="/donate">Donate</Link></li>
              <li>
                <button onClick={handleSignOut} className="signout-button">
                  Sign Out
                </button>
              </li>
            </ul>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
