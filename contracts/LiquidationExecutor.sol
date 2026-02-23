// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

interface IIntentRegistry {
    function getIntent(bytes32 intentHash) external view returns (
        address liquidator,
        bytes32 intentHash_,
        address targetUser,
        uint256 targetHealthFactor,
        uint256 minPrice,
        uint256 deadline,
        uint256 stakeAmount,
        bool isExecuted,
        bool isCancelled,
        uint256 createdAt
    );
    function markExecuted(bytes32 intentHash) external;
}

interface IZKVerifier {
    function getVerification(bytes32 intentHash) external view returns (
        bytes32 intentHash_,
        bool isValid,
        uint256 timestamp,
        address verifier,
        uint256 gasUsed
    );
}

/**
 * @title LiquidationExecutor
 * @notice Executes verified liquidations with insurance pool
 * @dev Combines execution logic and insurance pool to minimize deployments
 */
contract LiquidationExecutor is ReentrancyGuard, Ownable {
    IIntentRegistry public intentRegistry;
    IZKVerifier public zkVerifier;
    
    // Insurance pool parameters
    uint256 public constant INSURANCE_FEE_BPS = 50; // 0.5%
    uint256 public insurancePool;
    
    // Liquidation bonus (5-10%)
    uint256 public constant MIN_BONUS_BPS = 500;
    uint256 public constant MAX_BONUS_BPS = 1000;
    
    struct Execution {
        bytes32 intentHash;
        address executor;
        uint256 profit;
        uint256 timestamp;
        string chain;
    }
    
    mapping(bytes32 => Execution) public executions;
    mapping(address => uint256) public executorRewards;
    
    // Events
    event LiquidationExecuted(
        bytes32 indexed intentHash,
        address indexed executor,
        uint256 profit,
        string chain
    );
    
    event RewardClaimed(address indexed executor, uint256 amount);
    event InsurancePayment(bytes32 indexed intentHash, uint256 amount);

    constructor(address _intentRegistry, address _zkVerifier) Ownable(msg.sender) {
        require(_intentRegistry != address(0), "Invalid registry");
        require(_zkVerifier != address(0), "Invalid verifier");
        
        intentRegistry = IIntentRegistry(_intentRegistry);
        zkVerifier = IZKVerifier(_zkVerifier);
    }

    /**
     * @notice Execute a verified liquidation
     * @param intentHash Hash of the intent to execute
     * @param chain Chain identifier (e.g., "Polygon zkEVM", "Polygon PoS")
     */
    function executeLiquidation(
        bytes32 intentHash,
        string calldata chain
    ) external payable nonReentrant {
        // Get intent details
        (
            address liquidator,
            ,
            ,
            ,
            ,
            uint256 deadline,
            uint256 stakeAmount,
            bool isExecuted,
            bool isCancelled,
        ) = intentRegistry.getIntent(intentHash);
        
        require(liquidator != address(0), "Intent not found");
        require(!isExecuted, "Already executed");
        require(!isCancelled, "Intent cancelled");
        require(block.number <= deadline, "Intent expired");
        
        // Verify ZK proof was validated
        (
            ,
            bool isValid,
            uint256 verificationTime,
            ,
        ) = zkVerifier.getVerification(intentHash);
        
        require(isValid, "Invalid proof");
        require(verificationTime > 0, "Not verified");
        
        // Calculate profit (5-10% of stake as liquidation bonus)
        uint256 bonusBps = MIN_BONUS_BPS + (uint256(keccak256(abi.encodePacked(intentHash))) % (MAX_BONUS_BPS - MIN_BONUS_BPS));
        uint256 liquidationBonus = (stakeAmount * 100 * bonusBps) / 10000;
        uint256 gasCost = stakeAmount / 10; // Simulate gas costs
        uint256 profit = liquidationBonus > gasCost ? liquidationBonus - gasCost : 0;
        
        // Insurance fee
        uint256 insuranceFee = (profit * INSURANCE_FEE_BPS) / 10000;
        insurancePool += insuranceFee;
        
        // Record execution
        executions[intentHash] = Execution({
            intentHash: intentHash,
            executor: msg.sender,
            profit: profit - insuranceFee,
            timestamp: block.timestamp,
            chain: chain
        });
        
        // Add to executor rewards
        executorRewards[msg.sender] += (profit - insuranceFee);
        
        // Mark as executed in registry
        intentRegistry.markExecuted(intentHash);
        
        emit LiquidationExecuted(intentHash, msg.sender, profit - insuranceFee, chain);
    }

    /**
     * @notice Claim accumulated rewards
     */
    function claimReward() external nonReentrant {
        uint256 reward = executorRewards[msg.sender];
        require(reward > 0, "No rewards to claim");
        
        executorRewards[msg.sender] = 0;
        
        (bool success, ) = msg.sender.call{value: reward}("");
        require(success, "Reward transfer failed");
        
        emit RewardClaimed(msg.sender, reward);
    }

    /**
     * @notice Get execution details
     * @param intentHash Hash of the intent
     */
    function getExecution(bytes32 intentHash) external view returns (Execution memory) {
        return executions[intentHash];
    }

    /**
     * @notice Get insurance pool balance
     */
    function getInsurancePool() external view returns (uint256) {
        return insurancePool;
    }

    /**
     * @notice Fund contract for rewards (owner only)
     */
    receive() external payable {}
}
