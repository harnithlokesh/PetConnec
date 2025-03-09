const hre = require("hardhat");

async function main() {
  // Get the deployer account from the Testnet network
  const [deployer] = await hre.ethers.getSigners();

  // Manually specify the user address (new MetaMask account)
  const userAddress = "0x330bFAD11f79581C778627b541d344198F4959d7"; // Replace with the address of the new MetaMask account

  // Log the deployer and user addresses
  console.log("Deployer address:", deployer.address);
  console.log("User address:", userAddress);

  // Replace with your deployed contract addresses on Testnet
  const dummyTokenAddress = "0x10b54056d12E2111cDbBa9fcED1Afb8709123A2d"; // Replace with your DummyToken address
  const petCareRewardsAddress = "0x91E4dBD42a8b2E4A6Bac576731D24499b58dD85d"; // Replace with your PetCareRewards address

  const DummyToken = await hre.ethers.getContractFactory("DummyToken");
  const dummyToken = DummyToken.attach(dummyTokenAddress);

  const PetCareRewards = await hre.ethers.getContractFactory("PetCareRewards");
  const petCareRewards = PetCareRewards.attach(petCareRewardsAddress);

  // Approve the PetCareRewards contract to spend tokens on behalf of the reserve wallet
  const approvalAmount = hre.ethers.utils.parseUnits("50", 18); // Approve 50 tokens
  await dummyToken.connect(deployer).approve(petCareRewardsAddress, approvalAmount);
  console.log("Approved", approvalAmount.toString(), "tokens for PetCareRewards contract.");

  // Send a reward to the user
  const tx = await petCareRewards.connect(deployer).rewardUser(userAddress);
  await tx.wait();
  console.log("Reward sent to:", userAddress);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
