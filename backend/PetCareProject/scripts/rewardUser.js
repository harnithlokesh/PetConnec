const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  const dummyTokenAddress = "0x10b54056d12E2111cDbBa9fcED1Afb8709123A2d"; // DummyToken address
  const petCareRewardsAddress = "0x91E4dBD42a8b2E4A6Bac576731D24499b58dD85d"; // PetCareRewards address

  const DummyToken = await hre.ethers.getContractFactory("DummyToken");
  const dummyToken = DummyToken.attach(dummyTokenAddress);

  const PetCareRewards = await hre.ethers.getContractFactory("PetCareRewards");
  const petCareRewards = PetCareRewards.attach(petCareRewardsAddress);

  const userWallet = "0x330bFAD11f79581C778627b541d344198F4959d7"; // User wallet address

  // Get reserve wallet address
  const reserveWallet = await petCareRewards.reserveWallet();

  // Check initial balances
  const initialReserveBalance = await dummyToken.balanceOf(reserveWallet);
  const initialUserBalance = await dummyToken.balanceOf(userWallet);

  console.log("Initial Reserve Wallet Balance:", hre.ethers.utils.formatEther(initialReserveBalance), "ETN");
  console.log("Initial User Wallet Balance:", hre.ethers.utils.formatEther(initialUserBalance), "ETN");

  // Call the rewardUser function
  const tx = await petCareRewards.rewardUser(userWallet);
  await tx.wait();

  console.log("Reward sent to:", userWallet);

  // Check final balances
  const finalReserveBalance = await dummyToken.balanceOf(reserveWallet);
  const finalUserBalance = await dummyToken.balanceOf(userWallet);

  console.log("Final Reserve Wallet Balance:", hre.ethers.utils.formatEther(finalReserveBalance), "ETN");
  console.log("Final User Wallet Balance:", hre.ethers.utils.formatEther(finalUserBalance), "ETN");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
