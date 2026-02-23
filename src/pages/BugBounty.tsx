import { motion } from "framer-motion";
import { Shield, DollarSign, FileText, AlertTriangle, Award, CheckCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function BugBounty() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="border-b border-border bg-gradient-to-b from-primary/5 to-background">
        <div className="container mx-auto px-6 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <Badge className="mb-4 bg-primary/20 text-primary border-primary/30">
              🧪 Community Testing
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6">
              Community Testing Rewards
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Help us test zkLiquidate on testnet! Find bugs, provide feedback, and earn
              <span className="text-primary font-bold"> recognition</span> and <span className="text-primary font-bold">early access rewards</span>.
            </p>
            <div className="flex justify-center gap-4">
              <Button size="lg" className="gap-2">
                <FileText className="w-5 h-5" />
                Submit Report
              </Button>
              <Button size="lg" variant="outline" className="gap-2">
                <Shield className="w-5 h-5" />
                View Guidelines
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="container mx-auto px-6 py-16 max-w-6xl">
        {/* Reward Structure */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold mb-8">🎁 Reward Structure</h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                severity: "Critical",
                range: "🏆 NFT Badge + Mainnet Airdrop",
                color: "text-red-500 border-red-500/30 bg-red-500/10",
                icon: AlertTriangle,
                examples: "Contract vulnerabilities, critical security flaws"
              },
              {
                severity: "High",
                range: "🥇 NFT Badge + Early Access",
                color: "text-orange-500 border-orange-500/30 bg-orange-500/10",
                icon: AlertTriangle,
                examples: "Important bugs, integration issues, UX blockers"
              },
              {
                severity: "Medium",
                range: "🥈 NFT Badge + Recognition",
                color: "text-yellow-500 border-yellow-500/30 bg-yellow-500/10",
                icon: AlertTriangle,
                examples: "UI bugs, minor issues, feature requests"
              },
              {
                severity: "Low",
                range: "🥉 Recognition + Thanks",
                color: "text-blue-500 border-blue-500/30 bg-blue-500/10",
                icon: AlertTriangle,
                examples: "Typos, small improvements, suggestions"
              }
            ].map((tier, i) => (
              <motion.div
                key={tier.severity}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
              >
                <Card className={`p-6 border-2 ${tier.color}`}>
                  <tier.icon className="w-8 h-8 mb-3" />
                  <h3 className="font-bold text-lg mb-2">{tier.severity}</h3>
                  <p className="text-2xl font-bold mb-3">{tier.range}</p>
                  <p className="text-sm text-muted-foreground">{tier.examples}</p>
                </Card>
              </motion.div>
            ))}
          </div>

          <Card className="mt-6 p-6 bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20">
            <h3 className="font-bold text-lg mb-3">🎁 Bonus Rewards</h3>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="font-bold text-primary">🥇 Active Tester:</span> Test 5+ features = Exclusive NFT
              </div>
              <div>
                <span className="font-bold text-primary">🏆 Top Reporter:</span> Most valuable feedback = Mainnet bonus
              </div>
              <div>
                <span className="font-bold text-primary">⭐ Early Bird:</span> First 50 testers get special role
              </div>
            </div>
          </Card>
        </motion.section>

        {/* Scope */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold mb-8">🎯 Scope</h2>

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="p-6 border-green-500/30 bg-green-500/5">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                In Scope
              </h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  <span>Smart Contracts (IntentRegistry, ZKVerifier, LiquidationExecutor)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  <span>Backend systems (Convex queries/mutations)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  <span>AI risk scoring algorithms</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  <span>Frontend XSS and injection vulnerabilities</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  <span>Authentication and authorization bypasses</span>
                </li>
              </ul>
            </Card>

            <Card className="p-6 border-red-500/30 bg-red-500/5">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-500" />
                Out of Scope
              </h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-red-500">✗</span>
                  <span>Known issues already documented</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500">✗</span>
                  <span>DDoS attacks and social engineering</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500">✗</span>
                  <span>Third-party dependencies</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500">✗</span>
                  <span>UI/UX bugs without security impact</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500">✗</span>
                  <span>Gas optimization suggestions</span>
                </li>
              </ul>
            </Card>
          </div>
        </motion.section>

        {/* Submission Guidelines */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold mb-8">📝 Submission Process</h2>

          <div className="grid md:grid-cols-5 gap-4 mb-8">
            {[
              { step: "1", title: "Report", desc: "Find vulnerability" },
              { step: "2", title: "Submit", desc: "Email details" },
              { step: "3", title: "Review", desc: "We assess impact" },
              { step: "4", title: "Fix", desc: "We patch issue" },
              { step: "5", title: "Reward", desc: "Receive payment" }
            ].map((item, i) => (
              <Card key={i} className="p-4 text-center">
                <div className="w-10 h-10 rounded-full bg-primary/20 text-primary font-bold flex items-center justify-center mx-auto mb-2">
                  {item.step}
                </div>
                <h4 className="font-bold mb-1">{item.title}</h4>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </Card>
            ))}
          </div>

          <Card className="p-8 bg-card border-border">
            <h3 className="font-bold text-xl mb-4">Required Information</h3>
            <div className="space-y-4 text-sm">
              <div>
                <h4 className="font-semibold mb-2">1. Vulnerability Description</h4>
                <p className="text-muted-foreground">Clear title, affected components, severity assessment</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">2. Reproduction Steps</h4>
                <p className="text-muted-foreground">Step-by-step instructions with preconditions</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">3. Proof of Concept</h4>
                <p className="text-muted-foreground">Code snippets, transaction hashes, or screenshots</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">4. Impact Assessment</h4>
                <p className="text-muted-foreground">Potential damage and affected users/funds</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">5. Recommended Fix</h4>
                <p className="text-muted-foreground">Suggested mitigation and code patches</p>
              </div>
            </div>

            <div className="mt-6 p-4 bg-primary/10 border border-primary/20 rounded-lg">
              <p className="text-sm">
                <strong>Submit to:</strong> GitHub Issues or Discord #testing channel
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Include your wallet address for NFT rewards. This is a testnet testing program - all rewards are non-monetary.
              </p>
            </div>
          </Card>
        </motion.section>

        {/* Rules */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold mb-8">⚖️ Rules & Terms</h2>

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="font-bold text-lg mb-4">✅ Do</h3>
              <ul className="space-y-2 text-sm">
                <li>✓ Report vulnerabilities responsibly</li>
                <li>✓ Use testnet only for testing</li>
                <li>✓ Allow 90 days for fixes</li>
                <li>✓ Provide detailed PoC</li>
                <li>✓ Follow submission template</li>
              </ul>
            </Card>

            <Card className="p-6">
              <h3 className="font-bold text-lg mb-4">❌ Don't</h3>
              <ul className="space-y-2 text-sm">
                <li>✗ Publicly disclose before fix</li>
                <li>✗ Test on mainnet</li>
                <li>✗ Access/modify user data</li>
                <li>✗ Submit duplicate reports</li>
                <li>✗ Exploit beyond PoC</li>
              </ul>
            </Card>
          </div>
        </motion.section>

        {/* Hall of Fame */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold mb-8">🏆 Hall of Fame</h2>

          <Card className="p-8 text-center bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
            <Award className="w-16 h-16 mx-auto mb-4 text-primary" />
            <h3 className="text-xl font-bold mb-2">Be the First!</h3>
            <p className="text-muted-foreground">
              Help secure zkLiquidate and your name will be featured here with public recognition.
            </p>
          </Card>
        </motion.section>

        {/* CTA */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Card className="p-12 text-center bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 border-primary/30">
            <Shield className="w-20 h-20 mx-auto mb-6 text-primary" />
            <h2 className="text-3xl font-bold mb-4">Ready to Start Hunting?</h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Review our documentation, explore the smart contracts, and help us build the most secure
              cross-chain liquidation protocol.
            </p>
            <div className="flex justify-center gap-4">
              <Button size="lg" className="gap-2">
                <FileText className="w-5 h-5" />
                Read Full Guidelines
              </Button>
              <Button size="lg" variant="outline" asChild>
                <a href="https://github.com/zkliquidate" target="_blank" rel="noopener noreferrer" className="gap-2">
                  View Contracts
                </a>
              </Button>
            </div>
          </Card>
        </motion.section>
      </div>
    </div>
  );
}
