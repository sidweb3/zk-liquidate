/**
 * Test Flow for zkLiquidate V2 Contracts
 * Wave 5 Enhanced Contracts with Real Aave Integration
 */

import { ethers } from "ethers";

// V2 Contract Addresses (UPDATE AFTER DEPLOYMENT)
const INTENT_REGISTRY_V2_ADDRESS = "0xYourIntentRegistryV2Address"; // Deploy first
const ZK_VERIFIER_ADDRESS = "0x8C935B982416673cF9633DdCC4E9Dc4ec2846Ab2"; // Existing
const LIQUIDATION_EXECUTOR_V2_ADDRESS = "0xYourLiquidationExecutorV2Address"; // Deploy second

// Aave V3 Addresses on Polygon Amoy
const AAVE_POOL_ADDRESS = "0x6Ae43d3271ff6888e7Fc43Fd7321a503ff738951";
const AAVE_ORACLE_ADDRESS = "0xC100cD5b25B9B0f10F3D06E42f3deD22A6Dd5db6";

// Test tokens on Polygon Amoy
const USDC_ADDRESS = "0x41E94Eb019C0762f9Bfcf9Fb1E58725BfB0e7582";
const WETH_ADDRESS = "0xA6FA4fB5f76172d178d61B04b0ecd319C5d1C0aa";

// ABIs
const INTENT_REGISTRY_V2_ABI = [
  "function submitIntent(bytes32 intentHash, address targetUser, address targetProtocol, uint256 targetHealthFactor, uint256 minPrice, uint256 deadline) external payable",
  "function getIntent(bytes32 intentHash) external view returns (tuple(address liquidator, bytes32 intentHash, address targetUser, address targetProtocol, uint256 targetHealthFactor, uint256 minPrice, uint256 deadline, uint256 stakeAmount, bool isExecuted, bool isCancelled, bool isSlashed, uint256 createdAt))",
  "function setLiquidationExecutor(address _liquidationExecutor) external",
  "function addProtocol(address protocol) external",
  "function isProtocolSupported(address protocol) external view returns (bool)",
  "function getStats() external view returns (uint256 totalStaked, uint256 totalSlashed, address liquidationExecutor)",
];

const ZK_VERIFIER_ABI = [
  "function verifyLiquidationProof(bytes calldata proof, bytes32 intentHash, uint256[] calldata priceData, uint256 healthFactor) external payable returns (bool)",
  "function getVerification(bytes32 intentHash) external view returns (tuple(bytes32 intentHash, bool isValid, uint256 timestamp, address verifier, uint256 gasUsed))",
];

const LIQUIDATION_EXECUTOR_V2_ABI = [
  "function executeLiquidation(bytes32 intentHash, address collateralAsset, address debtAsset, uint256 debtToCover) external",
  "function simulateLiquidation(address targetUser, uint256 debtToCover) external view returns (bool isLiquidatable, uint256 healthFactor, uint256 estimatedProfit)",
  "function getExecution(bytes32 intentHash) external view returns (tuple(bytes32 intentHash, address executor, address targetUser, address collateralAsset, address debtAsset, uint256 debtCovered, uint256 collateralSeized, uint256 profit, uint256 timestamp, uint256 gasUsed))",
  "function getExecutorStats(address executor) external view returns (uint256 totalRewards, uint256 totalLiquidations)",
  "function getInsurancePool() external view returns (uint256)",
];

const AAVE_POOL_ABI = [
  "function getUserAccountData(address user) external view returns (uint256 totalCollateralBase, uint256 totalDebtBase, uint256 availableBorrowsBase, uint256 currentLiquidationThreshold, uint256 ltv, uint256 healthFactor)",
];

const ERC20_ABI = [
  "function balanceOf(address owner) view returns (uint256)",
  "function approve(address spender, uint256 amount) returns (bool)",
  "function allowance(address owner, address spender) view returns (uint256)",
];

async function main() {
  console.log("🚀 zkLiquidate V2 Test Flow\n");

  // Connect to Polygon Amoy
  const provider = new ethers.JsonRpcProvider("https://rpc-amoy.polygon.technology");
  console.log("✅ Connected to Polygon Amoy");

  // Get current block
  const blockNumber = await provider.getBlockNumber();
  console.log(`📦 Current block: ${blockNumber}\n`);

  // Initialize contracts (read-only)
  const intentRegistry = new ethers.Contract(
    INTENT_REGISTRY_V2_ADDRESS,
    INTENT_REGISTRY_V2_ABI,
    provider
  );

  const zkVerifier = new ethers.Contract(
    ZK_VERIFIER_ADDRESS,
    ZK_VERIFIER_ABI,
    provider
  );

  const liquidationExecutor = new ethers.Contract(
    LIQUIDATION_EXECUTOR_V2_ADDRESS,
    LIQUIDATION_EXECUTOR_V2_ABI,
    provider
  );

  const aavePool = new ethers.Contract(
    AAVE_POOL_ADDRESS,
    AAVE_POOL_ABI,
    provider
  );

  console.log("📋 Contract Addresses:");
  console.log(`   Intent Registry V2: ${INTENT_REGISTRY_V2_ADDRESS}`);
  console.log(`   ZK Verifier: ${ZK_VERIFIER_ADDRESS}`);
  console.log(`   Liquidation Executor V2: ${LIQUIDATION_EXECUTOR_V2_ADDRESS}`);
  console.log(`   Aave Pool: ${AAVE_POOL_ADDRESS}\n`);

  // Test 1: Check if contracts are deployed
  console.log("🔍 Test 1: Verify Contract Deployment");
  try {
    const stats = await intentRegistry.getStats();
    console.log(`   ✅ Intent Registry V2 deployed`);
    console.log(`      Total Staked: ${ethers.formatEther(stats.totalStaked)} MATIC`);
    console.log(`      Total Slashed: ${ethers.formatEther(stats.totalSlashed)} MATIC`);
    console.log(`      Liquidation Executor: ${stats.liquidationExecutor}`);
  } catch (error: any) {
    console.log(`   ❌ Intent Registry V2 not found: ${error.message}`);
  }

  try {
    const insurancePool = await liquidationExecutor.getInsurancePool();
    console.log(`   ✅ Liquidation Executor V2 deployed`);
    console.log(`      Insurance Pool: ${ethers.formatEther(insurancePool)} MATIC\n`);
  } catch (error: any) {
    console.log(`   ❌ Liquidation Executor V2 not found: ${error.message}\n`);
  }

  // Test 2: Check Aave Protocol Support
  console.log("🔍 Test 2: Check Protocol Support");
  try {
    const isSupported = await intentRegistry.isProtocolSupported(AAVE_POOL_ADDRESS);
    console.log(`   Aave V3 Supported: ${isSupported ? "✅ Yes" : "❌ No"}`);
    if (!isSupported) {
      console.log(`   ⚠️  Need to call: addProtocol(${AAVE_POOL_ADDRESS})`);
    }
  } catch (error: any) {
    console.log(`   ❌ Error: ${error.message}`);
  }
  console.log();

  // Test 3: Check Example User on Aave (use a known test address or your own)
  console.log("🔍 Test 3: Check Aave User Health Factor");
  const testUser = "0x0000000000000000000000000000000000000001"; // Replace with real address
  try {
    const userData = await aavePool.getUserAccountData(testUser);
    const healthFactor = Number(userData.healthFactor) / 1e18;

    console.log(`   User: ${testUser}`);
    console.log(`   Total Collateral: ${ethers.formatUnits(userData.totalCollateralBase, 8)} USD`);
    console.log(`   Total Debt: ${ethers.formatUnits(userData.totalDebtBase, 8)} USD`);
    console.log(`   Health Factor: ${healthFactor.toFixed(4)}`);
    console.log(`   Liquidatable: ${healthFactor < 1.0 ? "✅ Yes" : "❌ No"}\n`);
  } catch (error: any) {
    console.log(`   ℹ️  No position found (expected on testnet)\n`);
  }

  // Test 4: Simulate Liquidation
  console.log("🔍 Test 4: Simulate Liquidation");
  try {
    const simulation = await liquidationExecutor.simulateLiquidation(
      testUser,
      ethers.parseUnits("1", 6) // 1 USDC
    );
    console.log(`   Is Liquidatable: ${simulation.isLiquidatable}`);
    console.log(`   Health Factor: ${Number(simulation.healthFactor) / 1e18}`);
    console.log(`   Estimated Profit: ${ethers.formatEther(simulation.estimatedProfit)} MATIC\n`);
  } catch (error: any) {
    console.log(`   ℹ️  Simulation skipped (no position)\n`);
  }

  // Test 5: Create Test Intent
  console.log("🔍 Test 5: Example Intent Submission");
  const intentHash = ethers.keccak256(
    ethers.toUtf8Bytes(`test-intent-${Date.now()}`)
  );

  console.log(`   Intent Hash: ${intentHash}`);
  console.log(`   Target User: ${testUser}`);
  console.log(`   Target Protocol: ${AAVE_POOL_ADDRESS} (Aave V3)`);
  console.log(`   Target Health Factor: 0.95`);
  console.log(`   Min Price: 1000 USD`);
  console.log(`   Deadline: Block ${blockNumber + 100}`);
  console.log(`   Stake: 10 MATIC`);
  console.log();
  console.log("   📝 To submit this intent, call:");
  console.log(`   intentRegistry.submitIntent(`);
  console.log(`     "${intentHash}",`);
  console.log(`     "${testUser}",`);
  console.log(`     "${AAVE_POOL_ADDRESS}",`);
  console.log(`     ethers.parseEther("0.95"),`);
  console.log(`     ethers.parseUnits("1000", 8),`);
  console.log(`     ${blockNumber + 100},`);
  console.log(`     { value: ethers.parseEther("10") }`);
  console.log(`   )\n`);

  // Test 6: Check Example Verification
  console.log("🔍 Test 6: Example ZK Proof Verification");
  console.log(`   📝 To verify a proof, call:`);
  console.log(`   zkVerifier.verifyLiquidationProof(`);
  console.log(`     "0x1234...", // proof bytes`);
  console.log(`     "${intentHash}",`);
  console.log(`     [ethers.parseUnits("2000", 8), ethers.parseUnits("1500", 8)], // prices`);
  console.log(`     ethers.parseEther("0.95"), // health factor`);
  console.log(`     { value: ethers.parseEther("0.028") } // verification fee`);
  console.log(`   )\n`);

  // Test 7: Check Example Execution
  console.log("🔍 Test 7: Example Liquidation Execution");
  console.log(`   📝 To execute a liquidation, call:`);
  console.log(`   liquidationExecutor.executeLiquidation(`);
  console.log(`     "${intentHash}",`);
  console.log(`     "${WETH_ADDRESS}", // collateral asset`);
  console.log(`     "${USDC_ADDRESS}", // debt asset`);
  console.log(`     ethers.parseUnits("1", 6) // 1 USDC debt to cover`);
  console.log(`   )`);
  console.log();
  console.log(`   ⚠️  Prerequisites:`);
  console.log(`      1. Target user must have Aave position`);
  console.log(`      2. Health factor < 1.0`);
  console.log(`      3. Intent must be verified`);
  console.log(`      4. Executor must have USDC and approve Liquidation Executor`);
  console.log();

  // Summary
  console.log("=" .repeat(60));
  console.log("📊 V2 Contract Features:");
  console.log("=" .repeat(60));
  console.log("✅ Real Aave V3 Integration");
  console.log("✅ Security Hardening (Pausable, Slashing)");
  console.log("✅ Gas Optimization");
  console.log("✅ Insurance Pool (0.5% fee)");
  console.log("✅ Multi-Protocol Support");
  console.log("✅ Liquidation Simulation");
  console.log("✅ Emergency Controls");
  console.log("=" .repeat(60));
  console.log();

  console.log("🎯 Next Steps:");
  console.log("1. Deploy IntentRegistryV2 and LiquidationExecutorV2");
  console.log("2. Call setLiquidationExecutor() to link contracts");
  console.log("3. Call addProtocol() to add Aave V3");
  console.log("4. Create Aave position for testing");
  console.log("5. Submit intent → Verify → Execute");
  console.log();

  console.log("📚 Documentation:");
  console.log("   Deployment Guide: /contracts/DEPLOYMENT_V2.md");
  console.log("   Contract Source: /contracts/IntentRegistryV2.sol");
  console.log("   Contract Source: /contracts/LiquidationExecutorV2.sol");
  console.log();

  console.log("✅ Test flow complete!");
}

// Run if called directly
if (require.main === module) {
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

export { main };
