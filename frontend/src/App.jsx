import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from "react-router-dom";
import LandingPage from "./LandingPage";
import MilestonePage from "./MilestonePage";
import About from "./About";  
import ExplorePets from "./ExplorePets";
import PutYourPetUpForAdoption from "./PutYourPetUpForAdoption";
import Dashboard from "./dashboard";
import AddPet from "./addpet";
import Donate from "./donate";
import Rewards from "./Rewards";
import VantaBackground from "./VantaBackground";
import VantaExplorePets from "./VantaExplorePets";
import Navbar from "./Navbar";
import RegisterPet from "./RegisterPet"; 
import Register from "./Register"; 
import Login from "./Login";
import Profile from "./Profile"; 
import PetDetails from "./PetDetails";
import "./App.css";

function App() {
  return (
    <Router>
      <MainContent />
    </Router>
  );
}

function MainContent() {
  const location = useLocation();

  return (
    <div style={{ position: "relative" }}>
      {/* Show Navbar on all pages except the login and register pages */}
      {!["/login", "/register"].includes(location.pathname) && <Navbar />}

      {location.pathname === "/explore-pets" ? <VantaExplorePets /> : <VantaBackground />}

      <Routes>
        {/* Redirect root path to /register */}
        <Route path="/" element={<Navigate to="/register" />} />

        {/* Other routes */}
        <Route path="/landing" element={<LandingPage />} />
        <Route path="/milestones" element={<MilestonePage />} />
        <Route path="/explore-pets" element={<ExplorePets />} />
        <Route path="/put-pet-up" element={<PutYourPetUpForAdoption />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/add-pet" element={<AddPet />} />
        <Route path="/about" element={<About />} />  
        <Route path="/donate" element={<Donate />} />
        <Route path="/pet/:id" element={<PetDetails />} />
        <Route path="/rewards" element={<Rewards />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/register-pet" element={<RegisterPet />} />
      </Routes>
    </div>
  );
}

export default App;