// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title IntentRegistry
 * @notice Manages liquidation intents with time-locked staking on Polygon PoS
 * @dev Deployed on Polygon Mumbai Testnet
 */
contract IntentRegistry is ReentrancyGuard, Ownable {
    // Minimum stake required (10 POL)
    uint256 public constant MIN_STAKE = 10 ether;
    
    // Time lock for cancellation (10 blocks before deadline)
    uint256 public constant CANCEL_TIMELOCK = 10;

    struct Intent {
        address liquidator;
        bytes32 intentHash;
        address targetUser;
        uint256 targetHealthFactor; // Scaled by 1e18
        uint256 minPrice; // Minimum acceptable price
        uint256 deadline; // Block number
        uint256 stakeAmount;
        bool isExecuted;
        bool isCancelled;
        uint256 createdAt;
    }

    // Mapping from intentHash to Intent
    mapping(bytes32 => Intent) public intents;
    
    // Mapping from liquidator to their intent hashes
    mapping(address => bytes32[]) public liquidatorIntents;

    // Events
    event IntentSubmitted(
        bytes32 indexed intentHash,
        address indexed liquidator,
        address targetUser,
        uint256 stakeAmount,
        uint256 deadline
    );
    
    event IntentExecuted(bytes32 indexed intentHash, address indexed executor);
    event IntentCancelled(bytes32 indexed intentHash, address indexed liquidator);

    constructor() Ownable(msg.sender) {}

    /**
     * @notice Submit a new liquidation intent with stake
     * @param intentHash Unique hash of the intent
     * @param targetUser Address of user to liquidate
     * @param targetHealthFactor Target health factor (scaled by 1e18)
     * @param minPrice Minimum acceptable price
     * @param deadline Block number deadline
     */
    function submitIntent(
        bytes32 intentHash,
        address targetUser,
        uint256 targetHealthFactor,
        uint256 minPrice,
        uint256 deadline
    ) external payable nonReentrant {
        require(msg.value >= MIN_STAKE, "Insufficient stake");
        require(intents[intentHash].liquidator == address(0), "Intent already exists");
        require(deadline > block.number, "Invalid deadline");
        require(targetUser != address(0), "Invalid target user");
        require(targetHealthFactor < 1e18, "Health factor must be < 1.0");

        intents[intentHash] = Intent({
            liquidator: msg.sender,
            intentHash: intentHash,
            targetUser: targetUser,
            targetHealthFactor: targetHealthFactor,
            minPrice: minPrice,
            deadline: deadline,
            stakeAmount: msg.value,
            isExecuted: false,
            isCancelled: false,
            createdAt: block.timestamp
        });

        liquidatorIntents[msg.sender].push(intentHash);

        emit IntentSubmitted(intentHash, msg.sender, targetUser, msg.value, deadline);
    }

    /**
     * @notice Cancel an intent and refund stake (with timelock)
     * @param intentHash Hash of the intent to cancel
     */
    function cancelIntent(bytes32 intentHash) external nonReentrant {
        Intent storage intent = intents[intentHash];
        
        require(intent.liquidator == msg.sender, "Not intent owner");
        require(!intent.isExecuted, "Already executed");
        require(!intent.isCancelled, "Already cancelled");
        require(
            block.number + CANCEL_TIMELOCK < intent.deadline,
            "Too close to deadline"
        );

        intent.isCancelled = true;
        
        uint256 refundAmount = intent.stakeAmount;
        intent.stakeAmount = 0;

        (bool success, ) = msg.sender.call{value: refundAmount}("");
        require(success, "Refund failed");

        emit IntentCancelled(intentHash, msg.sender);
    }

    /**
     * @notice Mark intent as executed (called by LiquidationExecutor)
     * @param intentHash Hash of the executed intent
     */
    function markExecuted(bytes32 intentHash) external {
        Intent storage intent = intents[intentHash];
        require(!intent.isExecuted, "Already executed");
        require(!intent.isCancelled, "Intent cancelled");
        require(block.number <= intent.deadline, "Intent expired");
        
        intent.isExecuted = true;
        
        emit IntentExecuted(intentHash, msg.sender);
    }

    /**
     * @notice Get intent details
     * @param intentHash Hash of the intent
     */
    function getIntent(bytes32 intentHash) external view returns (Intent memory) {
        return intents[intentHash];
    }

    /**
     * @notice Get all intents for a liquidator
     * @param liquidator Address of the liquidator
     */
    function getLiquidatorIntents(address liquidator) external view returns (bytes32[] memory) {
        return liquidatorIntents[liquidator];
    }
}
