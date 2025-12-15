import { motion } from "framer-motion";
import { CheckCircle2, TrendingUp, Users, Globe, Shield, Activity } from "lucide-react";

export function WhyUsSection() {
  const advantages = [
    {
      icon: CheckCircle2,
      title: "First-Mover Advantage",
      desc: "Only ZK-verified cross-chain liquidation protocol on Polygon AggLayer with institutional-grade security.",
      color: "text-primary"
    },
    {
      icon: TrendingUp,
      title: "Clear Revenue Streams",
      desc: "Earn from liquidation bonuses (5-10%), verification fees ($0.03/proof), and protocol integration fees.",
      color: "text-secondary"
    },
    {
      icon: Users,
      title: "Institutional Appeal",
      desc: "Compliance-ready with audit trails, insurance coverage, and regulatory-friendly architecture.",
      color: "text-accent"
    },
    {
      icon: Globe,
      title: "Polygon Stack Advantage",
      desc: "Native AggLayer integration, zkEVM compatibility, and CDK chain support for seamless cross-chain operations.",
      color: "text-primary"
    },
    {
      icon: Shield,
      title: "Battle-Tested Security",
      desc: "Plonky2 ZK proofs, time-locked intents, and multi-signature verification ensure maximum security.",
      color: "text-secondary"
    },
    {
      icon: Activity,
      title: "AI-Enhanced Oracle",
      desc: "Off-chain risk oracle with AI integration provides real-time market data and risk assessment.",
      color: "text-accent"
    }
  ];

  return (
    <section className="container mx-auto px-6 py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Why zkLiquidate?</h2>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          The only protocol combining ZK proofs with cross-chain liquidations
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {advantages.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08, duration: 0.5 }}
            whileHover={{ y: -5, scale: 1.02 }}
            className="p-8 rounded-2xl bg-card border border-border hover:border-primary/30 transition-all duration-300 group"
          >
            <motion.div 
              className="mb-4"
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <item.icon className={`w-10 h-10 ${item.color}`} />
            </motion.div>
            <h3 className="text-xl font-bold mb-3">{item.title}</h3>
            <p className="text-muted-foreground leading-relaxed">{item.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
