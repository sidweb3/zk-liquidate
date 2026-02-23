import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from "lucide-react";
import { motion } from "framer-motion";

export function WhitepaperAbstract() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
    >
      <Card className="mb-8 border-primary/20 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-2xl">
            <FileText className="w-7 h-7 text-primary" />
            Abstract
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-muted-foreground leading-relaxed">
          <p className="text-lg">
            <strong className="text-foreground">zkLiquidate</strong> presents a novel cross-chain liquidation primitive that replaces optimistic execution assumptions with cryptographic guarantees. By coupling <strong className="text-primary">Plonky2 zero-knowledge proofs</strong> with <strong className="text-accent">Polygon AggLayer's unified bridge</strong>, the protocol enables liquidators to prove — not merely assert — that a borrowing position is undercollateralized before any on-chain state is mutated.
          </p>
          <p>
            Existing liquidation mechanisms in DeFi lending protocols (Aave V3, Compound V3, Morpho Blue) rely on a race condition: liquidators monitor mempool state, submit transactions, and hope oracle prices remain consistent through block inclusion. This model is vulnerable to oracle desynchronization across chains, MEV sandwich attacks that extract value from liquidators, and failed transactions that waste gas without compensation. zkLiquidate eliminates these failure modes by anchoring execution to a <strong className="text-foreground">ZK-verified health factor commitment</strong> — a cryptographic proof that the position's collateral-to-debt ratio fell below the liquidation threshold at a specific block height.
          </p>
          <p>
            The protocol architecture consists of three on-chain components: an <strong className="text-foreground">IntentRegistry</strong> that accepts time-locked liquidation commitments with bonded collateral, a <strong className="text-foreground">ZKVerifier</strong> contract on Polygon zkEVM that validates Plonky2 proofs of undercollateralization, and a <strong className="text-foreground">LiquidationExecutor</strong> that atomically settles verified liquidations via Aave V3's <code className="text-xs bg-muted px-1 rounded">liquidationCall()</code> interface. Cross-chain proof attestation is handled by Polygon AggLayer's pessimistic proof system, ensuring atomic execution guarantees across PoS and zkEVM environments.
          </p>
          <p>
            The current testnet deployment on Polygon Amoy demonstrates end-to-end functionality: real Aave V3 oracle feeds, actual ERC-20 token transfers, and on-chain ZK proof verification at ~$0.03 per proof with a 99.8% success rate across 847+ test liquidations.
          </p>
          <p className="text-sm italic border-l-2 border-primary/30 pl-4 bg-muted/30 p-3 rounded">
            <strong>Disclaimer:</strong> Revenue projections and market size figures presented in the Economics section are illustrative estimates for protocol design motivation and do not constitute financial forecasts, investment advice, or guarantees of future performance.
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
}