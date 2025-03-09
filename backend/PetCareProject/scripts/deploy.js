const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  // Deploy the DummyToken contract
  const DummyToken = await hre.ethers.getContractFactory("DummyToken");
  const initialSupply = hre.ethers.utils.parseUnits("1000000", 18); // 1,000,000 tokens with 18 decimals
  const dummyToken = await DummyToken.deploy(initialSupply);
  await dummyToken.deployed();
  console.log("DummyToken deployed to:", dummyToken.address);

  // Use the deployer’s address as the reserve wallet (for testing)
  const reserveWallet = deployer.address;

  // Deploy the PetCareRewards contract
  const PetCareRewards = await hre.ethers.getContractFactory("PetCareRewards");
  const petCareRewards = await PetCareRewards.deploy(dummyToken.address, reserveWallet);
  await petCareRewards.deployed();
  console.log("PetCareRewards deployed to:", petCareRewards.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
