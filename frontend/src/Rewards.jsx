import React, { useState, useEffect } from "react";
import { ethers } from "ethers"; // For wallet address validation and interaction

const Rewards = () => {
  const [walletAddress, setWalletAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [totalRewards, setTotalRewards] = useState(0);
  const [network, setNetwork] = useState("Ethereum Testnet");
  const [activity, setActivity] = useState("Completing tasks"); // Example activity

  const [user, setUser] = useState(null);
  const [selectedPetId, setSelectedPetId] = useState(null);
  const [milestoneId, setMilestoneId] = useState(null);

  // Load user data from localStorage
  useEffect(() => {
    try {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      if (storedUser) {
        setUser(storedUser);
      } else {
        setError("User data not found in localStorage. Please log in again.");
      }
    } catch (error) {
      console.error("❌ Error parsing user data from localStorage:", error);
      setError("Failed to load user data. Please log in again.");
    }
  }, []);

  // Fetch wallet address from the backend
  const fetchWalletAddress = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found. Please log in again.");
      }

      const response = await fetch("/api/wallet", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to fetch wallet address: ${errorText}`);
      }

      const data = await response.json();
      console.log("Wallet address fetched:", data.walletAddress);
      setWalletAddress(data.walletAddress);
    } catch (error) {
      console.error("❌ Error fetching wallet address:", error);
      setError(error.message);
      // Redirect to login page if token is missing
      if (error.message.includes("No token found")) {
        window.location.href = "/login";
      }
    }
  };

  // Connect to MetaMask
  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        throw new Error("MetaMask or another Ethereum wallet is not installed.");
      }

      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const walletAddress = accounts[0];
      console.log("Wallet connected:", walletAddress);
      setWalletAddress(walletAddress);

      // Get network name
      const provider = new ethers.BrowserProvider(window.ethereum); // Updated for ethers v6
      const network = await provider.getNetwork();
      setNetwork(network.name === "unknown" ? "Ethereum Testnet" : network.name);
    } catch (error) {
      console.error("❌ Error connecting wallet:", error);
      setError("Failed to connect wallet. Please install MetaMask or another Ethereum wallet.");
    }
  };

  // Fetch total rewards from the backend
  const fetchTotalRewards = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found. Please log in again.");
      }

      const response = await fetch("/api/rewards/total", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to fetch total rewards: ${errorText}`);
      }

      const data = await response.json();
      setTotalRewards(data.totalRewards);
    } catch (error) {
      console.error("❌ Error fetching total rewards:", error);
      setError(error.message);
      // Redirect to login page if token is missing
      if (error.message.includes("No token found")) {
        window.location.href = "/login";
      }
    }
  };

  // Handle reward claim
  const handleClaimReward = async () => {
    if (!user) {
      setError("User data is not available.");
      return;
    }

    if (!selectedPetId || !milestoneId) {
      setError("Please select a pet and milestone.");
      return;
    }

    const rewardData = {
      userId: user._id,
      petId: selectedPetId,
      milestoneId: milestoneId,
      amount: 10,
    };

    console.log("📤 Sending Data:", rewardData);

    try {
      const response = await fetch("http://localhost:5000/api/rewards/claim", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(rewardData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(`Failed to claim reward: ${JSON.stringify(data)}`);
      }

      console.log("✅ Reward claimed successfully!", data);
    } catch (error) {
      console.error("❌ Error claiming reward:", error);
    }
  };

  // Copy wallet address to clipboard
  const copyWalletAddress = () => {
    navigator.clipboard.writeText(walletAddress);
    alert("Wallet address copied to clipboard!");
  };

  // Fetch wallet address and total rewards on component mount
  useEffect(() => {
    fetchWalletAddress();
    fetchTotalRewards();
  }, []);

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>Rewards Dashboard</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Connect Wallet Button */}
      <button
        onClick={connectWallet}
        disabled={!!walletAddress}
        style={{
          padding: "10px 20px",
          backgroundColor: walletAddress ? "green" : "blue",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        {walletAddress ? "Wallet Connected" : "Connect Wallet"}
      </button>

      {/* Display Wallet Address */}
      {walletAddress && (
        <div style={{ marginTop: "20px" }}>
          <p>
            Wallet Address: {`${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`}
            <button
              onClick={copyWalletAddress}
              style={{
                marginLeft: "10px",
                padding: "5px 10px",
                backgroundColor: "gray",
                color: "white",
                border: "none",
                borderRadius: "3px",
                cursor: "pointer",
              }}
            >
              Copy
            </button>
          </p>
        </div>
      )}

      {/* Display Network */}
      <div style={{ marginTop: "20px" }}>
        <p>Network: {network}</p>
      </div>

      {/* Display Total Rewards */}
      <div style={{ marginTop: "20px" }}>
        <p>Total Rewards Sent: {totalRewards}</p>
      </div>

      {/* Display Activity */}
      <div style={{ marginTop: "20px" }}>
        <p>Activity: {activity}</p>
      </div>

      {/* Select Pet ID */}
      <div style={{ marginTop: "20px" }}>
        <label>Select Pet ID: </label>
        <input
          type="text"
          value={selectedPetId || ""}
          onChange={(e) => setSelectedPetId(e.target.value)}
          placeholder="Enter Pet ID"
        />
      </div>

      {/* Select Milestone ID */}
      <div style={{ marginTop: "20px" }}>
        <label>Select Milestone ID: </label>
        <input
          type="text"
          value={milestoneId || ""}
          onChange={(e) => setMilestoneId(e.target.value)}
          placeholder="Enter Milestone ID"
        />
      </div>

      {/* Claim Reward Button */}
      <button
        onClick={handleClaimReward}
        disabled={loading}
        style={{
          marginTop: "20px",
          padding: "10px 20px",
          backgroundColor: "orange",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        {loading ? "Claiming..." : "Claim Reward"}
      </button>
    </div>
  );
};

export default Rewards;