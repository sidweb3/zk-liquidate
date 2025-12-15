import { motion } from "framer-motion";
import { CheckCircle2, ArrowRight } from "lucide-react";

export function RoadmapSection() {
  return (
    <section className="container mx-auto px-6 py-20 border-t border-border">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Project Roadmap</h2>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Building the future of cross-chain liquidations
        </p>
      </motion.div>

      <div className="max-w-4xl mx-auto space-y-8">
        {/* Current Phase */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative pl-8 border-l-4 border-primary"
        >
          <div className="absolute -left-3 top-0 w-5 h-5 rounded-full bg-primary animate-pulse" />
          <div className="bg-card border border-primary/30 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <span className="px-3 py-1 rounded-full bg-primary/20 text-primary text-sm font-bold">CURRENT PHASE</span>
              <span className="text-muted-foreground">December 2025</span>
            </div>
            <h3 className="text-2xl font-bold mb-3">Phase 1: Protocol Launch & Testnet</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <span>Deploy Intent Registry on Polygon PoS testnet</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <span>Implement ZK Verifier with Plonky2 on Polygon zkEVM testnet</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <span>Launch AI-enhanced Risk Oracle with real-time price feeds</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <span>Community testing and bug bounty program</span>
              </li>
            </ul>
          </div>
        </motion.div>

        {/* Phase 2 */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" }}
          className="relative pl-8 border-l-4 border-secondary/50"
        >
          <div className="absolute -left-3 top-0 w-5 h-5 rounded-full bg-secondary/50" />
          <div className="bg-card border border-border rounded-xl p-6 hover:border-secondary/30 transition-all">
            <div className="flex items-center gap-3 mb-3">
              <span className="px-3 py-1 rounded-full bg-secondary/20 text-secondary text-sm font-bold">UPCOMING</span>
              <span className="text-muted-foreground">Q1 2026</span>
            </div>
            <h3 className="text-2xl font-bold mb-3">Phase 2: Mainnet Launch & Integrations</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li className="flex items-start gap-2">
                <ArrowRight className="w-5 h-5 text-secondary mt-0.5 flex-shrink-0" />
                <span>Deploy full protocol on Polygon mainnet</span>
              </li>
              <li className="flex items-start gap-2">
                <ArrowRight className="w-5 h-5 text-secondary mt-0.5 flex-shrink-0" />
                <span>Integrate with major DeFi lending protocols (Aave, Compound)</span>
              </li>
              <li className="flex items-start gap-2">
                <ArrowRight className="w-5 h-5 text-secondary mt-0.5 flex-shrink-0" />
                <span>Launch liquidator incentive program</span>
              </li>
              <li className="flex items-start gap-2">
                <ArrowRight className="w-5 h-5 text-secondary mt-0.5 flex-shrink-0" />
                <span>Security audits by leading firms (OpenZeppelin, Trail of Bits)</span>
              </li>
            </ul>
          </div>
        </motion.div>

        {/* Phase 3 */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
          className="relative pl-8 border-l-4 border-accent/50"
        >
          <div className="absolute -left-3 top-0 w-5 h-5 rounded-full bg-accent/50" />
          <div className="bg-card border border-border rounded-xl p-6 hover:border-accent/30 transition-all">
            <div className="flex items-center gap-3 mb-3">
              <span className="px-3 py-1 rounded-full bg-accent/20 text-accent text-sm font-bold">FUTURE</span>
              <span className="text-muted-foreground">Q2-Q3 2026</span>
            </div>
            <h3 className="text-2xl font-bold mb-3">Phase 3: Expansion & Governance</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li className="flex items-start gap-2">
                <ArrowRight className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                <span>Expand to additional AggLayer chains and L2s</span>
              </li>
              <li className="flex items-start gap-2">
                <ArrowRight className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                <span>Launch governance token and DAO</span>
              </li>
              <li className="flex items-start gap-2">
                <ArrowRight className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                <span>Institutional partnerships and insurance coverage</span>
              </li>
              <li className="flex items-start gap-2">
                <ArrowRight className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                <span>Advanced AI risk models and predictive liquidation alerts</span>
              </li>
            </ul>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
