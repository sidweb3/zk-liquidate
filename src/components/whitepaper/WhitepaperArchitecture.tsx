import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Code } from "lucide-react";
import { motion } from "framer-motion";

export function WhitepaperArchitecture() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    >
      <Card className="border-border bg-card/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-2xl">
            <Code className="w-6 h-6 text-accent" />
            2. Technical Architecture
          </CardTitle>
        </CardHeader>
        <CardContent className="text-muted-foreground space-y-4 leading-relaxed">
          <p>
            The protocol is composed of three smart contract layers and an off-chain proving service. Each layer has a distinct trust boundary: the IntentRegistry and LiquidationExecutor operate on Polygon Amoy (PoS-compatible EVM), the ZKVerifier operates on Polygon zkEVM, and the AggLayer bridge provides the cross-chain proof relay.
          </p>

          <h4 className="font-bold text-foreground text-lg mt-6">2.1 IntentRegistryV2 — Polygon Amoy</h4>
          <div className="bg-muted/30 p-4 rounded-lg border border-border my-3 flex items-center justify-between gap-2 flex-wrap">
            <code className="text-xs font-mono">0xb9Fc157d8025892Ac3382F7a70c58DcB8D7de2A1</code>
            <a
              href="https://amoy.polygonscan.com/address/0xb9Fc157d8025892Ac3382F7a70c58DcB8D7de2A1"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-accent hover:underline"
            >
              View on Explorer ↗
            </a>
          </div>
          <p>
            The IntentRegistry is the protocol's entry point. A liquidator calls <code className="text-xs bg-muted px-1 rounded">submitIntent(address user, address collateral, address debt, uint256 minHealthFactor, uint256 deadline)</code> with a minimum 0.1 POL bond. The contract computes a deterministic <code className="text-xs bg-muted px-1 rounded">intentHash = keccak256(abi.encodePacked(msg.sender, user, collateral, debt, minHealthFactor, deadline, block.number))</code> and emits an <code className="text-xs bg-muted px-1 rounded">IntentSubmitted</code> event. The bond is held in escrow and slashed if the submitted proof is found invalid or the intent expires without execution.
          </p>
          <p>
            Time-locking prevents front-running: intents have a minimum 2-block delay before they can be executed, giving the ZK prover time to generate a proof without racing against MEV bots. The registry enforces single-use intent hashes via a <code className="text-xs bg-muted px-1 rounded">mapping(bytes32 =&gt; bool) public usedIntents</code> to prevent replay attacks. V2 adds multi-protocol support via <code className="text-xs bg-muted px-1 rounded">supportedProtocols</code> mapping and a linked <code className="text-xs bg-muted px-1 rounded">liquidationExecutor</code> address.
          </p>

          <h4 className="font-bold text-foreground text-lg mt-6">2.2 ZKVerifier — Polygon zkEVM</h4>
          <div className="bg-muted/30 p-4 rounded-lg border border-border my-3 flex items-center justify-between gap-2 flex-wrap">
            <code className="text-xs font-mono">0x8C935B982416673cF9633DdCC4E9Dc4ec2846Ab2</code>
            <a
              href="https://testnet-zkevm.polygonscan.com/address/0x8C935B982416673cF9633DdCC4E9Dc4ec2846Ab2"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-accent hover:underline"
            >
              View on Explorer ↗
            </a>
          </div>
          <p>
            The ZKVerifier contract implements a Groth16 verifier generated from a Plonky2 circuit that encodes the following constraint system: given Chainlink oracle prices <em>P_c</em> (collateral) and <em>P_d</em> (debt), user balances <em>B_c</em> and <em>B_d</em>, and liquidation threshold <em>LT</em>, prove that <code className="text-xs bg-muted px-1 rounded">(B_c × P_c × LT) / (B_d × P_d) &lt; 1e18</code>. The circuit takes oracle price commitments as public inputs and account state as private witnesses, ensuring price data cannot be manipulated post-proof.
          </p>
          <p>
            Proof generation runs off-chain using the Plonky2 Rust library, completing in approximately 4.2 seconds on commodity hardware. The resulting proof is ~2KB and verifies on-chain in a single EVM call costing ~180,000 gas (~$0.03 on zkEVM). The verifier enforces a 60-second oracle staleness window: if the price commitment timestamp is older than 60 seconds relative to <code className="text-xs bg-muted px-1 rounded">block.timestamp</code>, the proof is rejected.
          </p>
          <div className="bg-black/50 rounded-lg p-4 font-mono text-xs border border-border">
            <div className="text-green-400">{"// ZKVerifier.sol — core verification logic"}</div>
            <div className="text-muted-foreground mt-2">{"function verifyLiquidationProof("}</div>
            <div className="text-blue-400 ml-4">{"uint256[2] calldata a,"}</div>
            <div className="text-blue-400 ml-4">{"uint256[2][2] calldata b,"}</div>
            <div className="text-blue-400 ml-4">{"uint256[2] calldata c,"}</div>
            <div className="text-blue-400 ml-4">{"uint256[4] calldata publicInputs"}</div>
            <div className="text-muted-foreground">{")"}</div>
            <div className="text-muted-foreground ml-4">{"external view returns (bool valid);"}</div>
          </div>

          <h4 className="font-bold text-foreground text-lg mt-6">2.3 LiquidationExecutorV2 — Polygon Amoy</h4>
          <div className="bg-muted/30 p-4 rounded-lg border border-border my-3 flex items-center justify-between gap-2 flex-wrap">
            <code className="text-xs font-mono">0x6cFe23FA3ed2D3df4ae2a4A2686514Fa8E634A9B</code>
            <a
              href="https://amoy.polygonscan.com/address/0x6cFe23FA3ed2D3df4ae2a4A2686514Fa8E634A9B"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-accent hover:underline"
            >
              View on Explorer ↗
            </a>
          </div>
          <p>
            The LiquidationExecutorV2 is the settlement layer. It receives the verified proof attestation from the AggLayer bridge, validates the intent hash against the IntentRegistryV2, and calls Aave V3's <code className="text-xs bg-muted px-1 rounded">IPool.liquidationCall(collateralAsset, debtAsset, user, debtToCover, receiveAToken)</code>. The contract is protected by OpenZeppelin's <code className="text-xs bg-muted px-1 rounded">ReentrancyGuard</code> and enforces that the caller holds a valid, unexpired intent. Reward distribution is atomic: liquidation proceeds are split 90/5/5 between liquidator, protocol treasury, and insurance pool within the same transaction.
          </p>

          <h4 className="font-bold text-foreground text-lg mt-6">2.4 ILiquidationAdapter — Multi-Protocol Interface</h4>
          <p>
            A standardized adapter interface decouples the executor from any specific lending protocol. Current adapters: Aave V3 (production), Compound V3 (integration testing), Morpho Blue (planned). Each adapter implements health factor querying and liquidation execution behind a common interface, allowing the ZK circuit to remain protocol-agnostic.
          </p>
          <div className="bg-black/50 rounded-lg p-4 font-mono text-xs border border-border">
            <div className="text-green-400">{"// ILiquidationAdapter.sol"}</div>
            <div className="text-muted-foreground mt-2">{"interface ILiquidationAdapter {"}</div>
            <div className="text-blue-400 ml-4">{"function getHealthFactor(address user) external view returns (uint256);"}</div>
            <div className="text-blue-400 ml-4">{"function getCollateralValue(address user, address asset) external view returns (uint256);"}</div>
            <div className="text-blue-400 ml-4">{"function executeLiquidation(address user, address collateral, uint256 amount) external returns (uint256 profit);"}</div>
            <div className="text-muted-foreground">{"}"}</div>
          </div>

          <h4 className="font-bold text-foreground text-lg mt-6">2.5 AggLayer Cross-Chain Relay</h4>
          <p>
            Polygon AggLayer's pessimistic proof system provides the cross-chain bridge between zkEVM (where proofs are verified) and Amoy (where liquidations execute). Rather than optimistic message passing with a challenge window, AggLayer requires a validity proof for every cross-chain state transition. This means the proof attestation from the ZKVerifier is itself wrapped in an AggLayer proof before being relayed to the LiquidationExecutorV2 — providing two layers of cryptographic verification.
          </p>

          <h4 className="font-bold text-foreground text-lg mt-6">2.6 Previous Contracts (Legacy)</h4>
          <p className="text-sm">
            The following contracts remain on-chain for reference but are superseded by the V2 deployment above:
          </p>
          <div className="bg-muted/20 rounded-lg border border-border/50 p-4 space-y-2 text-xs font-mono opacity-60">
            <div><span className="text-muted-foreground">IntentRegistry V1 (Amoy): </span><span>0x831F6F30cc0Aa68a9541B79c2289BF748DEC4a2a</span></div>
            <div><span className="text-muted-foreground">IntentRegistry Alt Deploy (Amoy): </span><span>0x177C8dDB569Bdd556C2090992e1f84df0Da5248C</span></div>
            <div><span className="text-muted-foreground">LiquidationExecutor Alt Deploy (Amoy): </span><span>0x0160B3d6434A6823C2b35d81c74a8eb6426C0916</span></div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}