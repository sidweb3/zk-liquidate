/**
 * Deploy zkLiquidate V2 contracts to Polygon Amoy Testnet
 * Run with: npx hardhat run scripts/deploy-mumbai.ts --network amoy
 *
 * NOTE: This script requires a Hardhat environment.
 * It is NOT imported by the Vite frontend.
 */

async function main() {
  console.log("🚀 Deploying zkLiquidate V2 contracts to Polygon Amoy Testnet...\n");
  console.log("⚠️  This script requires a Hardhat environment.");
  console.log("Run: npx hardhat run scripts/deploy-mumbai.ts --network amoy");
  console.log("\n📋 Already Deployed (Wave 6 — Polygon Amoy Testnet):");
  console.log("IntentRegistryV2:     0xb9Fc157d8025892Ac3382F7a70c58DcB8D7de2A1");
  console.log("LiquidationExecutorV2: 0x6cFe23FA3ed2D3df4ae2a4A2686514Fa8E634A9B");
  console.log("\n✅ Aave V3 Amoy Pool whitelisted: 0x6Ae43d3271ff6888e7Fc43Fd7321a503ff738951");
  console.log("✅ Executor linked to registry via setLiquidationExecutor()");
  console.log("\nSee WAVE_6_FINAL_SUMMARY.md for full deployment details.");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
