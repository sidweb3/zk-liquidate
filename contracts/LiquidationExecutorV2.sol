// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

interface IIntentRegistryV2 {
    function getIntent(bytes32 intentHash) external view returns (
        address liquidator,
        bytes32 intentHash_,
        address targetUser,
        address targetProtocol,
        uint256 targetHealthFactor,
        uint256 minPrice,
        uint256 deadline,
        uint256 stakeAmount,
        bool isExecuted,
        bool isCancelled,
        bool isSlashed,
        uint256 createdAt
    );
    function markExecuted(bytes32 intentHash) external;
    function slashIntent(bytes32 intentHash) external;
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

interface IAavePool {
    function getUserAccountData(address user) external view returns (
        uint256 totalCollateralBase,
        uint256 totalDebtBase,
        uint256 availableBorrowsBase,
        uint256 currentLiquidationThreshold,
        uint256 ltv,
        uint256 healthFactor
    );

    function liquidationCall(
        address collateralAsset,
        address debtAsset,
        address user,
        uint256 debtToCover,
        bool receiveAToken
    ) external;
}

interface IAaveOracle {
    function getAssetPrice(address asset) external view returns (uint256);
}

/**
 * @title LiquidationExecutorV2
 * @notice Enhanced executor with real Aave V3 integration and security hardening
 * @dev Wave 5 improvements: Real DeFi integration, gas optimization, insurance pool, slashing
 */
contract LiquidationExecutorV2 is ReentrancyGuard, Pausable, Ownable {
    using SafeERC20 for IERC20;

    // Contract references
    IIntentRegistryV2 public intentRegistry;
    IZKVerifier public zkVerifier;
    IAavePool public aavePool;
    IAaveOracle public aaveOracle;

    // Insurance pool parameters
    uint256 public constant INSURANCE_FEE_BPS = 50; // 0.5%
    uint256 public insurancePool;

    // Liquidation parameters
    uint256 public constant MIN_HEALTH_FACTOR = 1e18; // 1.0
    uint256 public constant LIQUIDATION_BONUS_BPS = 500; // 5% bonus
    uint256 public constant MAX_LIQUIDATION_CLOSE_FACTOR = 5000; // 50% max

    // Gas limits for safety
    uint256 public constant MAX_GAS_PRICE = 500 gwei;
    uint256 public maxGasForLiquidation = 1000000;

    struct Execution {
        bytes32 intentHash;
        address executor;
        address targetUser;
        address collateralAsset;
        address debtAsset;
        uint256 debtCovered;
        uint256 collateralSeized;
        uint256 profit;
        uint256 timestamp;
        uint256 gasUsed;
    }

    mapping(bytes32 => Execution) public executions;
    mapping(address => uint256) public executorRewards;
    mapping(address => uint256) public executorStats; // Total liquidations

    // Events
    event LiquidationExecuted(
        bytes32 indexed intentHash,
        address indexed executor,
        address targetUser,
        uint256 debtCovered,
        uint256 collateralSeized,
        uint256 profit
    );

    event RewardClaimed(address indexed executor, uint256 amount);
    event InsurancePayment(uint256 amount);
    event ProtocolsUpdated(address aavePool, address aaveOracle);
    event EmergencyWithdraw(address indexed token, uint256 amount);

    constructor(
        address _intentRegistry,
        address _zkVerifier,
        address _aavePool,
        address _aaveOracle
    ) Ownable(msg.sender) {
        require(_intentRegistry != address(0), "Invalid registry");
        require(_zkVerifier != address(0), "Invalid verifier");
        require(_aavePool != address(0), "Invalid Aave pool");
        require(_aaveOracle != address(0), "Invalid Aave oracle");

        intentRegistry = IIntentRegistryV2(_intentRegistry);
        zkVerifier = IZKVerifier(_zkVerifier);
        aavePool = IAavePool(_aavePool);
        aaveOracle = IAaveOracle(_aaveOracle);
    }

    /**
     * @notice Execute liquidation on Aave V3
     * @param intentHash Hash of the intent to execute
     * @param collateralAsset Address of collateral token to seize
     * @param debtAsset Address of debt token to repay
     * @param debtToCover Amount of debt to cover
     */
    function executeLiquidation(
        bytes32 intentHash,
        address collateralAsset,
        address debtAsset,
        uint256 debtToCover
    ) external nonReentrant whenNotPaused {
        // Gas price check
        require(tx.gasprice <= MAX_GAS_PRICE, "Gas price too high");

        uint256 gasStart = gasleft();

        // Get intent details
        (
            address liquidator,
            ,
            address targetUser,
            address targetProtocol,
            uint256 targetHealthFactor,
            ,
            uint256 deadline,
            uint256 stakeAmount,
            bool isExecuted,
            bool isCancelled,
            bool isSlashed,
        ) = intentRegistry.getIntent(intentHash);

        require(liquidator != address(0), "Intent not found");
        require(!isExecuted, "Already executed");
        require(!isCancelled, "Intent cancelled");
        require(!isSlashed, "Intent slashed");
        require(block.number <= deadline, "Intent expired");
        require(targetProtocol == address(aavePool), "Wrong protocol");

        // Verify ZK proof was validated
        (
            ,
            bool isValid,
            uint256 verificationTime,
            ,
        ) = zkVerifier.getVerification(intentHash);

        require(isValid, "Invalid proof");
        require(verificationTime > 0, "Not verified");
        require(block.timestamp - verificationTime < 3600, "Verification expired"); // 1 hour

        // Check user's health factor on Aave
        (
            uint256 totalCollateralBase,
            uint256 totalDebtBase,
            ,
            ,
            ,
            uint256 healthFactor
        ) = aavePool.getUserAccountData(targetUser);

        require(totalDebtBase > 0, "No debt to liquidate");
        require(healthFactor < MIN_HEALTH_FACTOR, "User not liquidatable");
        require(healthFactor <= targetHealthFactor + 1e17, "Health factor too high"); // 10% tolerance

        // Calculate max debt to cover (50% close factor)
        uint256 maxDebtToCover = (totalDebtBase * MAX_LIQUIDATION_CLOSE_FACTOR) / 10000;
        require(debtToCover <= maxDebtToCover, "Exceeds close factor");

        // Get collateral price
        uint256 collateralPrice = aaveOracle.getAssetPrice(collateralAsset);
        uint256 debtPrice = aaveOracle.getAssetPrice(debtAsset);
        require(collateralPrice > 0 && debtPrice > 0, "Invalid prices");

        // Transfer debt token from executor
        IERC20(debtAsset).safeTransferFrom(msg.sender, address(this), debtToCover);

        // Approve Aave to spend debt token
        IERC20(debtAsset).safeApprove(address(aavePool), debtToCover);

        // Execute liquidation on Aave
        uint256 collateralBalanceBefore = IERC20(collateralAsset).balanceOf(address(this));
        aavePool.liquidationCall(
            collateralAsset,
            debtAsset,
            targetUser,
            debtToCover,
            false // Receive underlying asset, not aToken
        );
        uint256 collateralBalanceAfter = IERC20(collateralAsset).balanceOf(address(this));

        uint256 collateralSeized = collateralBalanceAfter - collateralBalanceBefore;
        require(collateralSeized > 0, "No collateral seized");

        // Calculate profit (collateral value - debt covered)
        uint256 collateralValue = (collateralSeized * collateralPrice) / 1e8; // Aave prices are 8 decimals
        uint256 debtValue = (debtToCover * debtPrice) / 1e8;
        uint256 profit = collateralValue > debtValue ? collateralValue - debtValue : 0;

        // Insurance fee
        uint256 insuranceFee = (profit * INSURANCE_FEE_BPS) / 10000;
        insurancePool += insuranceFee;

        // Calculate gas used
        uint256 gasUsed = gasStart - gasleft();
        require(gasUsed <= maxGasForLiquidation, "Gas usage too high");

        // Record execution
        executions[intentHash] = Execution({
            intentHash: intentHash,
            executor: msg.sender,
            targetUser: targetUser,
            collateralAsset: collateralAsset,
            debtAsset: debtAsset,
            debtCovered: debtToCover,
            collateralSeized: collateralSeized,
            profit: profit - insuranceFee,
            timestamp: block.timestamp,
            gasUsed: gasUsed
        });

        // Transfer collateral to executor
        IERC20(collateralAsset).safeTransfer(msg.sender, collateralSeized);

        // Add to executor rewards (for tracking)
        executorRewards[msg.sender] += (profit - insuranceFee);
        executorStats[msg.sender] += 1;

        // Mark as executed in registry (this will transfer stake to this contract)
        intentRegistry.markExecuted(intentHash);

        // Return stake to liquidator (original intent creator)
        if (stakeAmount > 0) {
            (bool success, ) = liquidator.call{value: stakeAmount}("");
            require(success, "Stake return failed");
        }

        emit LiquidationExecuted(
            intentHash,
            msg.sender,
            targetUser,
            debtToCover,
            collateralSeized,
            profit - insuranceFee
        );
    }

    /**
     * @notice Execute liquidation that failed - slash stake
     * @param intentHash Hash of the intent that failed
     */
    function slashFailedIntent(bytes32 intentHash) external onlyOwner {
        intentRegistry.slashIntent(intentHash);
    }

    /**
     * @notice Update Aave protocol addresses
     * @param _aavePool New Aave pool address
     * @param _aaveOracle New Aave oracle address
     */
    function updateProtocols(address _aavePool, address _aaveOracle) external onlyOwner {
        require(_aavePool != address(0), "Invalid pool");
        require(_aaveOracle != address(0), "Invalid oracle");
        aavePool = IAavePool(_aavePool);
        aaveOracle = IAaveOracle(_aaveOracle);
        emit ProtocolsUpdated(_aavePool, _aaveOracle);
    }

    /**
     * @notice Update max gas for liquidation
     * @param _maxGas New max gas limit
     */
    function updateMaxGas(uint256 _maxGas) external onlyOwner {
        require(_maxGas >= 500000 && _maxGas <= 5000000, "Invalid gas limit");
        maxGasForLiquidation = _maxGas;
    }

    /**
     * @notice Withdraw from insurance pool (governance)
     * @param amount Amount to withdraw
     * @param recipient Recipient address
     */
    function withdrawInsurance(uint256 amount, address recipient) external onlyOwner {
        require(amount <= insurancePool, "Insufficient insurance pool");
        require(recipient != address(0), "Invalid recipient");

        insurancePool -= amount;

        (bool success, ) = recipient.call{value: amount}("");
        require(success, "Withdrawal failed");

        emit InsurancePayment(amount);
    }

    /**
     * @notice Emergency withdraw tokens
     * @param token Token address (or address(0) for ETH)
     * @param amount Amount to withdraw
     */
    function emergencyWithdraw(address token, uint256 amount) external onlyOwner {
        if (token == address(0)) {
            (bool success, ) = owner().call{value: amount}("");
            require(success, "ETH withdrawal failed");
        } else {
            IERC20(token).safeTransfer(owner(), amount);
        }
        emit EmergencyWithdraw(token, amount);
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
     * @notice Get execution details
     * @param intentHash Hash of the intent
     */
    function getExecution(bytes32 intentHash) external view returns (Execution memory) {
        return executions[intentHash];
    }

    /**
     * @notice Get executor statistics
     * @param executor Address of the executor
     */
    function getExecutorStats(address executor) external view returns (
        uint256 totalRewards,
        uint256 totalLiquidations
    ) {
        return (executorRewards[executor], executorStats[executor]);
    }

    /**
     * @notice Get insurance pool balance
     */
    function getInsurancePool() external view returns (uint256) {
        return insurancePool;
    }

    /**
     * @notice Simulate liquidation profitability
     * @param targetUser User to liquidate
     * @param debtToCover Amount of debt to cover
     */
    function simulateLiquidation(
        address targetUser,
        uint256 debtToCover
    ) external view returns (
        bool isLiquidatable,
        uint256 healthFactor,
        uint256 estimatedProfit
    ) {
        (
            uint256 totalCollateralBase,
            uint256 totalDebtBase,
            ,
            ,
            ,
            uint256 hf
        ) = aavePool.getUserAccountData(targetUser);

        isLiquidatable = hf < MIN_HEALTH_FACTOR && totalDebtBase > 0;
        healthFactor = hf;

        if (isLiquidatable && debtToCover > 0) {
            // Rough estimate: 5% liquidation bonus
            estimatedProfit = (debtToCover * LIQUIDATION_BONUS_BPS) / 10000;
        }
    }

    /**
     * @notice Receive ETH (for stake returns)
     */
    receive() external payable {}
}
