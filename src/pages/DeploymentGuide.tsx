import { useState } from "react";
import { motion } from "framer-motion";
import { Copy, CheckCircle2, ExternalLink, Terminal, Zap, AlertTriangle, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Link } from "react-router";
import IntentRegistrySource from "@/components/deployment/IntentRegistrySource";

const INTENT_REGISTRY_V2_ADDRESS = "0x177C8dDB569Bdd556C2090992e1f84df0Da5248C";
const ZK_VERIFIER_ADDRESS = "0x8C935B982416673cF9633DdCC4E9Dc4ec2846Ab2";
const AAVE_POOL_ADDRESS = "0x6Ae43d3271ff6888e7Fc43Fd7321a503ff738951";
const AAVE_ORACLE_ADDRESS = "0xc100CD5B25b9B0F10f3d06e42F3DeD22A6dd5db6";

const EXECUTOR_CONSTRUCTOR_ARGS = `_intentRegistry: ${INTENT_REGISTRY_V2_ADDRESS}
_zkVerifier: ${ZK_VERIFIER_ADDRESS}
_aavePool: ${AAVE_POOL_ADDRESS}
_aaveOracle: ${AAVE_ORACLE_ADDRESS}`;

const EXECUTOR_SOURCE = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

interface IIntentRegistryV2 {
    function getIntent(bytes32 intentHash) external view returns (
        address liquidator, bytes32 intentHash_,
        address targetUser, address targetProtocol,
        uint256 targetHealthFactor, uint256 minPrice,
        uint256 deadline, uint256 stakeAmount,
        bool isExecuted, bool isCancelled, bool isSlashed, uint256 createdAt
    );
    function markExecuted(bytes32 intentHash) external;
    function slashIntent(bytes32 intentHash) external;
}

interface IZKVerifier {
    function getVerification(bytes32 intentHash) external view returns (
        bytes32 intentHash_, bool isValid, uint256 timestamp,
        address verifier, uint256 gasUsed
    );
}

interface IAavePool {
    function getUserAccountData(address user) external view returns (
        uint256 totalCollateralBase, uint256 totalDebtBase,
        uint256 availableBorrowsBase, uint256 currentLiquidationThreshold,
        uint256 ltv, uint256 healthFactor
    );
    function liquidationCall(
        address collateralAsset, address debtAsset,
        address user, uint256 debtToCover, bool receiveAToken
    ) external;
}

interface IAaveOracle {
    function getAssetPrice(address asset) external view returns (uint256);
}

contract LiquidationExecutorV2 is ReentrancyGuard, Pausable, Ownable {
    using SafeERC20 for IERC20;

    IIntentRegistryV2 public intentRegistry;
    IZKVerifier public zkVerifier;
    IAavePool public aavePool;
    IAaveOracle public aaveOracle;

    uint256 public constant INSURANCE_FEE_BPS = 50;
    uint256 public insurancePool;
    uint256 public constant MIN_HEALTH_FACTOR = 1e18;
    uint256 public constant LIQUIDATION_BONUS_BPS = 500;
    uint256 public constant MAX_LIQUIDATION_CLOSE_FACTOR = 5000;
    uint256 public constant MAX_GAS_PRICE = 500 gwei;
    uint256 public maxGasForLiquidation = 1000000;

    struct IntentData {
        address liquidator;
        address targetUser;
        address targetProtocol;
        uint256 deadline;
        uint256 stakeAmount;
        bool isExecuted;
        bool isCancelled;
        bool isSlashed;
    }

    struct Execution {
        bytes32 intentHash; address executor; address targetUser;
        address collateralAsset; address debtAsset;
        uint256 debtCovered; uint256 collateralSeized;
        uint256 profit; uint256 timestamp; uint256 gasUsed;
    }

    mapping(bytes32 => Execution) public executions;
    mapping(address => uint256) public executorRewards;
    mapping(address => uint256) public executorStats;

    event LiquidationExecuted(bytes32 indexed intentHash, address indexed executor,
        address targetUser, uint256 debtCovered, uint256 collateralSeized, uint256 profit);

    constructor(address _intentRegistry, address _zkVerifier,
        address _aavePool, address _aaveOracle) Ownable(msg.sender) {
        require(_intentRegistry != address(0), "Invalid registry");
        require(_zkVerifier != address(0), "Invalid verifier");
        require(_aavePool != address(0), "Invalid Aave pool");
        require(_aaveOracle != address(0), "Invalid Aave oracle");
        intentRegistry = IIntentRegistryV2(_intentRegistry);
        zkVerifier = IZKVerifier(_zkVerifier);
        aavePool = IAavePool(_aavePool);
        aaveOracle = IAaveOracle(_aaveOracle);
    }

    function _loadIntent(bytes32 intentHash) internal view returns (IntentData memory d) {
        (d.liquidator,, d.targetUser, d.targetProtocol,,, d.deadline,
         d.stakeAmount, d.isExecuted, d.isCancelled, d.isSlashed,) =
            intentRegistry.getIntent(intentHash);
    }

    function _validateZK(bytes32 intentHash) internal view {
        (,bool isValid, uint256 verificationTime,,) = zkVerifier.getVerification(intentHash);
        require(isValid, "Invalid proof");
        require(block.timestamp - verificationTime < 3600, "Verification expired");
    }

    function _validatePosition(address targetUser, uint256 debtToCover) internal view {
        (,uint256 totalDebtBase,,,,uint256 healthFactor) = aavePool.getUserAccountData(targetUser);
        require(totalDebtBase > 0, "No debt to liquidate");
        require(healthFactor < MIN_HEALTH_FACTOR, "User not liquidatable");
        uint256 maxDebtToCover = (totalDebtBase * MAX_LIQUIDATION_CLOSE_FACTOR) / 10000;
        require(debtToCover <= maxDebtToCover, "Exceeds close factor");
    }

    function _calcProfit(address collateralAsset, address debtAsset,
        uint256 collateralSeized, uint256 debtToCover) internal view returns (uint256) {
        uint256 collateralPrice = aaveOracle.getAssetPrice(collateralAsset);
        uint256 debtPrice = aaveOracle.getAssetPrice(debtAsset);
        uint256 collateralValue = (collateralSeized * collateralPrice) / 1e8;
        uint256 debtValue = (debtToCover * debtPrice) / 1e8;
        return collateralValue > debtValue ? collateralValue - debtValue : 0;
    }

    function executeLiquidation(bytes32 intentHash, address collateralAsset,
        address debtAsset, uint256 debtToCover) external nonReentrant whenNotPaused {
        require(tx.gasprice <= MAX_GAS_PRICE, "Gas price too high");
        uint256 gasStart = gasleft();

        IntentData memory intent = _loadIntent(intentHash);
        require(intent.liquidator != address(0), "Intent not found");
        require(!intent.isExecuted, "Already executed");
        require(!intent.isCancelled, "Intent cancelled");
        require(!intent.isSlashed, "Intent slashed");
        require(block.number <= intent.deadline, "Intent expired");
        require(intent.targetProtocol == address(aavePool), "Wrong protocol");

        _validateZK(intentHash);
        _validatePosition(intent.targetUser, debtToCover);

        IERC20(debtAsset).safeTransferFrom(msg.sender, address(this), debtToCover);
        IERC20(debtAsset).forceApprove(address(aavePool), debtToCover);

        uint256 collateralBefore = IERC20(collateralAsset).balanceOf(address(this));
        aavePool.liquidationCall(collateralAsset, debtAsset, intent.targetUser, debtToCover, false);
        uint256 collateralSeized = IERC20(collateralAsset).balanceOf(address(this)) - collateralBefore;
        require(collateralSeized > 0, "No collateral seized");

        uint256 profit = _calcProfit(collateralAsset, debtAsset, collateralSeized, debtToCover);
        uint256 insuranceFee = (profit * INSURANCE_FEE_BPS) / 10000;
        insurancePool += insuranceFee;

        uint256 gasUsed = gasStart - gasleft();
        executions[intentHash] = Execution(intentHash, msg.sender, intent.targetUser,
            collateralAsset, debtAsset, debtToCover, collateralSeized,
            profit - insuranceFee, block.timestamp, gasUsed);

        IERC20(collateralAsset).safeTransfer(msg.sender, collateralSeized);
        executorRewards[msg.sender] += (profit - insuranceFee);
        executorStats[msg.sender] += 1;
        intentRegistry.markExecuted(intentHash);

        if (intent.stakeAmount > 0) {
            (bool success,) = intent.liquidator.call{value: intent.stakeAmount}("");
            require(success, "Stake return failed");
        }

        emit LiquidationExecuted(intentHash, msg.sender, intent.targetUser,
            debtToCover, collateralSeized, profit - insuranceFee);
    }

    function simulateLiquidation(address targetUser, uint256 debtToCover)
        external view returns (bool isLiquidatable, uint256 healthFactor, uint256 estimatedProfit) {
        (,uint256 totalDebtBase,,,,uint256 hf) = aavePool.getUserAccountData(targetUser);
        isLiquidatable = hf < MIN_HEALTH_FACTOR && totalDebtBase > 0;
        healthFactor = hf;
        if (isLiquidatable && debtToCover > 0) {
            estimatedProfit = (debtToCover * LIQUIDATION_BONUS_BPS) / 10000;
        }
    }

    function slashFailedIntent(bytes32 intentHash) external onlyOwner {
        intentRegistry.slashIntent(intentHash);
    }

    function withdrawInsurance(uint256 amount, address recipient) external onlyOwner {
        require(amount <= insurancePool, "Insufficient insurance pool");
        insurancePool -= amount;
        (bool success,) = recipient.call{value: amount}("");
        require(success, "Withdrawal failed");
    }

    function getExecution(bytes32 intentHash) external view returns (Execution memory) {
        return executions[intentHash];
    }

    function getExecutorStats(address executor) external view returns (
        uint256 totalRewards, uint256 totalLiquidations) {
        return (executorRewards[executor], executorStats[executor]);
    }

    function getInsurancePool() external view returns (uint256) { return insurancePool; }
    function pause() external onlyOwner { _pause(); }
    function unpause() external onlyOwner { _unpause(); }
    receive() external payable {}
}`;

function CopyButton({ text, label }: { text: string; label: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success(`${label} copied!`);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <Button variant="outline" size="sm" onClick={handleCopy} className="gap-2 border-border/60 hover:border-primary/40">
      {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
      {copied ? "Copied!" : "Copy"}
    </Button>
  );
}

function CodeBlock({ code, label }: { code: string; label: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    toast.success(`${label} copied to clipboard!`);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div className="relative">
      <div className="flex items-center justify-between px-4 py-2 bg-black/60 border border-border rounded-t-lg">
        <span className="text-xs text-muted-foreground font-mono">{label}</span>
        <CopyButton text={code} label={label} />
      </div>
      <pre className="bg-black/40 border border-t-0 border-border rounded-b-lg p-4 text-xs font-mono text-green-400 overflow-x-auto max-h-96 overflow-y-auto whitespace-pre-wrap break-all">
        {code}
      </pre>
      <button
        onClick={handleCopy}
        className="mt-2 w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg border border-primary/40 bg-primary/10 hover:bg-primary/20 text-primary font-semibold text-sm transition-all"
      >
        {copied ? (
          <>
            <CheckCircle2 className="w-4 h-4 text-green-500" />
            <span className="text-green-500">Copied to clipboard!</span>
          </>
        ) : (
          <>
            <Copy className="w-4 h-4" />
            Copy {label}
          </>
        )}
      </button>
    </div>
  );
}

const steps = [
  {
    num: 1,
    title: "Open Remix IDE",
    description: "Navigate to remix.ethereum.org in your browser",
    action: (
      <Button
        variant="outline"
        size="sm"
        className="gap-2 border-primary/30 text-primary hover:bg-primary/10"
        onClick={() => window.open("https://remix.ethereum.org", "_blank")}
      >
        <ExternalLink className="w-3.5 h-3.5" />
        Open Remix IDE
      </Button>
    ),
  },
  {
    num: 2,
    title: "Create New File",
    description: 'In the File Explorer, click the "+" icon and name it LiquidationExecutorV2.sol',
  },
  {
    num: 3,
    title: "Paste Contract Code",
    description: "Copy the contract source below and paste it into the new file",
  },
  {
    num: 4,
    title: "Compile",
    description: "Go to Solidity Compiler tab → Select 0.8.20 → Enable Optimization (200 runs) → Click Compile",
  },
  {
    num: 5,
    title: "Deploy to Polygon Amoy",
    description: "Go to Deploy & Run → Environment: Injected Provider (MetaMask) → Switch MetaMask to Polygon Amoy (Chain ID: 80002) → Paste constructor args below → Click Deploy",
  },
  {
    num: 6,
    title: "Link Executor ✅ COMPLETE",
    description: `setLiquidationExecutor(0x0160B3d6434A6823C2b35d81c74a8eb6426C0916) called on IntentRegistryV2 (${INTENT_REGISTRY_V2_ADDRESS}). tx: 0x3278d7330c9cf6b4860252c124685ff90244ce77866ca6fffd30d183becb4201`,
  },
  {
    num: 7,
    title: "Add Aave Protocol ✅ COMPLETE",
    description: `addProtocol(0x6Ae43d3271ff6888e7Fc43Fd7321a503ff738951) called on IntentRegistryV2 (${INTENT_REGISTRY_V2_ADDRESS}). ProtocolAdded event confirmed. tx: 0x43e08cf3c264ccba2f809b61174d1a2b09d113b94e82628a187c2239bdbf4ddc`,
  },
  {
    num: 8,
    title: "Update Frontend",
    description: "Contract addresses are already updated in src/lib/contracts.ts. Batch liquidations in the Protocol Adapters tab are now enabled.",
  },
];

export default function DeploymentGuide() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/dashboard" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
              ← Dashboard
            </Link>
            <span className="text-border">/</span>
            <span className="text-sm font-medium">Deployment Guide</span>
          </div>
          <Badge className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">
            <AlertTriangle className="w-3 h-3 mr-1" />
            Action Required
          </Badge>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-12 space-y-10">
        {/* Hero */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium">
            <Terminal className="w-4 h-4" />
            LiquidationExecutorV2 Deployment
          </div>
          <h1 className="text-4xl font-bold">Deploy the Executor Contract</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            The IntentRegistryV2 is live at{" "}
            <span className="font-mono text-primary text-sm">{INTENT_REGISTRY_V2_ADDRESS}</span>.
            Deploy the LiquidationExecutorV2 to unlock full on-chain batch liquidations.
          </p>
        </motion.div>

        {/* Status */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <div className="grid md:grid-cols-2 gap-4">
            <Card className="border-green-500/20 bg-green-500/5">
              <CardContent className="p-4 flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                <div>
                  <div className="font-medium text-sm">IntentRegistryV2 (Active)</div>
                  <div className="text-xs font-mono text-muted-foreground">{INTENT_REGISTRY_V2_ADDRESS}</div>
                  <Badge className="mt-1 bg-green-500/10 text-green-500 border-green-500/20 text-xs">Deployed ✓</Badge>
                  <Badge className="mt-1 ml-1 bg-green-500/10 text-green-500 border-green-500/20 text-xs">Executor Linked ✓</Badge>
                  <Badge className="mt-1 ml-1 bg-blue-500/10 text-blue-400 border-blue-500/20 text-xs">Aave Added ✓</Badge>
                </div>
              </CardContent>
            </Card>
            <Card className="border-green-500/20 bg-green-500/5">
              <CardContent className="p-4 flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                <div>
                  <div className="font-medium text-sm">LiquidationExecutorV2</div>
                  <div className="text-xs font-mono text-muted-foreground">0x0160B3d6434A6823C2b35d81c74a8eb6426C0916</div>
                  <Badge className="mt-1 bg-green-500/10 text-green-500 border-green-500/20 text-xs">Deployed ✓</Badge>
                  <Badge className="mt-1 ml-1 bg-blue-500/10 text-blue-400 border-blue-500/20 text-xs">Linked ✓</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>

        {/* Steps */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5 text-primary" />
            Deployment Steps
          </h2>
          <div className="space-y-3">
            {steps.map((step, i) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + i * 0.05 }}
              >
                <Card className="border-border hover:border-primary/20 transition-colors">
                  <CardContent className="p-4 flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-sm shrink-0">
                      {step.num}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium">{step.title}</div>
                      <div className="text-sm text-muted-foreground mt-0.5">{step.description}</div>
                      {step.action && <div className="mt-2">{step.action}</div>}
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0 mt-1" />
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Constructor Args */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <h2 className="text-xl font-bold mb-4">Constructor Arguments</h2>
          <CodeBlock code={EXECUTOR_CONSTRUCTOR_ARGS} label="Constructor Args (paste into Remix Deploy tab)" />
        </motion.div>

        {/* Contract Source */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <h2 className="text-xl font-bold mb-4">Contract Source Code</h2>
          <CodeBlock code={EXECUTOR_SOURCE} label="LiquidationExecutorV2.sol" />
        </motion.div>

        {/* IntentRegistryV2 Source */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}>
          <h2 className="text-xl font-bold mb-2">IntentRegistryV2 Source Code</h2>
          <p className="text-muted-foreground text-sm mb-4">
            Use this to load the deployed registry in Remix via <strong>At Address</strong>, then call <code className="bg-black/30 px-1 rounded text-primary">setLiquidationExecutor</code>.
          </p>
          <IntentRegistrySource />
        </motion.div>

        {/* After Deployment */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-primary" />
                After Deployment
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-start gap-3">
                <span className="text-primary font-bold">1.</span>
                <span>Copy the deployed contract address from Remix</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-primary font-bold">2.</span>
                <span>
                  On IntentRegistryV2 ({INTENT_REGISTRY_V2_ADDRESS.slice(0, 10)}...), call{" "}
                  <code className="bg-black/30 px-1 rounded text-primary">setLiquidationExecutor(address)</code>
                </span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-primary font-bold">3.</span>
                <span>
                  Update <code className="bg-black/30 px-1 rounded text-primary">LIQUIDATION_EXECUTOR_V2.address</code> in{" "}
                  <code className="bg-black/30 px-1 rounded">src/lib/contracts.ts</code>
                </span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-primary font-bold">4.</span>
                <span>Batch liquidations in the Protocol Adapters tab will be fully enabled</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Links */}
        <div className="flex flex-wrap gap-3 justify-center pb-8">
          <Button
            variant="outline"
            className="gap-2 border-border/60"
            onClick={() => window.open(`https://amoy.polygonscan.com/address/${INTENT_REGISTRY_V2_ADDRESS}`, "_blank")}
          >
            <ExternalLink className="w-4 h-4" />
            IntentRegistry on Explorer
          </Button>
          <Button
            variant="outline"
            className="gap-2 border-border/60"
            onClick={() => window.open("https://remix.ethereum.org", "_blank")}
          >
            <Terminal className="w-4 h-4" />
            Open Remix IDE
          </Button>
          <Link to="/dashboard">
            <Button className="gap-2 bg-primary text-black hover:bg-primary/90">
              ← Back to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}