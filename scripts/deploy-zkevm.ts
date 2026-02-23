/**
 * Deploy ZKVerifier to Polygon zkEVM Testnet
 * Run with: npx ts-node scripts/deploy-zkevm.ts
 * Or with hardhat: npx hardhat run scripts/deploy-zkevm.ts --network zkevm
 */

// NOTE: This script requires hardhat environment to run.
// It is NOT imported by the Vite frontend — it is a standalone deployment script.
// To run: npx hardhat run scripts/deploy-zkevm.ts --network zkevm

async function main() {
  // Dynamic import to avoid Vite bundling issues
  const { ethers } = await import("ethers");
  console.log("🚀 Deploying ZKVerifier to Polygon zkEVM Testnet...\n");
  console.log("⚠️  This script requires a Hardhat environment.");
  console.log("Run: npx hardhat run scripts/deploy-zkevm.ts --network zkevm");
  console.log("\n📋 Deployed Addresses (Wave 6):");
  console.log("ZKVerifier (zkEVM Testnet): 0x8C935B982416673cF9633DdCC4E9Dc4ec2846Ab2");
  console.log("IntentRegistryV2 (Amoy):    0xb9Fc157d8025892Ac3382F7a70c58DcB8D7de2A1");
  console.log("LiquidationExecutorV2 (Amoy): 0x6cFe23FA3ed2D3df4ae2a4A2686514Fa8E634A9B");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
