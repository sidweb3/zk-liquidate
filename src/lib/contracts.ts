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
