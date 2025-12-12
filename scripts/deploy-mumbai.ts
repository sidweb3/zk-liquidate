import { ethers } from "hardhat";

async function main() {
  console.log("🚀 Deploying zkLiquidate contracts to Polygon Mumbai...\n");

  const [deployer] = await ethers.getSigners();
  console.log("Deploying with account:", deployer.address);
  console.log("Account balance:", ethers.formatEther(await ethers.provider.getBalance(deployer.address)), "POL\n");

  // Deploy IntentRegistry
  console.log("📝 Deploying IntentRegistry...");
  const IntentRegistry = await ethers.getContractFactory("IntentRegistry");
  const intentRegistry = await IntentRegistry.deploy();
  await intentRegistry.waitForDeployment();
  const intentRegistryAddress = await intentRegistry.getAddress();
  console.log("✅ IntentRegistry deployed to:", intentRegistryAddress);

  // Note: ZKVerifier should be deployed on zkEVM testnet separately
  // For now, we'll use a placeholder address
  const zkVerifierAddress = "0x0000000000000000000000000000000000000000"; // Replace after zkEVM deployment

  // Deploy LiquidationExecutor
  console.log("\n⚡ Deploying LiquidationExecutor...");
  const LiquidationExecutor = await ethers.getContractFactory("LiquidationExecutor");
  const liquidationExecutor = await LiquidationExecutor.deploy(
    intentRegistryAddress,
    zkVerifierAddress
  );
  await liquidationExecutor.waitForDeployment();
  const liquidationExecutorAddress = await liquidationExecutor.getAddress();
  console.log("✅ LiquidationExecutor deployed to:", liquidationExecutorAddress);

  console.log("\n📋 Deployment Summary:");
  console.log("========================");
  console.log("Network: Polygon Mumbai Testnet");
  console.log("IntentRegistry:", intentRegistryAddress);
  console.log("LiquidationExecutor:", liquidationExecutorAddress);
  console.log("\n⚠️  Next: Deploy ZKVerifier to zkEVM testnet and update LiquidationExecutor");
  console.log("\n💾 Save these addresses to your frontend configuration!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
