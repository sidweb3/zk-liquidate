import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, Shield, Zap, Globe, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router";

interface HeroSectionProps {
  onConnectWallet: () => void;
}

export function HeroSection({ onConnectWallet }: HeroSectionProps) {
  const navigate = useNavigate();

  return (
    <section className="relative overflow-hidden min-h-[92vh] flex flex-col justify-center">
      {/* Animated grid background */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0,255,136,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,255,136,0.04) 1px, transparent 1px)
          `,
          backgroundSize: "50px 50px",
        }}
      />
      {/* Radial fade overlay */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-black/60 via-transparent to-black" />

      {/* Glow orbs */}
      <motion.div
        animate={{ scale: [1, 1.15, 1], opacity: [0.12, 0.2, 0.12] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-primary/15 rounded-full blur-[140px] -z-10"
      />
      <motion.div
        animate={{ scale: [1, 1.1, 1], opacity: [0.06, 0.12, 0.06] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute top-1/3 left-1/4 w-[400px] h-[300px] bg-accent/10 rounded-full blur-[120px] -z-10"
      />

      <div className="container mx-auto px-6 pt-16 pb-20">
        <div className="max-w-5xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/30 bg-primary/8 text-primary text-xs font-medium mb-8"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            Live on Polygon Amoy Testnet
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[1.02] mb-6"
          >
            <span className="text-white">ZK-Verified</span>
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-emerald-300 to-primary/60">
              Cross-Chain
            </span>
            <br />
            <span className="text-white/80">Liquidations</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-white/45 max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Institutional-grade liquidation protocol on Polygon AggLayer. Eliminates oracle desync,
            front-running, and execution failures through cryptographic proof verification.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-3 justify-center mb-20"
          >
            <Button
              size="lg"
              className="bg-primary text-black hover:bg-primary/90 font-semibold px-8 h-12 text-sm shadow-lg shadow-primary/20"
              onClick={onConnectWallet}
            >
              Launch App
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white/10 text-white/60 hover:text-white hover:bg-white/5 h-12 text-sm px-8"
              onClick={() => navigate("/whitepaper")}
            >
              Read Whitepaper
            </Button>
          </motion.div>

          {/* Key metrics row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="grid grid-cols-3 gap-px bg-white/5 rounded-2xl overflow-hidden border border-white/8 max-w-2xl mx-auto"
          >
            {[
              { icon: Shield, label: "ZK Verified", value: "Plonky2 Proofs" },
              { icon: Zap, label: "Proof Time", value: "~4.2 seconds" },
              { icon: Globe, label: "Network", value: "Polygon AggLayer" },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 + i * 0.1 }}
                className="bg-black/70 px-6 py-5 text-center hover:bg-white/[0.03] transition-colors"
              >
                <item.icon className="w-5 h-5 text-primary mx-auto mb-2" />
                <div className="text-white font-semibold text-sm">{item.value}</div>
                <div className="text-white/35 text-xs mt-0.5">{item.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1"
      >
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown className="w-5 h-5 text-white/20" />
        </motion.div>
      </motion.div>
    </section>
  );
}