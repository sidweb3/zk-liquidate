import { motion } from "framer-motion";
import { Shield, Zap, Globe, Brain, BarChart3, Lock, ArrowRight } from "lucide-react";

const features = [
  {
    icon: Shield,
    title: "ZK Proof Verification",
    description: "Every liquidation intent is cryptographically verified using Plonky2 proofs on Polygon zkEVM before execution.",
    tag: "Core",
    tagColor: "text-primary bg-primary/10 border-primary/20",
    gradient: "from-primary/10 to-transparent",
  },
  {
    icon: Globe,
    title: "Cross-Chain Execution",
    description: "Liquidate positions across Polygon PoS, zkEVM, and AggLayer chains in a single atomic transaction.",
    tag: "AggLayer",
    tagColor: "text-purple-400 bg-purple-400/10 border-purple-400/20",
    gradient: "from-purple-500/10 to-transparent",
  },
  {
    icon: Brain,
    title: "AI Risk Scoring",
    description: "Machine learning models score each liquidation opportunity for profitability, gas efficiency, and execution risk.",
    tag: "AI",
    tagColor: "text-blue-400 bg-blue-400/10 border-blue-400/20",
    gradient: "from-blue-500/10 to-transparent",
  },
  {
    icon: Zap,
    title: "MEV Protection",
    description: "Time-locked intents with ZK commitments prevent front-running and sandwich attacks on liquidation transactions.",
    tag: "Security",
    tagColor: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20",
    gradient: "from-yellow-500/10 to-transparent",
  },
  {
    icon: BarChart3,
    title: "Batch Liquidations",
    description: "Execute up to 50 liquidation positions in a single ZK-verified transaction, saving up to 28% on gas costs.",
    tag: "Wave 6",
    tagColor: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
    gradient: "from-emerald-500/10 to-transparent",
  },
  {
    icon: Lock,
    title: "Insurance Pool",
    description: "Stake MATIC to earn yield from liquidation fees while providing a safety net for protocol participants.",
    tag: "DeFi",
    tagColor: "text-orange-400 bg-orange-400/10 border-orange-400/20",
    gradient: "from-orange-500/10 to-transparent",
  },
];

export function FeaturesGrid() {
  return (
    <section className="container mx-auto px-6 py-24 border-t border-white/5">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="mb-14"
      >
        <div className="text-xs font-semibold text-primary/70 uppercase tracking-widest mb-3">Protocol Features</div>
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white max-w-lg leading-tight">
            Built for institutional-grade DeFi
          </h2>
          <p className="text-white/40 max-w-sm text-sm leading-relaxed">
            Every component is designed for security, performance, and reliability at scale.
          </p>
        </div>
      </motion.div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {features.map((feature, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08, duration: 0.5 }}
            className="group relative rounded-xl border border-white/8 bg-white/[0.02] p-6 hover:border-white/15 hover:bg-white/[0.04] transition-all duration-300 overflow-hidden"
          >
            {/* Gradient background on hover */}
            <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

            <div className="relative">
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/8 flex items-center justify-center group-hover:border-white/15 transition-colors">
                  <feature.icon className="w-5 h-5 text-white/60 group-hover:text-white/80 transition-colors" />
                </div>
                <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold border ${feature.tagColor}`}>
                  {feature.tag}
                </span>
              </div>

              <h3 className="text-sm font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-xs text-white/40 leading-relaxed">{feature.description}</p>

              <div className="mt-4 flex items-center gap-1 text-xs text-white/20 group-hover:text-primary/60 transition-colors">
                <span>Learn more</span>
                <ArrowRight className="w-3 h-3" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}