exports.distributeReward = async (userId, milestoneType) => {
    const rewards = {
      feeding: 5,
      walk: 5,
      playtime: 5,
      vet: 50,
      vaccination: 50,
      grooming: 30,
      training: 40,
      anniversary: 100,
    };
  
    const rewardAmount = rewards[milestoneType] || 0;
  
    // Call ETN API or smart contract function to send reward
    console.log(`Sent ${rewardAmount} ETN to user ${userId}`);
  };
  