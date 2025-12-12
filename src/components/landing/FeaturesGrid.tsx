import { motion } from "framer-motion";
import { Shield, Activity, Lock, Zap } from "lucide-react";

const features = [
  {
    icon: Shield,
    title: "ZK Verified",
    desc: "Every liquidation parameter is verified via Plonky2 proofs before execution.",
    color: "text-primary"
  },
  {
    icon: Activity,
    title: "AggLayer Native",
    desc: "Atomic cross-chain settlement across Polygon zkEVM and CDK chains.",
    color: "text-secondary"
  },
  {
    icon: Lock,
    title: "Front-Run Proof",
    desc: "Time-locked intents prevent MEV exploitation and guarantee execution.",
    color: "text-accent"
  },
  {
    icon: Zap,
    title: "Instant Finality",
    desc: "5-second verification time with $0.03 cost per proof.",
    color: "text-yellow-400"
  }
];

export function FeaturesGrid() {
  return (
    <section className="container mx-auto px-6 py-20">
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((feature, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-6 rounded-2xl bg-card border border-border hover:border-primary/50 transition-colors group"
          >
            <div className="mb-4 p-3 rounded-xl bg-background w-fit group-hover:scale-110 transition-transform">
              <feature.icon className={`w-8 h-8 ${feature.color}`} />
            </div>
            <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
            <p className="text-muted-foreground">{feature.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
