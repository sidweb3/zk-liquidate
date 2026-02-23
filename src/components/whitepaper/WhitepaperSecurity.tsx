import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lock, CheckCircle2, AlertTriangle, Shield } from "lucide-react";
import { motion } from "framer-motion";

export function WhitepaperSecurity() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.7 }}
    >
      <Card className="border-border bg-card/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-2xl">
            <Lock className="w-6 h-6 text-secondary" />
            5. Security Model & Threat Analysis
          </CardTitle>
        </CardHeader>
        <CardContent className="text-muted-foreground space-y-4 leading-relaxed">
          <p>
            The security of zkLiquidate rests on three independent guarantees: the soundness of the Plonky2 proof system, the correctness of the Groth16 verifier contract, and the atomicity of AggLayer cross-chain execution. A complete protocol compromise requires breaking all three simultaneously — a significantly higher bar than optimistic liquidation systems that rely solely on economic incentives.
          </p>

          <h4 className="font-bold text-foreground text-lg mt-2">5.1 ZK Proof Soundness</h4>
          <p>
            Plonky2 is a recursive STARK system with a security level of 100 bits, based on the hardness of the discrete logarithm problem over the Goldilocks field. The circuit's constraint system is formally specified and the proving key is generated via a trusted setup ceremony. A malicious prover cannot generate a valid proof for a position with health factor ≥ 1.0 without breaking the underlying cryptographic assumption — computationally infeasible with current hardware.
          </p>

          <h4 className="font-bold text-foreground text-lg mt-4">5.2 Identified Vulnerabilities & Remediation Status</h4>
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 rounded-lg bg-green-500/10 border border-green-500/20">
              <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
              <div>
                <div className="font-bold text-green-500 mb-1">Reentrancy in LiquidationExecutor (Resolved)</div>
                <p className="text-sm">The <code className="text-xs bg-black/30 px-1 rounded">execute()</code> function previously called external Aave contracts before updating internal state, creating a reentrancy vector. Resolved by adding OpenZeppelin's <code className="text-xs bg-black/30 px-1 rounded">ReentrancyGuard</code> modifier and restructuring to follow the checks-effects-interactions pattern.</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg bg-green-500/10 border border-green-500/20">
              <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
              <div>
                <div className="font-bold text-green-500 mb-1">Oracle Staleness Attack (Resolved)</div>
                <p className="text-sm">Without a staleness check, an attacker could generate a valid proof using stale oracle prices from a period when a position was undercollateralized, then submit it after the position recovered. The ZKVerifier now enforces a 60-second maximum staleness window: <code className="text-xs bg-black/30 px-1 rounded">require(block.timestamp - priceTimestamp &lt;= 60, "Stale oracle")</code>.</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
              <AlertTriangle className="w-5 h-5 text-yellow-500 mt-0.5 flex-shrink-0" />
              <div>
                <div className="font-bold text-yellow-500 mb-1">Bond Slashing Deadline Race (In Progress)</div>
                <p className="text-sm">If an intent's deadline passes between proof generation and on-chain submission, the bond is returned but the proof is not slashed — allowing a liquidator to probe positions without economic risk. Fix: extend the slashing window to <code className="text-xs bg-black/30 px-1 rounded">deadline + GRACE_PERIOD</code> and slash bonds for proofs submitted against expired intents.</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
              <AlertTriangle className="w-5 h-5 text-yellow-500 mt-0.5 flex-shrink-0" />
              <div>
                <div className="font-bold text-yellow-500 mb-1">Centralized Admin Key (In Progress)</div>
                <p className="text-sm">Protocol parameters (fee rates, oracle addresses, adapter whitelist) are currently controlled by a single EOA. Migrating to a 3-of-5 Gnosis Safe multi-sig with a 48-hour timelock on all parameter changes. Full DAO governance via zkLIQ token is planned for mainnet launch.</p>
              </div>
            </div>
          </div>

          <h4 className="font-bold text-foreground text-lg mt-4">5.3 Additional Attack Vectors Considered</h4>
          <div className="space-y-2 text-sm">
            <div className="flex items-start gap-2">
              <Shield className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
              <p><strong className="text-foreground">Proof Replay:</strong> Intent hashes are single-use and stored in a <code className="text-xs bg-muted px-1 rounded">mapping(bytes32 =&gt; bool)</code>. A proof submitted for an already-executed intent will revert.</p>
            </div>
            <div className="flex items-start gap-2">
              <Shield className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
              <p><strong className="text-foreground">Front-Running Proofs:</strong> Proofs are bound to the submitting liquidator's address via the intent hash. A front-runner who copies a proof transaction cannot claim the reward — the executor validates <code className="text-xs bg-muted px-1 rounded">msg.sender == intent.liquidator</code>.</p>
            </div>
            <div className="flex items-start gap-2">
              <Shield className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
              <p><strong className="text-foreground">Bridge Censorship:</strong> If the AggLayer bridge censors a proof relay, the intent expires and the bond is returned. The liquidator can resubmit via an alternative relay path. No funds are permanently locked.</p>
            </div>
          </div>

          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 mt-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-yellow-500 mt-0.5 flex-shrink-0" />
              <div>
                <div className="font-bold text-yellow-500 mb-2">Formal Audit Status</div>
                <p className="text-sm">The protocol is currently in testnet phase. Formal third-party security audits by OpenZeppelin and Trail of Bits are scheduled for Q1 2026, prior to any mainnet deployment. The codebase will not be deployed to mainnet until audit findings are fully remediated and a public bug bounty program has been active for a minimum of 30 days.</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}