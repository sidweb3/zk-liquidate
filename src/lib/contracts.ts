// Deployed Smart Contract Addresses - Wave 5 V2
export const CONTRACTS_V2 = {
  INTENT_REGISTRY_V2: {
    address: "0xb9Fc157d8025892Ac3382F7a70c58DcB8D7de2A1",
    network: "Polygon Amoy Testnet",
    chainId: 80002,
    // Deployed by 0xA41...B7b89
    // setLiquidationExecutor: tx 0x0d0156f1... ✅
    // addProtocol (Aave V3 Amoy): tx 0x01597b41... ✅ FULLY CONFIGURED
    // MIN_STAKE: 0.1 MATIC (testnet-friendly)
  },
  ZK_VERIFIER: {
    address: "0x8C935B982416673cF9633DdCC4E9Dc4ec2846Ab2",
    network: "Polygon zkEVM Testnet",
    chainId: 1442,
  },
  LIQUIDATION_EXECUTOR_V2: {
    address: "0x6cFe23FA3ed2D3df4ae2a4A2686514Fa8E634A9B",
    network: "Polygon Amoy Testnet",
    chainId: 80002,
    linkedToRegistry: true, // setLiquidationExecutor called: tx 0x0d0156f1...
  },
} as const;

// V1 Contracts (Legacy)
export const CONTRACTS = {
  INTENT_REGISTRY: {
    address: "0x831F6F30cc0Aa68a9541B79c2289BF748DEC4a2a",
    network: "Polygon Amoy Testnet",
    chainId: 80002,
  },
  ZK_VERIFIER: {
    address: "0x8C935B982416673cF9633DdCC4E9Dc4ec2846Ab2",
    network: "Polygon zkEVM Testnet",
    chainId: 1442,
  },
  LIQUIDATION_EXECUTOR: {
    address: "0x6cFe23FA3ed2D3df4ae2a4A2686514Fa8E634A9B",
    network: "Polygon Amoy Testnet",
    chainId: 80002,
  },
} as const;

// Common testnet token addresses on Polygon Amoy
export const TESTNET_TOKENS = {
  WMATIC: "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270",
  USDC: "0x41E94Eb019C0762f9Bfcf9Fb1E58725BfB0e7582",
  WETH: "0xA6FA4fB5f76172d178d61B04b0ecd319C5d1C0aa",
  DAI: "0x001B3B4d0F3714Ca98ba10F6042DaEbF0B1B7b6F",
  USDT: "0xBD21A10F619BE90d6066c941b04e340841F1F989",
} as const;

// Aave V3 Protocol Addresses on Polygon Amoy
export const AAVE_V3_AMOY = {
  POOL: "0x6Ae43d3271ff6888e7Fc43Fd7321a503ff738951",
  ORACLE: "0xc100CD5B25b9B0F10f3d06e42F3DeD22A6dd5db6",
  UI_POOL_DATA_PROVIDER: "0xC69728f11E9E6127733751c8410432913123acf1",
} as const;

// ERC20 ABI for token interactions
export const ERC20_ABI = [
  "function balanceOf(address owner) view returns (uint256)",
  "function decimals() view returns (uint8)",
  "function symbol() view returns (string)",
  "function approve(address spender, uint256 amount) returns (bool)",
] as const;

// Contract ABIs (simplified for frontend interaction)
// V1 ABI (Legacy)
export const INTENT_REGISTRY_ABI = [
  "function submitIntent(address targetUser, uint256 targetHealthFactor, uint256 minPrice, uint256 deadline) external payable returns (bytes32)",
  "function getIntent(bytes32 intentHash) external view returns (tuple(address liquidator, address targetUser, uint256 targetHealthFactor, uint256 minPrice, uint256 deadline, uint256 bondAmount, uint8 status))",
  "function cancelIntent(bytes32 intentHash) external",
  "event IntentSubmitted(bytes32 indexed intentHash, address indexed liquidator, address targetUser)",
] as const;

// V2 ABI (Wave 5)
export const INTENT_REGISTRY_V2_ABI = [
  "function submitIntent(bytes32 intentHash, address targetUser, address targetProtocol, uint256 targetHealthFactor, uint256 minPrice, uint256 deadline) external payable",
  "function getIntent(bytes32 intentHash) external view returns (address liquidator, bytes32 intentHash_, address targetUser, address targetProtocol, uint256 targetHealthFactor, uint256 minPrice, uint256 deadline, uint256 stakeAmount, bool isExecuted, bool isCancelled, bool isSlashed, uint256 createdAt)",
  "function cancelIntent(bytes32 intentHash) external",
  "function supportedProtocols(address protocol) external view returns (bool)",
  "function addProtocol(address protocol) external",
  "function removeProtocol(address protocol) external",
  "function owner() external view returns (address)",
  "function MIN_STAKE() external view returns (uint256)",
  "event IntentSubmitted(bytes32 indexed intentHash, address indexed liquidator, address targetUser, address targetProtocol, uint256 stakeAmount, uint256 deadline)",
  "event ProtocolAdded(address indexed protocol)",
  "event ProtocolRemoved(address indexed protocol)",
] as const;

export const ZK_VERIFIER_ABI = [
  "function verifyProof(bytes32 intentHash, bytes calldata proof) external returns (bool)",
  "function isVerified(bytes32 intentHash) external view returns (bool)",
  "event ProofVerified(bytes32 indexed intentHash, bool isValid)",
] as const;

export const LIQUIDATION_EXECUTOR_ABI = [
  "function executeLiquidation(bytes32 intentHash, address collateralAsset, address debtAsset, uint256 debtToCover) external",
  "function simulateLiquidation(address targetUser, uint256 debtToCover) external view returns (bool isLiquidatable, uint256 healthFactor, uint256 estimatedProfit)",
  "function getExecution(bytes32 intentHash) external view returns (tuple(bytes32 intentHash, address executor, address targetUser, address collateralAsset, address debtAsset, uint256 debtCovered, uint256 collateralSeized, uint256 profit, uint256 timestamp, uint256 gasUsed))",
  "function getExecutorStats(address executor) external view returns (uint256 totalRewards, uint256 totalLiquidations)",
  "function getInsurancePool() external view returns (uint256)",
  "function slashFailedIntent(bytes32 intentHash) external",
  "function pause() external",
  "function unpause() external",
  "event LiquidationExecuted(bytes32 indexed intentHash, address indexed executor, address targetUser, uint256 debtCovered, uint256 collateralSeized, uint256 profit)",
] as const;

// Helper to get contract instance with better error handling
import { BrowserProvider, Contract, JsonRpcProvider } from "ethers";

export async function getIntentRegistryContract() {
  if (typeof window.ethereum === "undefined") {
    throw new Error("No Web3 wallet detected. Please install MetaMask or another Web3 wallet.");
  }
  try {
    const provider = new BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    return new Contract(CONTRACTS.INTENT_REGISTRY.address, INTENT_REGISTRY_ABI, signer);
  } catch (error: any) {
    throw new Error(`Failed to connect to IntentRegistry contract: ${error.message}`);
  }
}

export async function getZKVerifierContract() {
  if (typeof window.ethereum === "undefined") {
    throw new Error("No Web3 wallet detected. Please install MetaMask or another Web3 wallet.");
  }
  try {
    const provider = new BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    return new Contract(CONTRACTS.ZK_VERIFIER.address, ZK_VERIFIER_ABI, signer);
  } catch (error: any) {
    throw new Error(`Failed to connect to ZKVerifier contract: ${error.message}`);
  }
}

export async function getLiquidationExecutorContract() {
  if (typeof window.ethereum === "undefined") {
    throw new Error("No Web3 wallet detected. Please install MetaMask or another Web3 wallet.");
  }
  try {
    const provider = new BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    return new Contract(CONTRACTS.LIQUIDATION_EXECUTOR.address, LIQUIDATION_EXECUTOR_ABI, signer);
  } catch (error: any) {
    throw new Error(`Failed to connect to LiquidationExecutor contract: ${error.message}`);
  }
}

// V2 Contract Helpers
export async function getIntentRegistryV2Contract() {
  if (typeof window.ethereum === "undefined") {
    throw new Error("No Web3 wallet detected. Please install MetaMask or another Web3 wallet.");
  }
  try {
    const provider = new BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    return new Contract(CONTRACTS_V2.INTENT_REGISTRY_V2.address, INTENT_REGISTRY_V2_ABI, signer);
  } catch (error: any) {
    throw new Error(`Failed to connect to IntentRegistryV2 contract: ${error.message}`);
  }
}

export async function getLiquidationExecutorV2Contract() {
  if (!CONTRACTS_V2.LIQUIDATION_EXECUTOR_V2.address) {
    throw new Error(
      "LiquidationExecutorV2 contract is not yet deployed. " +
      "Deploy the executor contract and call setLiquidationExecutor() on the IntentRegistry to enable batch execution."
    );
  }
  if (typeof window.ethereum === "undefined") {
    throw new Error("No Web3 wallet detected. Please install MetaMask or another Web3 wallet.");
  }
  try {
    const provider = new BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    return new Contract(CONTRACTS_V2.LIQUIDATION_EXECUTOR_V2.address, LIQUIDATION_EXECUTOR_ABI, signer);
  } catch (error: any) {
    throw new Error(`Failed to connect to LiquidationExecutorV2 contract: ${error.message}`);
  }
}

// Helper to get ERC20 token contract with error handling
export async function getTokenContract(tokenAddress: string) {
  if (typeof window.ethereum === "undefined") {
    throw new Error("No Web3 wallet detected. Please install MetaMask or another Web3 wallet.");
  }
  try {
    const provider = new BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    return new Contract(tokenAddress, ERC20_ABI, signer);
  } catch (error: any) {
    throw new Error(`Failed to connect to token contract at ${tokenAddress}: ${error.message}`);
  }
}

// Helper to fetch user's collateral assets
export async function fetchUserCollateralAssets(userAddress: string): Promise<{ assets: string[], amounts: bigint[] }> {
  if (typeof window.ethereum === "undefined") {
    throw new Error("No Web3 wallet detected");
  }
  
  const provider = new BrowserProvider(window.ethereum);
  const assets: string[] = [];
  const amounts: bigint[] = [];
  
  // Check balances for common testnet tokens
  const tokenAddresses = Object.values(TESTNET_TOKENS);
  
  for (const tokenAddress of tokenAddresses) {
    try {
      const tokenContract = new Contract(tokenAddress, ERC20_ABI, provider);
      const balance = await tokenContract.balanceOf(userAddress);
      
      // Only include tokens with non-zero balance
      if (balance > 0n) {
        assets.push(tokenAddress);
        amounts.push(balance);
      }
    } catch (error) {
      console.warn(`Failed to fetch balance for token ${tokenAddress}:`, error);
    }
  }
  
  // If no assets found, use default mock assets for testing
  if (assets.length === 0) {
    console.warn("No collateral assets found, using default test assets");
    return {
      assets: [TESTNET_TOKENS.USDC],
      amounts: [1000000000n], // 1000 USDC (6 decimals)
    };
  }
  
  return { assets, amounts };
}

// Helper to switch network
export async function switchToNetwork(chainId: number) {
  if (typeof window.ethereum === "undefined") {
    throw new Error("No Web3 wallet detected");
  }
  
  try {
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: `0x${chainId.toString(16)}` }],
    });
  } catch (error: any) {
    // Network not added, try to add it
    if (error.code === 4902) {
      const networkConfig = chainId === 80002 
        ? {
            chainId: "0x13882",
            chainName: "Polygon Amoy Testnet",
            rpcUrls: ["https://rpc-amoy.polygon.technology"],
            nativeCurrency: { name: "MATIC", symbol: "MATIC", decimals: 18 },
            blockExplorerUrls: ["https://amoy.polygonscan.com/"],
          }
        : {
            chainId: "0x5a2",
            chainName: "Polygon zkEVM Testnet",
            rpcUrls: ["https://rpc.public.zkevm-test.net"],
            nativeCurrency: { name: "ETH", symbol: "ETH", decimals: 18 },
            blockExplorerUrls: ["https://testnet-zkevm.polygonscan.com/"],
          };
      
      await window.ethereum.request({
        method: "wallet_addEthereumChain",
        params: [networkConfig],
      });
    } else {
      throw error;
    }
  }
}

// Helper to get Amoy provider with fallback RPC endpoints (no connectivity test to avoid rate limits)
export function getAmoyProvider(): JsonRpcProvider {
  // Use drpc.org as primary — more reliable than the official endpoint
  return new JsonRpcProvider("https://polygon-amoy.drpc.org", { name: "amoy", chainId: 80002 });
}