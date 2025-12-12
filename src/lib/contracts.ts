// Deployed Smart Contract Addresses
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

// ERC20 ABI for token interactions
export const ERC20_ABI = [
  "function balanceOf(address owner) view returns (uint256)",
  "function decimals() view returns (uint8)",
  "function symbol() view returns (string)",
  "function approve(address spender, uint256 amount) returns (bool)",
] as const;

// Contract ABIs (simplified for frontend interaction)
export const INTENT_REGISTRY_ABI = [
  "function submitIntent(address targetUser, uint256 targetHealthFactor, uint256 minPrice, uint256 deadline) external payable returns (bytes32)",
  "function getIntent(bytes32 intentHash) external view returns (tuple(address liquidator, address targetUser, uint256 targetHealthFactor, uint256 minPrice, uint256 deadline, uint256 bondAmount, uint8 status))",
  "function cancelIntent(bytes32 intentHash) external",
  "event IntentSubmitted(bytes32 indexed intentHash, address indexed liquidator, address targetUser)",
] as const;

export const ZK_VERIFIER_ABI = [
  "function verifyProof(bytes32 intentHash, bytes calldata proof) external returns (bool)",
  "function isVerified(bytes32 intentHash) external view returns (bool)",
  "event ProofVerified(bytes32 indexed intentHash, bool isValid)",
] as const;

export const LIQUIDATION_EXECUTOR_ABI = [
  "function executeLiquidation(bytes32 intentHash, address[] calldata assets, uint256[] calldata amounts) external",
  "function depositInsurance() external payable",
  "function withdrawInsurance(uint256 amount) external",
  "event LiquidationExecuted(bytes32 indexed intentHash, address indexed executor, uint256 profit)",
] as const;

// Helper to get contract instance
import { BrowserProvider, Contract } from "ethers";

export async function getIntentRegistryContract() {
  if (typeof window.ethereum === "undefined") {
    throw new Error("No Web3 wallet detected");
  }
  const provider = new BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  return new Contract(CONTRACTS.INTENT_REGISTRY.address, INTENT_REGISTRY_ABI, signer);
}

export async function getZKVerifierContract() {
  if (typeof window.ethereum === "undefined") {
    throw new Error("No Web3 wallet detected");
  }
  const provider = new BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  return new Contract(CONTRACTS.ZK_VERIFIER.address, ZK_VERIFIER_ABI, signer);
}

export async function getLiquidationExecutorContract() {
  if (typeof window.ethereum === "undefined") {
    throw new Error("No Web3 wallet detected");
  }
  const provider = new BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  return new Contract(CONTRACTS.LIQUIDATION_EXECUTOR.address, LIQUIDATION_EXECUTOR_ABI, signer);
}

// Helper to get ERC20 token contract
export async function getTokenContract(tokenAddress: string) {
  if (typeof window.ethereum === "undefined") {
    throw new Error("No Web3 wallet detected");
  }
  const provider = new BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  return new Contract(tokenAddress, ERC20_ABI, signer);
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