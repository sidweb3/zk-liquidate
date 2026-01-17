import { ethers } from "hardhat";

/**
 * Test script to simulate the full liquidation flow
 * Run with: npx hardhat run scripts/test-flow.ts --network mumbai
 */
async function main() {
  console.log("🧪 Testing zkLiquidate Protocol Flow...\n");

  // Deployed contract addresses on testnets
  const INTENT_REGISTRY_ADDRESS = "0x831F6F30cc0Aa68a9541B79c2289BF748DEC4a2a"; // Polygon Amoy
  const ZK_VERIFIER_ADDRESS = "0x8C935B982416673cF9633DdCC4E9Dc4ec2846Ab2"; // Polygon zkEVM Testnet
  const LIQUIDATION_EXECUTOR_ADDRESS = "0x6cFe23FA3ed2D3df4ae2a4A2686514Fa8E634A9B"; // Polygon Amoy

  const [deployer] = await ethers.getSigners();
  console.log("Testing with account:", deployer.address);

  // Get contract instances
  const intentRegistry = await ethers.getContractAt("IntentRegistry", INTENT_REGISTRY_ADDRESS);
  const zkVerifier = await ethers.getContractAt("ZKVerifier", ZK_VERIFIER_ADDRESS);
  const liquidationExecutor = await ethers.getContractAt("LiquidationExecutor", LIQUIDATION_EXECUTOR_ADDRESS);

  // Step 1: Submit Intent
  console.log("\n1️⃣ Submitting liquidation intent...");
  const intentHash = ethers.keccak256(ethers.toUtf8Bytes("test-intent-" + Date.now()));
  const targetUser = "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb";
  const targetHealthFactor = ethers.parseEther("0.95"); // 0.95 (< 1.0)
  const minPrice = ethers.parseEther("2500");
  const deadline = (await ethers.provider.getBlockNumber()) + 100;
  const stakeAmount = ethers.parseEther("10");

  const submitTx = await intentRegistry.submitIntent(
    intentHash,
    targetUser,
    targetHealthFactor,
    minPrice,
    deadline,
    { value: stakeAmount }
  );
  await submitTx.wait();
  console.log("✅ Intent submitted:", intentHash);

  // Step 2: Verify Proof (on zkEVM)
  console.log("\n2️⃣ Verifying ZK proof...");
  const mockProof = ethers.randomBytes(64);
  const priceData = [ethers.parseEther("3000"), ethers.parseEther("2500")];
  const healthFactor = ethers.parseEther("0.95");

  const verifyTx = await zkVerifier.verifyLiquidationProof(
    mockProof,
    intentHash,
    priceData,
    healthFactor,
    { value: ethers.parseEther("0.028") }
  );
  await verifyTx.wait();
  console.log("✅ Proof verified");

  // Step 3: Execute Liquidation
  console.log("\n3️⃣ Executing liquidation...");
  const executeTx = await liquidationExecutor.executeLiquidation(
    intentHash,
    "Polygon PoS"
  );
  await executeTx.wait();
  console.log("✅ Liquidation executed");

  // Step 4: Check Results
  console.log("\n4️⃣ Checking results...");
  const execution = await liquidationExecutor.getExecution(intentHash);
  console.log("Executor:", execution.executor);
  console.log("Profit:", ethers.formatEther(execution.profit), "POL");
  console.log("Chain:", execution.chain);

  console.log("\n✨ Test flow completed successfully!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
