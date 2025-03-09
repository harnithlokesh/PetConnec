const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  // Replace with your deployed contract addresses
  const dummyTokenAddress = "0x10b54056d12E2111cDbBa9fcED1Afb8709123A2d"; // DummyToken address
  const petCareRewardsAddress = "0x91E4dBD42a8b2E4A6Bac576731D24499b58dD85d"; // PetCareRewards address

  const DummyToken = await hre.ethers.getContractFactory("DummyToken");
  const dummyToken = DummyToken.attach(dummyTokenAddress);

  const PetCareRewards = await hre.ethers.getContractFactory("PetCareRewards");
  const petCareRewards = PetCareRewards.attach(petCareRewardsAddress);

  // Get reserve wallet address
  const reserveWallet = await petCareRewards.reserveWallet();

  // Check allowance
  const allowance = await dummyToken.allowance(reserveWallet, petCareRewardsAddress);
  console.log("Allowance:", hre.ethers.utils.formatEther(allowance), "ETN");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
