import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

export function WhitepaperEconomics() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
    >
      <Card className="border-border bg-card/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-2xl">
            <TrendingUp className="w-6 h-6 text-green-500" />
            4. Economic Model & Incentive Design
          </CardTitle>
        </CardHeader>
        <CardContent className="text-muted-foreground space-y-4 leading-relaxed">
          <h4 className="font-bold text-foreground text-lg">4.1 Liquidation Reward Structure</h4>
          <p>
            Aave V3 provides a liquidation bonus of 5–10% on the collateral asset depending on the asset's risk parameters. zkLiquidate captures a 5% protocol fee from this bonus, with the remaining proceeds distributed as follows:
          </p>
          <div className="space-y-3">
            <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
              <div className="font-bold text-green-500 mb-2">Liquidator — 90% of bonus</div>
              <p className="text-sm">The executing liquidator receives the majority of the liquidation bonus as compensation for capital deployment, gas costs, and proof generation overhead. The ZK proof requirement filters out low-quality liquidation attempts, concentrating rewards among technically capable participants.</p>
            </div>
            <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
              <div className="font-bold text-primary mb-2">Protocol Treasury — 5% of bonus</div>
              <p className="text-sm">Funds protocol development, audits, and infrastructure. Treasury is governed by a 3-of-5 multi-sig during the pre-DAO phase, transitioning to on-chain governance upon zkLIQ token launch.</p>
            </div>
            <div className="p-4 rounded-lg bg-accent/10 border border-accent/20">
              <div className="font-bold text-accent mb-2">Insurance Pool — 5% of bonus</div>
              <p className="text-sm">Accumulates reserves to cover edge cases: oracle failures, bridge delays, or smart contract bugs that result in failed liquidations. Pool participants earn yield proportional to their stake.</p>
            </div>
          </div>

          <h4 className="font-bold text-foreground text-lg mt-6">4.2 Bond Mechanics & Slashing</h4>
          <p>
            Every intent requires a 0.1 POL bond deposited to the IntentRegistry. The bond serves two purposes: spam prevention (raising the cost of invalid intent submissions) and slashing collateral (penalizing liquidators who submit proofs for positions that are not actually undercollateralized). If a proof fails on-chain verification, the bond is transferred to the insurance pool. If the intent expires without execution, the bond is returned minus a small gas reimbursement to the relayer.
          </p>

          <h4 className="font-bold text-foreground text-lg mt-6">4.3 ZK Proof Cost Analysis</h4>
          <p>
            Proof generation costs are borne by the liquidator off-chain. On commodity hardware (8-core CPU, 16GB RAM), Plonky2 proof generation takes ~4.2 seconds and consumes negligible compute cost relative to liquidation profits. On-chain verification costs ~180,000 gas on Polygon zkEVM, approximately $0.03 at current gas prices. For a typical liquidation of $10,000 in debt with a 7.5% bonus, the liquidator earns ~$675 net of all costs — a 22,400x return on proof generation overhead.
          </p>

          <h4 className="font-bold text-foreground text-lg mt-6">4.4 zkLIQ Governance Token</h4>
          <p>
            The zkLIQ token governs protocol parameters: liquidation fee rates, insurance pool allocation ratios, adapter whitelisting, and circuit upgrade proposals. Token distribution is designed to align long-term incentives: 40% to community and liquidators (vested over 2 years via liquidation mining), 20% to the core team (4-year linear vest with 1-year cliff), 20% to the protocol treasury (governed by DAO), and 20% to ecosystem grants for adapter developers and auditors.
          </p>

          <h4 className="font-bold text-foreground text-lg mt-6">4.5 Projected Protocol Economics</h4>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li><strong>Year 1 Target:</strong> $2.5M in liquidation volume, $125K protocol revenue</li>
            <li><strong>Year 2 Target:</strong> $25M in liquidation volume, $1.25M protocol revenue</li>
            <li><strong>Year 3 Target:</strong> $100M+ in liquidation volume, $5M+ protocol revenue</li>
          </ul>
          <p className="text-sm italic mt-3">
            <em>These figures are illustrative projections based on current DeFi liquidation market sizing and do not constitute financial forecasts or guarantees of future performance.</em>
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
}