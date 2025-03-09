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

  // Approve PetCareRewards to spend tokens on behalf of the reserve wallet
  const approveTx = await dummyToken.connect(deployer).approve(petCareRewardsAddress, ethers.constants.MaxUint256);
  await approveTx.wait();

  console.log("Approval successful. PetCareRewards can now spend tokens on behalf of the reserve wallet.");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
