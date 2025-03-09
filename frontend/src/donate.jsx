import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./donate.css";

const Donate = () => {
  const [amount, setAmount] = useState("");
 
  const handleDonate = () => {
    alert(`You have donated ${amount} ETN. Thank you!`);
    setAmount(""); // Clear input field after donation
  };

  return (
    <div className="donate-container">
      <h1>Donate ETN</h1>
      <p>Support pet adoption by donating ETN.</p>
      
      <label htmlFor="donation-amount">Enter amount:</label>
      <input
        type="number"
        id="donation-amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Enter ETN amount"
      />

      <button onClick={handleDonate} className="donate-button">Donate</button>

      <Link to="/dashboard" className="back-button">Back to Dashboard</Link>
    </div>
  );
};

export default Donate;
