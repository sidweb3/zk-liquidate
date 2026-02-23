// Quick Script to Whitelist Aave V3 Pool in IntentRegistryV2
// Run this in your browser console (F12) when your frontend is loaded

import { ethers } from 'ethers';

async function whitelistAavePool() {
  try {
    console.log("🔍 Starting Aave V3 Pool whitelisting...");

    // Check if MetaMask is available
    if (typeof window.ethereum === "undefined") {
      throw new Error("MetaMask not detected. Please install MetaMask.");
    }

    // Connect to provider
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const userAddress = await signer.getAddress();

    console.log("👤 Connected wallet:", userAddress);

    // Contract details
    const contractAddress = "0x320A2dC1b4a56D13438578e3aC386ed90Ca21D27";
    const aavePoolAddress = "0x6Ae43d3271ff6888e7Fc43Fd7321a503ff738951";

    const abi = [
      "function addProtocol(address protocol) external",
      "function supportedProtocols(address protocol) external view returns (bool)",
      "function owner() external view returns (address)"
    ];

    const contract = new ethers.Contract(contractAddress, abi, signer);

    // Check if already whitelisted
    console.log("🔍 Checking if Aave Pool is already whitelisted...");
    const isWhitelisted = await contract.supportedProtocols(aavePoolAddress);

    if (isWhitelisted) {
      console.log("✅ Aave V3 Pool is ALREADY whitelisted!");
      console.log("You can now submit liquidation intents.");
      return;
    }

    console.log("❌ Aave V3 Pool is NOT whitelisted yet.");

    // Check ownership (only owner can whitelist)
    try {
      const owner = await contract.owner();
      console.log("👑 Contract owner:", owner);

      if (owner.toLowerCase() !== userAddress.toLowerCase()) {
        throw new Error(`You are not the contract owner. Owner is: ${owner}`);
      }
    } catch (error) {
      console.error("⚠️ Could not verify ownership:", error.message);
    }

    // Whitelist the protocol
    console.log("📝 Whitelisting Aave V3 Pool...");
    console.log("Address to whitelist:", aavePoolAddress);

    const tx = await contract.addProtocol(aavePoolAddress);
    console.log("⏳ Transaction sent:", tx.hash);
    console.log("View on PolygonScan: https://amoy.polygonscan.com/tx/" + tx.hash);

    console.log("⏳ Waiting for confirmation...");
    const receipt = await tx.wait();

    console.log("✅ Transaction confirmed! Block:", receipt.blockNumber);

    // Verify whitelisting
    console.log("🔍 Verifying whitelisting...");
    const nowWhitelisted = await contract.supportedProtocols(aavePoolAddress);

    if (nowWhitelisted) {
      console.log("🎉 SUCCESS! Aave V3 Pool is now whitelisted!");
      console.log("You can now submit liquidation intents.");
    } else {
      console.log("⚠️ Whitelisting may have failed. Please check the transaction.");
    }

  } catch (error) {
    console.error("❌ Error:", error.message);

    if (error.message.includes("user rejected")) {
      console.log("Transaction was rejected in MetaMask.");
    } else if (error.message.includes("insufficient funds")) {
      console.log("Insufficient MATIC for gas fees.");
    } else {
      console.log("Full error:", error);
    }
  }
}

// Export for manual calling
window.whitelistAavePool = whitelistAavePool;

console.log("✅ Script loaded! Run: whitelistAavePool()");
