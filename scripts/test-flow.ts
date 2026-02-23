/**
 * Test Flow for zkLiquidate V1 Contracts (Legacy)
 * Run with: npx hardhat run scripts/test-flow.ts --network amoy
 *
 * NOTE: This script requires a Hardhat environment.
 * It is NOT imported by the Vite frontend.
 *
 * For V2 testing, use scripts/test-flow-v2.ts
 */

import { ethers } from "ethers";

// Deployed contract addresses on testnets (Wave 6)
const INTENT_REGISTRY_V2_ADDRESS = "0xb9Fc157d8025892Ac3382F7a70c58DcB8D7de2A1"; // Polygon Amoy
const ZK_VERIFIER_ADDRESS = "0x8C935B982416673cF9633DdCC4E9Dc4ec2846Ab2"; // Polygon zkEVM Testnet
const LIQUIDATION_EXECUTOR_V2_ADDRESS = "0x6cFe23FA3ed2D3df4ae2a4A2686514Fa8E634A9B"; // Polygon Amoy

async function main() {
  console.log("🧪 Testing zkLiquidate V2 Protocol Flow...\n");
  console.log("Registry:  ", INTENT_REGISTRY_V2_ADDRESS);
  console.log("Verifier:  ", ZK_VERIFIER_ADDRESS);
  console.log("Executor:  ", LIQUIDATION_EXECUTOR_V2_ADDRESS);
  console.log("\nSee scripts/test-flow-v2.ts for the full V2 test flow.");
  console.log("See WAVE_6_FINAL_SUMMARY.md for confirmed on-chain transactions.");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
