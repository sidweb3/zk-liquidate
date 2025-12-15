import { motion } from "framer-motion";
import { Shield, Activity, Lock, Zap, Brain, BarChart3, Bot, Trophy } from "lucide-react";

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
    desc: "In testnet simulations: ~5-second verification time with ~$0.03 estimated cost per proof.",
    color: "text-yellow-400"
  },
  {
    icon: Brain,
    title: "AI Risk Scoring",
    desc: "Machine learning models predict liquidation profitability and optimal execution timing.",
    color: "text-purple-400"
  },
  {
    icon: BarChart3,
    title: "Advanced Analytics",
    desc: "Real-time performance tracking with 7-day metrics and success rate monitoring.",
    color: "text-blue-400"
  },
  {
    icon: Bot,
    title: "Automated Bot",
    desc: "Configure and deploy automated liquidation strategies with custom parameters.",
    color: "text-green-400"
  },
  {
    icon: Trophy,
    title: "Reputation System",
    desc: "Earn badges and build reputation through successful liquidations and community participation.",
    color: "text-orange-400"
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export function FeaturesGrid() {
  return (
    <section className="container mx-auto px-6 py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Powerful Features</h2>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Built with cutting-edge technology for institutional-grade liquidations
        </p>
      </motion.div>

      <motion.div 
        className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
      >
        {features.map((feature, i) => (
          <motion.div
            key={i}
            variants={itemVariants}
            transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
            whileHover={{ y: -5 }}
            className="p-6 rounded-2xl bg-card border border-border hover:border-primary/50 transition-all duration-300 group"
          >
            <motion.div 
              className="mb-4 p-3 rounded-xl bg-background w-fit"
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <feature.icon className={`w-8 h-8 ${feature.color}`} />
            </motion.div>
            <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
            <p className="text-muted-foreground">{feature.desc}</p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}