import { useState } from "react";
import { Copy, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const INTENT_REGISTRY_V2_SOURCE = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract IntentRegistryV2 is ReentrancyGuard, Pausable, Ownable {

    struct Intent {
        address liquidator;
        bytes32 intentHash;
        address targetUser;
        address targetProtocol;
        uint256 targetHealthFactor;
        uint256 minPrice;
        uint256 deadline;
        uint256 stakeAmount;
        bool isExecuted;
        bool isCancelled;
        bool isSlashed;
        uint256 createdAt;
    }

    mapping(bytes32 => Intent) public intents;
    mapping(address => bool) public supportedProtocols;
    address public liquidationExecutor;

    uint256 public constant MAX_STAKE = 1000 ether;
    uint256 public constant SLASH_PERCENTAGE = 20;
    uint256 public constant CANCEL_TIMELOCK = 100;

    event IntentSubmitted(bytes32 indexed intentHash, address indexed liquidator, address targetUser);
    event IntentExecuted(bytes32 indexed intentHash, address indexed executor);
    event IntentCancelled(bytes32 indexed intentHash);
    event IntentSlashed(bytes32 indexed intentHash, uint256 slashedAmount);
    event ProtocolAdded(address indexed protocol);
    event LiquidationExecutorSet(address indexed executor);

    constructor() Ownable(msg.sender) {}

    function setLiquidationExecutor(address _executor) external onlyOwner {
        require(_executor != address(0), "Invalid executor");
        liquidationExecutor = _executor;
        emit LiquidationExecutorSet(_executor);
    }

    function addProtocol(address protocol) external onlyOwner {
        require(protocol != address(0), "Invalid protocol");
        supportedProtocols[protocol] = true;
        emit ProtocolAdded(protocol);
    }

    function submitIntent(
        bytes32 intentHash,
        address targetUser,
        address targetProtocol,
        uint256 targetHealthFactor,
        uint256 minPrice,
        uint256 deadline
    ) external payable nonReentrant whenNotPaused {
        require(intentHash != bytes32(0), "Invalid intent hash");
        require(targetUser != address(0), "Invalid target user");
        require(supportedProtocols[targetProtocol], "Unsupported protocol");
        require(targetHealthFactor > 0 && targetHealthFactor < 1e18, "Invalid health factor");
        require(deadline > block.number, "Invalid deadline");
        require(msg.value > 0 && msg.value <= MAX_STAKE, "Invalid stake");
        require(intents[intentHash].liquidator == address(0), "Intent exists");

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
            createdAt: block.number
        });

        emit IntentSubmitted(intentHash, msg.sender, targetUser);
    }

    function markExecuted(bytes32 intentHash) external {
        require(msg.sender == liquidationExecutor, "Not executor");
        Intent storage intent = intents[intentHash];
        require(!intent.isExecuted, "Already executed");
        intent.isExecuted = true;
        emit IntentExecuted(intentHash, msg.sender);
    }

    function cancelIntent(bytes32 intentHash) external nonReentrant {
        Intent storage intent = intents[intentHash];
        require(intent.liquidator == msg.sender, "Not liquidator");
        require(!intent.isExecuted, "Already executed");
        require(!intent.isCancelled, "Already cancelled");
        require(block.number >= intent.createdAt + CANCEL_TIMELOCK, "Timelock active");

        intent.isCancelled = true;
        uint256 refund = intent.stakeAmount;
        intent.stakeAmount = 0;

        (bool success,) = msg.sender.call{value: refund}("");
        require(success, "Refund failed");

        emit IntentCancelled(intentHash);
    }

    function slashIntent(bytes32 intentHash) external {
        require(msg.sender == liquidationExecutor || msg.sender == owner(), "Not authorized");
        Intent storage intent = intents[intentHash];
        require(!intent.isSlashed, "Already slashed");
        require(!intent.isExecuted, "Already executed");

        intent.isSlashed = true;
        uint256 slashAmount = (intent.stakeAmount * SLASH_PERCENTAGE) / 100;
        intent.stakeAmount -= slashAmount;

        emit IntentSlashed(intentHash, slashAmount);
    }

    function getIntent(bytes32 intentHash) external view returns (
        address liquidator, bytes32 intentHash_,
        address targetUser, address targetProtocol,
        uint256 targetHealthFactor, uint256 minPrice,
        uint256 deadline, uint256 stakeAmount,
        bool isExecuted, bool isCancelled, bool isSlashed, uint256 createdAt
    ) {
        Intent storage i = intents[intentHash];
        return (
            i.liquidator, i.intentHash, i.targetUser, i.targetProtocol,
            i.targetHealthFactor, i.minPrice, i.deadline, i.stakeAmount,
            i.isExecuted, i.isCancelled, i.isSlashed, i.createdAt
        );
    }

    function pause() external onlyOwner { _pause(); }
    function unpause() external onlyOwner { _unpause(); }
    receive() external payable {}
}`;

export default function IntentRegistrySource() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(INTENT_REGISTRY_V2_SOURCE);
    setCopied(true);
    toast.success("IntentRegistryV2.sol copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      <div className="p-4 rounded-lg border border-green-500/20 bg-green-500/5 text-sm text-green-300">
        <strong>✅ Active Registry:</strong> <code className="bg-black/30 px-1 rounded">0x177C8dDB569Bdd556C2090992e1f84df0Da5248C</code> — fully configured.{" "}
        <code className="bg-black/30 px-1 rounded">setLiquidationExecutor</code> and <code className="bg-black/30 px-1 rounded">addProtocol</code> (Aave V3) have both been called successfully.
        Use <strong>At Address</strong> in Remix with this address to interact with the live contract.
      </div>
      <div className="relative">
        <div className="flex items-center justify-between px-4 py-2 bg-black/60 border border-border rounded-t-lg">
          <span className="text-xs text-muted-foreground font-mono">IntentRegistryV2.sol</span>
          <Button variant="outline" size="sm" onClick={handleCopy} className="gap-2 border-border/60 hover:border-primary/40">
            {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? "Copied!" : "Copy"}
          </Button>
        </div>
        <pre className="bg-black/40 border border-t-0 border-border rounded-b-lg p-4 text-xs font-mono text-green-400 overflow-x-auto max-h-96 overflow-y-auto whitespace-pre-wrap break-all">
          {INTENT_REGISTRY_V2_SOURCE}
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
              Copy IntentRegistryV2.sol
            </>
          )}
        </button>
      </div>
    </div>
  );
}