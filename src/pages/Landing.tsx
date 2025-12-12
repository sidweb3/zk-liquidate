import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, Shield, Zap, Activity, Lock, Wallet, CheckCircle2, TrendingUp, Users, Globe } from "lucide-react";
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
          <img 
            src="/zklogo.png" 
            alt="zkLiquidate Logo" 
            className="w-8 h-8 rounded-lg"
          />
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

      {/* Footer */}
      <footer className="border-t border-border bg-card/30 backdrop-blur-sm mt-20">
        <div className="container mx-auto px-6 py-12">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            {/* Brand */}
            <div className="md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <img 
                  src="/zklogo.png" 
                  alt="zkLiquidate Logo" 
                  className="w-8 h-8 rounded-lg"
                />
                <span className="text-xl font-bold tracking-tighter">zkLiquidate</span>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Institutional-grade cross-chain liquidations powered by ZK proofs on Polygon AggLayer.
              </p>
              <div className="flex gap-3">
                <a href="#" className="w-9 h-9 rounded-lg bg-muted hover:bg-primary/20 flex items-center justify-center transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                </a>
                <a href="#" className="w-9 h-9 rounded-lg bg-muted hover:bg-primary/20 flex items-center justify-center transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/></svg>
                </a>
                <a href="#" className="w-9 h-9 rounded-lg bg-muted hover:bg-primary/20 flex items-center justify-center transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M13.545 2.907a13.227 13.227 0 0 0-3.257-1.011.05.05 0 0 0-.052.025c-.141.25-.297.577-.406.833a12.19 12.19 0 0 0-3.658 0 8.258 8.258 0 0 0-.412-.833.051.051 0 0 0-.052-.025c-1.125.194-2.22.534-3.257 1.011a.041.041 0 0 0-.021.018C.356 6.024-.213 9.047.066 12.032c.001.014.01.028.021.037a13.276 13.276 0 0 0 3.995 2.02.05.05 0 0 0 .056-.019c.308-.42.582-.863.818-1.329a.05.05 0 0 0-.01-.059.051.051 0 0 0-.018-.011 8.875 8.875 0 0 1-1.248-.595.05.05 0 0 1-.02-.066.051.051 0 0 1 .015-.019c.084-.063.168-.129.248-.195a.05.05 0 0 1 .051-.007c2.619 1.196 5.454 1.196 8.041 0a.052.052 0 0 1 .053.007c.08.066.164.132.248.195a.051.051 0 0 1-.004.085 8.254 8.254 0 0 1-1.249.594.05.05 0 0 0-.03.03.052.052 0 0 0 .003.041c.24.465.515.909.817 1.329a.05.05 0 0 0 .056.019 13.235 13.235 0 0 0 4.001-2.02.049.049 0 0 0 .021-.037c.334-3.451-.559-6.449-2.366-9.106a.034.034 0 0 0-.02-.019Zm-8.198 7.307c-.789 0-1.438-.724-1.438-1.612 0-.889.637-1.613 1.438-1.613.807 0 1.45.73 1.438 1.613 0 .888-.637 1.612-1.438 1.612Zm5.316 0c-.788 0-1.438-.724-1.438-1.612 0-.889.637-1.613 1.438-1.613.807 0 1.451.73 1.438 1.613 0 .888-.631 1.612-1.438 1.612Z"/></svg>
                </a>
              </div>
            </div>

            {/* Protocol */}
            <div>
              <h4 className="font-bold mb-4">Protocol</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><button onClick={() => navigate("/documentation")} className="hover:text-primary transition-colors">Documentation</button></li>
                <li><button onClick={() => navigate("/whitepaper")} className="hover:text-primary transition-colors">Whitepaper</button></li>
                <li><a href="#" className="hover:text-primary transition-colors">Security Audits</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Bug Bounty</a></li>
              </ul>
            </div>

            {/* Developers */}
            <div>
              <h4 className="font-bold mb-4">Developers</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">GitHub</a></li>
                <li><button onClick={() => navigate("/documentation")} className="hover:text-primary transition-colors">API Reference</button></li>
                <li><button onClick={() => navigate("/documentation")} className="hover:text-primary transition-colors">Integration Guide</button></li>
                <li><a href="#" className="hover:text-primary transition-colors">SDK</a></li>
              </ul>
            </div>

            {/* Community */}
            <div>
              <h4 className="font-bold mb-4">Community</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><button onClick={() => navigate("/community")} className="hover:text-primary transition-colors">Discord</button></li>
                <li><button onClick={() => navigate("/community")} className="hover:text-primary transition-colors">Twitter</button></li>
                <li><button onClick={() => navigate("/community")} className="hover:text-primary transition-colors">Blog</button></li>
                <li><a href="#" className="hover:text-primary transition-colors">Forum</a></li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-muted-foreground">
              © 2025 zkLiquidate Protocol. Built on Polygon AggLayer.
            </div>
            <div className="flex gap-6 text-sm text-muted-foreground">
              <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-primary transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}