import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, Shield, Zap, Activity, Lock, Wallet } from "lucide-react";
import { useNavigate } from "react-router";

export default function Landing() {
  const navigate = useNavigate();

  const handleConnectWallet = () => {
    navigate("/wallet-connect");
  };

  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden relative">
      {/* Background Gradients */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/10 rounded-full blur-[120px]" />
        <div className="absolute top-[40%] left-[40%] w-[20%] h-[20%] bg-accent/10 rounded-full blur-[100px]" />
      </div>

      {/* Navbar */}
      <nav className="container mx-auto px-6 py-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
            <Zap className="w-5 h-5 text-black" />
          </div>
          <span className="text-xl font-bold tracking-tighter">zkLiquidate</span>
        </div>
        <div className="flex gap-4">
          <Button 
            className="bg-primary text-primary-foreground hover:bg-primary/90"
            onClick={handleConnectWallet}
          >
            <Wallet className="mr-2 h-4 w-4" />
            Connect Wallet
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-20 text-center relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-block px-4 py-1.5 mb-6 rounded-full border border-primary/30 bg-primary/10 text-primary text-sm font-medium">
            Now Live on Polygon AggLayer
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-200 to-gray-400">
            Institutional Grade <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Cross-Chain Liquidations</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
            Unlock $50B+ in cross-chain lending with ZK-verified liquidation intents. 
            Eliminate oracle desync, front-running, and execution failures.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-primary text-primary-foreground hover:bg-primary/90 text-lg px-8"
              onClick={handleConnectWallet}
            >
              <Wallet className="mr-2 w-5 h-5" />
              Connect Wallet
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-primary/20 hover:bg-primary/10 text-lg px-8"
            >
              Read Whitepaper
            </Button>
          </div>
        </motion.div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-6 py-20">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              icon: <Shield className="w-8 h-8 text-primary" />,
              title: "ZK Verified",
              desc: "Every liquidation parameter is verified via Plonky2 proofs before execution."
            },
            {
              icon: <Activity className="w-8 h-8 text-secondary" />,
              title: "AggLayer Native",
              desc: "Atomic cross-chain settlement across Polygon zkEVM and CDK chains."
            },
            {
              icon: <Lock className="w-8 h-8 text-accent" />,
              title: "Front-Run Proof",
              desc: "Time-locked intents prevent MEV exploitation and guarantee execution."
            },
            {
              icon: <Zap className="w-8 h-8 text-yellow-400" />,
              title: "Instant Finality",
              desc: "5-second verification time with $0.03 cost per proof."
            }
          ].map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="p-6 rounded-2xl bg-card border border-border hover:border-primary/50 transition-colors group"
            >
              <div className="mb-4 p-3 rounded-xl bg-background w-fit group-hover:scale-110 transition-transform">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-y border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { label: "Total Value Secured", value: "$124M+" },
              { label: "Liquidations Executed", value: "14.2K" },
              { label: "Avg Verification Time", value: "4.2s" },
              { label: "Proof Cost", value: "$0.03" }
            ].map((stat, i) => (
              <div key={i}>
                <div className="text-3xl md:text-4xl font-bold text-foreground mb-2">{stat.value}</div>
                <div className="text-sm text-muted-foreground uppercase tracking-wider">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-6 py-10 border-t border-border mt-20">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-gradient-to-br from-primary to-accent rounded flex items-center justify-center">
              <Zap className="w-3 h-3 text-black" />
            </div>
            <span className="font-bold">zkLiquidate</span>
          </div>
          <div className="text-sm text-muted-foreground">
            © 2024 zkLiquidate Protocol. Built on Polygon AggLayer.
          </div>
        </div>
      </footer>
    </div>
  );
}