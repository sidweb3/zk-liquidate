import { ethers } from "hardhat";

async function main() {
  console.log("🚀 Deploying ZKVerifier to Polygon zkEVM Testnet...\n");

  const [deployer] = await ethers.getSigners();
  console.log("Deploying with account:", deployer.address);
  console.log("Account balance:", ethers.formatEther(await ethers.provider.getBalance(deployer.address)), "ETH\n");

  // Deploy ZKVerifier
  console.log("🔐 Deploying ZKVerifier...");
  const ZKVerifier = await ethers.getContractFactory("ZKVerifier");
  const zkVerifier = await ZKVerifier.deploy();
  await zkVerifier.waitForDeployment();
  const zkVerifierAddress = await zkVerifier.getAddress();
  console.log("✅ ZKVerifier deployed to:", zkVerifierAddress);

  console.log("\n📋 Deployment Summary:");
  console.log("========================");
  console.log("Network: Polygon zkEVM Testnet");
  console.log("ZKVerifier:", zkVerifierAddress);
  console.log("\n⚠️  Next: Update LiquidationExecutor on Mumbai with this address");
  console.log("\n💾 Save this address to your frontend configuration!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
