import { useNavigate } from "react-router";
import { LandingNavbar } from "@/components/landing/LandingNavbar";
import { HeroSection } from "@/components/landing/HeroSection";
import { FeaturesGrid } from "@/components/landing/FeaturesGrid";
import { StatsSection } from "@/components/landing/StatsSection";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { motion } from "framer-motion";
import { CheckCircle2, TrendingUp, Users, Globe, Shield, Activity, ArrowRight, Code, Link2, ExternalLink } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function Landing() {
  const navigate = useNavigate();

  const handleConnectWallet = () => {
    navigate("/wallet-connect");
  };

  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden relative">
      {/* Enhanced Background Gradients with Animation */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <motion.div 
          className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px]"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/10 rounded-full blur-[120px]"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        />
        <motion.div 
          className="absolute top-[40%] left-[40%] w-[20%] h-[20%] bg-accent/10 rounded-full blur-[100px]"
          animate={{
            scale: [1, 1.4, 1],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />
      </div>

      <LandingNavbar onConnectWallet={handleConnectWallet} />
      <HeroSection onConnectWallet={handleConnectWallet} />
      <FeaturesGrid />
      <StatsSection />

      {/* Smart Contracts Section with Neon Effects */}
      <section className="container mx-auto px-6 py-20 border-t border-border">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4 neon-glow-primary">
            <Code className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Deployed & Verified</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Smart Contracts</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Production-ready contracts deployed on Polygon testnets
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="float-animation"
          >
            <Card className="p-6 bg-card neon-border-primary hover:scale-105 transition-all group">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center group-hover:scale-110 transition-transform neon-glow-primary">
                  <Link2 className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Intent Registry</h3>
                  <Badge variant="outline" className="text-xs bg-primary/10 text-primary border-primary/20">
                    Polygon Amoy
                  </Badge>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Manages liquidation intent submission, staking, and registry
              </p>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Address:</span>
                </div>
                <code className="block text-xs font-mono bg-muted/50 p-2 rounded border border-border break-all">
                  0x831F6F30cc0Aa68a9541B79c2289BF748DEC4a2a
                </code>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full mt-2 neon-border-primary"
                  onClick={() => window.open("https://amoy.polygonscan.com/address/0x831F6F30cc0Aa68a9541B79c2289BF748DEC4a2a", "_blank")}
                >
                  <ExternalLink className="w-3 h-3 mr-2" />
                  View on Explorer
                </Button>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="float-animation"
            style={{ animationDelay: "1s" }}
          >
            <Card className="p-6 bg-card neon-border-secondary hover:scale-105 transition-all group">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-secondary/20 flex items-center justify-center group-hover:scale-110 transition-transform neon-glow-secondary">
                  <Shield className="w-6 h-6 text-secondary" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">ZK Verifier</h3>
                  <Badge variant="outline" className="text-xs bg-secondary/10 text-secondary border-secondary/20">
                    Polygon zkEVM
                  </Badge>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Validates ZK proofs using Plonky2 for secure verification
              </p>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Address:</span>
                </div>
                <code className="block text-xs font-mono bg-muted/50 p-2 rounded border border-border break-all">
                  0x8C935B982416673cF9633DdCC4E9Dc4ec2846Ab2
                </code>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full mt-2 neon-border-secondary"
                  onClick={() => window.open("https://testnet-zkevm.polygonscan.com/address/0x8C935B982416673cF9633DdCC4E9Dc4ec2846Ab2", "_blank")}
                >
                  <ExternalLink className="w-3 h-3 mr-2" />
                  View on Explorer
                </Button>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="float-animation"
            style={{ animationDelay: "2s" }}
          >
            <Card className="p-6 bg-card neon-border-accent hover:scale-105 transition-all group">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center group-hover:scale-110 transition-transform neon-glow-accent">
                  <Activity className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Liquidation Executor</h3>
                  <Badge variant="outline" className="text-xs bg-accent/10 text-accent border-accent/20">
                    Polygon Amoy
                  </Badge>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Executes liquidations with insurance pool and reward distribution
              </p>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Address:</span>
                </div>
                <code className="block text-xs font-mono bg-muted/50 p-2 rounded border border-border break-all">
                  0x6cFe23FA3ed2D3df4ae2a4A2686514Fa8E634A9B
                </code>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full mt-2 neon-border-accent"
                  onClick={() => window.open("https://amoy.polygonscan.com/address/0x6cFe23FA3ed2D3df4ae2a4A2686514Fa8E634A9B", "_blank")}
                >
                  <ExternalLink className="w-3 h-3 mr-2" />
                  View on Explorer
                </Button>
              </div>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Why Us Section */}
      <section className="container mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Why zkLiquidate?</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            The only protocol combining ZK proofs with cross-chain liquidations
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              icon: <CheckCircle2 className="w-10 h-10 text-primary" />,
              title: "First-Mover Advantage",
              desc: "Only ZK-verified cross-chain liquidation protocol on Polygon AggLayer with institutional-grade security.",
              glowClass: "neon-border-primary"
            },
            {
              icon: <TrendingUp className="w-10 h-10 text-secondary" />,
              title: "Clear Revenue Streams",
              desc: "Earn from liquidation bonuses (5-10%), verification fees ($0.03/proof), and protocol integration fees.",
              glowClass: "neon-border-secondary"
            },
            {
              icon: <Users className="w-10 h-10 text-accent" />,
              title: "Institutional Appeal",
              desc: "Compliance-ready with audit trails, insurance coverage, and regulatory-friendly architecture.",
              glowClass: "neon-border-accent"
            },
            {
              icon: <Globe className="w-10 h-10 text-primary" />,
              title: "Polygon Stack Advantage",
              desc: "Native AggLayer integration, zkEVM compatibility, and CDK chain support for seamless cross-chain operations.",
              glowClass: "neon-border-primary"
            },
            {
              icon: <Shield className="w-10 h-10 text-secondary" />,
              title: "Battle-Tested Security",
              desc: "Plonky2 ZK proofs, time-locked intents, and multi-signature verification ensure maximum security.",
              glowClass: "neon-border-secondary"
            },
            {
              icon: <Activity className="w-10 h-10 text-accent" />,
              title: "AI-Enhanced Oracle",
              desc: "Off-chain risk oracle with AI integration provides real-time market data and risk assessment.",
              glowClass: "neon-border-accent"
            }
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`p-8 rounded-2xl bg-card ${item.glowClass} hover:scale-105 transition-all group`}
            >
              <div className="mb-4 group-hover:scale-110 transition-transform">
                {item.icon}
              </div>
              <h3 className="text-xl font-bold mb-3">{item.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Roadmap Section */}
      <section className="container mx-auto px-6 py-20 border-t border-border">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
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
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="relative pl-8 border-l-4 border-primary"
          >
            <div className="absolute -left-3 top-0 w-5 h-5 rounded-full bg-primary neon-glow-primary" />
            <div className="bg-card neon-border-primary rounded-xl p-6">
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
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="relative pl-8 border-l-4 border-secondary/50"
          >
            <div className="absolute -left-3 top-0 w-5 h-5 rounded-full bg-secondary/50" />
            <div className="bg-card border border-border rounded-xl p-6 hover:border-secondary/50 transition-all">
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
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative pl-8 border-l-4 border-accent/50"
          >
            <div className="absolute -left-3 top-0 w-5 h-5 rounded-full bg-accent/50" />
            <div className="bg-card border border-border rounded-xl p-6 hover:border-accent/50 transition-all">
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

      <LandingFooter />
    </div>
  );
}