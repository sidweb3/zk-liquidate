import { useNavigate } from "react-router";
import { LandingNavbar } from "@/components/landing/LandingNavbar";
import { HeroSection } from "@/components/landing/HeroSection";
import { FeaturesGrid } from "@/components/landing/FeaturesGrid";
import { StatsSection } from "@/components/landing/StatsSection";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { motion } from "framer-motion";
import { CheckCircle2, TrendingUp, Users, Globe, Shield, Activity, ArrowRight } from "lucide-react";

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

      <LandingNavbar onConnectWallet={handleConnectWallet} />
      <HeroSection onConnectWallet={handleConnectWallet} />
      <FeaturesGrid />
      <StatsSection />

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
              desc: "Only ZK-verified cross-chain liquidation protocol on Polygon AggLayer with institutional-grade security."
            },
            {
              icon: <TrendingUp className="w-10 h-10 text-secondary" />,
              title: "Clear Revenue Streams",
              desc: "Earn from liquidation bonuses (5-10%), verification fees ($0.03/proof), and protocol integration fees."
            },
            {
              icon: <Users className="w-10 h-10 text-accent" />,
              title: "Institutional Appeal",
              desc: "Compliance-ready with audit trails, insurance coverage, and regulatory-friendly architecture."
            },
            {
              icon: <Globe className="w-10 h-10 text-primary" />,
              title: "Polygon Stack Advantage",
              desc: "Native AggLayer integration, zkEVM compatibility, and CDK chain support for seamless cross-chain operations."
            },
            {
              icon: <Shield className="w-10 h-10 text-secondary" />,
              title: "Battle-Tested Security",
              desc: "Plonky2 ZK proofs, time-locked intents, and multi-signature verification ensure maximum security."
            },
            {
              icon: <Activity className="w-10 h-10 text-accent" />,
              title: "AI-Enhanced Oracle",
              desc: "Off-chain risk oracle with AI integration provides real-time market data and risk assessment."
            }
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="p-8 rounded-2xl bg-card border border-border hover:border-primary/50 transition-all group"
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
            <div className="absolute -left-3 top-0 w-5 h-5 rounded-full bg-primary animate-pulse" />
            <div className="bg-card border border-primary/50 rounded-xl p-6">
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
            <div className="bg-card border border-border rounded-xl p-6">
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
            <div className="bg-card border border-border rounded-xl p-6">
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