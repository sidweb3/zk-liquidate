// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title IntentRegistryV2
 * @notice Enhanced intent registry with security hardening and DeFi protocol integration
 * @dev Wave 5 improvements: Pausable, input validation, stake slashing, emergency controls
 */
contract IntentRegistryV2 is ReentrancyGuard, Pausable, Ownable {
    // Constants
    uint256 public constant MIN_STAKE = 10 ether;
    uint256 public constant MAX_STAKE = 1000 ether; // Prevent excessive stakes
    uint256 public constant CANCEL_TIMELOCK = 10;
    uint256 public constant MIN_DEADLINE = 10; // Minimum blocks in future
    uint256 public constant MAX_DEADLINE = 7200; // ~24 hours on Polygon
    uint256 public constant SLASH_PERCENTAGE = 20; // 20% slash for failed executions

    // State variables
    address public liquidationExecutor;
    uint256 public totalStaked;
    uint256 public totalSlashed;

    struct Intent {
        address liquidator;
        bytes32 intentHash;
        address targetUser;
        address targetProtocol; // Aave, Compound, etc.
        uint256 targetHealthFactor; // Scaled by 1e18
        uint256 minPrice; // Minimum acceptable price
        uint256 deadline; // Block number
        uint256 stakeAmount;
        bool isExecuted;
        bool isCancelled;
        bool isSlashed;
        uint256 createdAt;
    }

    // Mappings
    mapping(bytes32 => Intent) public intents;
    mapping(address => bytes32[]) public liquidatorIntents;
    mapping(address => uint256) public liquidatorTotalStaked;
    mapping(address => bool) public supportedProtocols;

    // Events
    event IntentSubmitted(
        bytes32 indexed intentHash,
        address indexed liquidator,
        address targetUser,
        address targetProtocol,
        uint256 stakeAmount,
        uint256 deadline
    );

    event IntentExecuted(bytes32 indexed intentHash, address indexed executor);
    event IntentCancelled(bytes32 indexed intentHash, address indexed liquidator);
    event IntentSlashed(bytes32 indexed intentHash, uint256 slashedAmount);
    event ProtocolAdded(address indexed protocol);
    event ProtocolRemoved(address indexed protocol);
    event LiquidationExecutorUpdated(address indexed oldExecutor, address indexed newExecutor);

    constructor() Ownable(msg.sender) {
        // Add default supported protocols (Aave V3 on Polygon)
        supportedProtocols[0x794a61358D6845594F94dc1DB02A252b5b4814aD] = true; // Aave V3 Pool Polygon
    }

    /**
     * @notice Submit a new liquidation intent with enhanced validation
     * @param intentHash Unique hash of the intent
     * @param targetUser Address of user to liquidate
     * @param targetProtocol DeFi protocol address (e.g., Aave Pool)
     * @param targetHealthFactor Target health factor (scaled by 1e18)
     * @param minPrice Minimum acceptable price
     * @param deadline Block number deadline
     */
    function submitIntent(
        bytes32 intentHash,
        address targetUser,
        address targetProtocol,
        uint256 targetHealthFactor,
        uint256 minPrice,
        uint256 deadline
    ) external payable nonReentrant whenNotPaused {
        // Enhanced validation
        require(msg.value >= MIN_STAKE, "Insufficient stake");
        require(msg.value <= MAX_STAKE, "Stake exceeds maximum");
        require(intents[intentHash].liquidator == address(0), "Intent already exists");
        require(targetUser != address(0), "Invalid target user");
        require(targetUser != msg.sender, "Cannot liquidate self");
        require(supportedProtocols[targetProtocol], "Unsupported protocol");
        require(targetHealthFactor < 1e18, "Health factor must be < 1.0");
        require(targetHealthFactor > 0, "Health factor must be > 0");
        require(deadline > block.number + MIN_DEADLINE, "Deadline too soon");
        require(deadline < block.number + MAX_DEADLINE, "Deadline too far");
        require(minPrice > 0, "Invalid min price");

        intents[intentHash] = Intent({
            liquidator: msg.sender,
            intentHash: intentHash,
            targetUser: targetUser,
            targetProtocol: targetProtocol,
            targetHealthFactor: targetHealthFactor,
            minPrice: minPrice,
            deadline: deadline,
            stakeAmount: msg.value,
            isExecuted: false,
            isCancelled: false,
            isSlashed: false,
            createdAt: block.timestamp
        });

        liquidatorIntents[msg.sender].push(intentHash);
        liquidatorTotalStaked[msg.sender] += msg.value;
        totalStaked += msg.value;

        emit IntentSubmitted(intentHash, msg.sender, targetUser, targetProtocol, msg.value, deadline);
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
        require(!intent.isSlashed, "Intent slashed");
        require(
            block.number + CANCEL_TIMELOCK < intent.deadline,
            "Too close to deadline"
        );

        intent.isCancelled = true;

        uint256 refundAmount = intent.stakeAmount;
        intent.stakeAmount = 0;
        liquidatorTotalStaked[msg.sender] -= refundAmount;
        totalStaked -= refundAmount;

        (bool success, ) = msg.sender.call{value: refundAmount}("");
        require(success, "Refund failed");

        emit IntentCancelled(intentHash, msg.sender);
    }

    /**
     * @notice Mark intent as executed (called by LiquidationExecutor)
     * @param intentHash Hash of the executed intent
     */
    function markExecuted(bytes32 intentHash) external {
        require(msg.sender == liquidationExecutor, "Only liquidation executor");

        Intent storage intent = intents[intentHash];
        require(!intent.isExecuted, "Already executed");
        require(!intent.isCancelled, "Intent cancelled");
        require(!intent.isSlashed, "Intent slashed");
        require(block.number <= intent.deadline, "Intent expired");

        intent.isExecuted = true;

        // Transfer stake to executor as collateral
        uint256 stakeAmount = intent.stakeAmount;
        intent.stakeAmount = 0;
        liquidatorTotalStaked[intent.liquidator] -= stakeAmount;
        totalStaked -= stakeAmount;

        (bool success, ) = liquidationExecutor.call{value: stakeAmount}("");
        require(success, "Stake transfer failed");

        emit IntentExecuted(intentHash, msg.sender);
    }

    /**
     * @notice Slash stake for failed execution or malicious behavior
     * @param intentHash Hash of the intent to slash
     * @dev Only callable by owner or liquidation executor
     */
    function slashIntent(bytes32 intentHash) external {
        require(
            msg.sender == owner() || msg.sender == liquidationExecutor,
            "Not authorized"
        );

        Intent storage intent = intents[intentHash];
        require(!intent.isSlashed, "Already slashed");
        require(!intent.isCancelled, "Intent cancelled");
        require(intent.stakeAmount > 0, "No stake to slash");

        intent.isSlashed = true;

        uint256 slashAmount = (intent.stakeAmount * SLASH_PERCENTAGE) / 100;
        uint256 refundAmount = intent.stakeAmount - slashAmount;

        intent.stakeAmount = 0;
        liquidatorTotalStaked[intent.liquidator] -= (slashAmount + refundAmount);
        totalStaked -= (slashAmount + refundAmount);
        totalSlashed += slashAmount;

        // Refund partial stake to liquidator
        if (refundAmount > 0) {
            (bool success1, ) = intent.liquidator.call{value: refundAmount}("");
            require(success1, "Refund failed");
        }

        // Send slashed amount to owner (treasury)
        if (slashAmount > 0) {
            (bool success2, ) = owner().call{value: slashAmount}("");
            require(success2, "Slash transfer failed");
        }

        emit IntentSlashed(intentHash, slashAmount);
    }

    /**
     * @notice Add supported DeFi protocol
     * @param protocol Address of the protocol to add
     */
    function addProtocol(address protocol) external onlyOwner {
        require(protocol != address(0), "Invalid protocol");
        require(!supportedProtocols[protocol], "Already supported");
        supportedProtocols[protocol] = true;
        emit ProtocolAdded(protocol);
    }

    /**
     * @notice Remove supported DeFi protocol
     * @param protocol Address of the protocol to remove
     */
    function removeProtocol(address protocol) external onlyOwner {
        require(supportedProtocols[protocol], "Not supported");
        supportedProtocols[protocol] = false;
        emit ProtocolRemoved(protocol);
    }

    /**
     * @notice Set liquidation executor contract
     * @param _liquidationExecutor Address of the liquidation executor
     */
    function setLiquidationExecutor(address _liquidationExecutor) external onlyOwner {
        require(_liquidationExecutor != address(0), "Invalid executor");
        address oldExecutor = liquidationExecutor;
        liquidationExecutor = _liquidationExecutor;
        emit LiquidationExecutorUpdated(oldExecutor, _liquidationExecutor);
    }

    /**
     * @notice Pause contract (emergency)
     */
    function pause() external onlyOwner {
        _pause();
    }

    /**
     * @notice Unpause contract
     */
    function unpause() external onlyOwner {
        _unpause();
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

    /**
     * @notice Check if protocol is supported
     * @param protocol Address of the protocol
     */
    function isProtocolSupported(address protocol) external view returns (bool) {
        return supportedProtocols[protocol];
    }

    /**
     * @notice Get contract statistics
     */
    function getStats() external view returns (
        uint256 _totalStaked,
        uint256 _totalSlashed,
        address _liquidationExecutor
    ) {
        return (totalStaked, totalSlashed, liquidationExecutor);
    }
}
