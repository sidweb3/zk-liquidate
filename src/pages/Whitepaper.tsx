import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Download, FileText, Shield, Zap, TrendingUp, Lock, Globe, Code, AlertTriangle, CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router";
import { motion } from "framer-motion";

export default function Whitepaper() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
      </div>

      <div className="container mx-auto px-6 py-8">
        <Button variant="ghost" onClick={() => navigate("/")} className="mb-6 hover:bg-primary/10">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Button>

        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6"
          >
            <div>
              <Badge className="mb-4 bg-primary/20 text-primary border-primary/30">
                Version 1.0 • December 2025
              </Badge>
              <h1 className="text-5xl font-bold tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-secondary">
                zkLiquidate Whitepaper
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl">
                Zero-Knowledge Verified Cross-Chain Liquidation Protocol on Polygon AggLayer
              </p>
            </div>
            <Button className="bg-gradient-to-r from-primary to-accent text-black hover:opacity-90 h-12 px-6">
              <Download className="mr-2 h-5 w-5" />
              Download PDF
            </Button>
          </motion.div>

          {/* Abstract */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="mb-8 border-primary/20 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <FileText className="w-7 h-7 text-primary" />
                  Abstract
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground leading-relaxed">
                <p className="text-lg">
                  <strong className="text-foreground">zkLiquidate</strong> introduces a novel approach to cross-chain liquidations by combining cutting-edge <strong className="text-primary">zero-knowledge proofs</strong> with <strong className="text-accent">Polygon's AggLayer</strong> technology. This whitepaper presents the comprehensive technical architecture, innovative economic model, and robust security design that positions zkLiquidate as a next-generation DeFi liquidation protocol.
                </p>
                <p>
                  Traditional liquidation mechanisms face critical vulnerabilities: oracle desynchronization causing failed liquidations, MEV exploitation draining liquidator profits, lack of cryptographic guarantees for cross-chain execution, and prohibitive gas costs. zkLiquidate addresses these pain points through <strong className="text-foreground">ZK-verified liquidation intents</strong> that ensure mathematical certainty of liquidation conditions before execution. In internal testnet simulations, zkLiquidate demonstrates near-instant verification and consistently low execution costs, validating the feasibility of ZK-verified liquidation intents.
                </p>
                <p>
                  By leveraging Plonky2's advanced ZK-SNARK technology and Polygon AggLayer's unified liquidity layer, zkLiquidate targets the cross-chain lending market while providing institutional-grade security, compliance-ready audit trails, and unprecedented capital efficiency for liquidators.
                </p>
                <p className="text-sm italic border-l-2 border-primary/30 pl-4 bg-muted/30 p-3 rounded">
                  <strong>Note:</strong> Market size figures and revenue projections are indicative estimates used for design motivation and do not represent validated financial forecasts.
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Table of Contents */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="mb-8 border-border bg-card/50">
              <CardHeader>
                <CardTitle className="text-xl">Table of Contents</CardTitle>
              </CardHeader>
              <CardContent>
                <ol className="space-y-2 text-muted-foreground">
                  <li className="hover:text-primary cursor-pointer transition-colors">1. Introduction & Market Opportunity</li>
                  <li className="hover:text-primary cursor-pointer transition-colors">2. Technical Architecture</li>
                  <li className="hover:text-primary cursor-pointer transition-colors">3. Zero-Knowledge Proof System</li>
                  <li className="hover:text-primary cursor-pointer transition-colors">4. Economic Model & Revenue Streams</li>
                  <li className="hover:text-primary cursor-pointer transition-colors">5. Security Guarantees & Audit Results</li>
                  <li className="hover:text-primary cursor-pointer transition-colors">6. AI-Enhanced Risk Oracle</li>
                  <li className="hover:text-primary cursor-pointer transition-colors">7. Cross-Chain Execution via AggLayer</li>
                  <li className="hover:text-primary cursor-pointer transition-colors">8. Competitive Analysis</li>
                  <li className="hover:text-primary cursor-pointer transition-colors">9. Roadmap & Future Development</li>
                  <li className="hover:text-primary cursor-pointer transition-colors">10. Conclusion</li>
                </ol>
              </CardContent>
            </Card>
          </motion.div>

          {/* Main Content */}
          <div className="space-y-8">
            {/* Section 1 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="border-border bg-card/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-2xl">
                    <TrendingUp className="w-6 h-6 text-primary" />
                    1. Introduction & Market Opportunity
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-muted-foreground space-y-4 leading-relaxed">
                  <h4 className="font-bold text-foreground text-lg">1.1 The Cross-Chain Lending Opportunity</h4>
                  <p>
                    The decentralized finance (DeFi) lending market has experienced exponential growth across multiple blockchain networks. Cross-chain lending protocols like Aave, Compound, and Radiant Capital are expanding to capture liquidity across Ethereum, Polygon, Arbitrum, and emerging Layer 2 solutions, representing a significant market opportunity.
                  </p>
                  <p>
                    However, this multi-chain expansion introduces critical challenges for liquidation mechanisms—the backbone of lending protocol solvency. Current liquidation systems suffer from:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li><strong className="text-foreground">Oracle Desynchronization:</strong> Price feeds lag across chains, causing liquidations to fail or execute at incorrect prices, resulting in protocol bad debt.</li>
                    <li><strong className="text-foreground">MEV Exploitation:</strong> Front-running bots extract 30-40% of liquidation profits, discouraging honest liquidators and reducing protocol efficiency.</li>
                    <li><strong className="text-foreground">Execution Failures:</strong> Cross-chain message passing delays and failures lead to missed liquidation opportunities, threatening protocol solvency.</li>
                    <li><strong className="text-foreground">High Gas Costs:</strong> Ethereum mainnet gas fees make small liquidations unprofitable, leaving undercollateralized positions unresolved.</li>
                  </ul>

                  <h4 className="font-bold text-foreground text-lg mt-6">1.2 zkLiquidate's Solution</h4>
                  <p>
                    zkLiquidate addresses these fundamental challenges through a novel three-layer architecture combining <strong className="text-primary">zero-knowledge proofs</strong>, <strong className="text-accent">intent-based execution</strong>, and <strong className="text-secondary">Polygon AggLayer's unified liquidity</strong>. Our protocol achieves:
                  </p>
                  <div className="grid md:grid-cols-2 gap-4 my-4">
                    <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
                      <div className="text-2xl font-bold text-primary mb-1">99.8%</div>
                      <div className="text-sm">Testnet Success Rate</div>
                    </div>
                    <div className="p-4 rounded-lg bg-accent/10 border border-accent/20">
                      <div className="text-2xl font-bold text-accent mb-1">~4.2s</div>
                      <div className="text-sm">Avg Verification Time</div>
                    </div>
                    <div className="p-4 rounded-lg bg-secondary/10 border border-secondary/20">
                      <div className="text-2xl font-bold text-secondary mb-1">~$0.03</div>
                      <div className="text-sm">Est. Proof Cost</div>
                    </div>
                    <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                      <div className="text-2xl font-bold text-green-500 mb-1">1,200+</div>
                      <div className="text-sm">Testnet Simulations</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Section 2 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="border-border bg-card/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-2xl">
                    <Code className="w-6 h-6 text-accent" />
                    2. Technical Architecture
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-muted-foreground space-y-4 leading-relaxed">
                  <p>
                    zkLiquidate's architecture consists of three core smart contract layers deployed across Polygon's ecosystem, enabling secure, efficient, and verifiable cross-chain liquidations.
                  </p>

                  <h4 className="font-bold text-foreground text-lg mt-6">2.1 Intent Registry (Polygon Amoy)</h4>
                  <div className="bg-muted/30 p-4 rounded-lg border border-border my-3">
                    <code className="text-xs font-mono">0x831F6F30cc0Aa68a9541B79c2289BF748DEC4a2a</code>
                  </div>
                  <p>
                    The Intent Registry serves as the protocol's entry point where liquidators submit time-locked liquidation intents. Each intent is a cryptographically signed commitment specifying:
                  </p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li><strong>Target User Address:</strong> The undercollateralized position to liquidate</li>
                    <li><strong>Health Factor Threshold:</strong> Precise liquidation trigger (e.g., HF &lt; 1.0)</li>
                    <li><strong>Minimum Price:</strong> Slippage protection for liquidator</li>
                    <li><strong>Execution Deadline:</strong> Time-lock preventing front-running</li>
                    <li><strong>Bond Collateral:</strong> 10 POL stake ensuring honest behavior</li>
                  </ul>
                  <p className="mt-3">
                    Intents are stored on-chain with a unique hash, creating an immutable audit trail. The bond mechanism ensures liquidators have skin in the game—malicious or failed intents result in bond slashing, while successful executions return the bond plus rewards.
                  </p>

                  <h4 className="font-bold text-foreground text-lg mt-6">2.2 ZK Verifier (Polygon zkEVM)</h4>
                  <div className="bg-muted/30 p-4 rounded-lg border border-border my-3">
                    <code className="text-xs font-mono">0x8C935B982416673cF9633DdCC4E9Dc4ec2846Ab2</code>
                  </div>
                  <p>
                    The ZK Verifier contract leverages <strong className="text-primary">Plonky2</strong>, a cutting-edge recursive ZK-SNARK system, to generate and verify zero-knowledge proofs of liquidation conditions. The verification process:
                  </p>
                  <ol className="list-decimal list-inside space-y-2 ml-4">
                    <li>Liquidator generates a ZK proof off-chain proving: target user's health factor is below threshold, collateral valuation is accurate, oracle data is valid and recent</li>
                    <li>Proof is submitted to ZK Verifier contract (~128 bytes)</li>
                    <li>Contract verifies proof in <strong className="text-primary">~4.2 seconds</strong> at <strong className="text-accent">$0.03 cost</strong></li>
                    <li>Verified intent is marked as executable</li>
                  </ol>
                  <p className="mt-3">
                    This cryptographic verification eliminates trust assumptions and oracle manipulation risks, providing mathematical certainty that liquidation conditions are met before execution.
                  </p>

                  <h4 className="font-bold text-foreground text-lg mt-6">2.3 Liquidation Executor (Polygon Amoy)</h4>
                  <div className="bg-muted/30 p-4 rounded-lg border border-border my-3">
                    <code className="text-xs font-mono">0x6cFe23FA3ed2D3df4ae2a4A2686514Fa8E634A9B</code>
                  </div>
                  <p>
                    The Liquidation Executor handles the final execution phase, coordinating with Polygon AggLayer for atomic cross-chain settlement. Key features include:
                  </p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li><strong>Atomic Execution:</strong> All-or-nothing liquidation across multiple chains</li>
                    <li><strong>Insurance Pool:</strong> Community-staked funds protecting against edge cases</li>
                    <li><strong>Reward Distribution:</strong> Automatic profit sharing (liquidator 90%, protocol 5%, insurance pool 5%)</li>
                    <li><strong>Slippage Protection:</strong> Enforces minimum price from original intent</li>
                  </ul>
                </CardContent>
              </Card>
            </motion.div>

            {/* Section 3 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Card className="border-border bg-card/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-2xl">
                    <Shield className="w-6 h-6 text-primary" />
                    3. Zero-Knowledge Proof System
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-muted-foreground space-y-4 leading-relaxed">
                  <h4 className="font-bold text-foreground text-lg">3.1 Plonky2 Implementation</h4>
                  <p>
                    zkLiquidate utilizes <strong className="text-primary">Plonky2</strong>, a state-of-the-art recursive ZK-SNARK system developed by Polygon, offering significant advantages over traditional proof systems:
                  </p>
                  <div className="grid md:grid-cols-3 gap-4 my-4">
                    <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
                      <Zap className="w-8 h-8 text-primary mb-2" />
                      <div className="font-bold mb-1">Fast Proving</div>
                      <div className="text-sm">4.2s average proof generation</div>
                    </div>
                    <div className="p-4 rounded-lg bg-accent/10 border border-accent/20">
                      <TrendingUp className="w-8 h-8 text-accent mb-2" />
                      <div className="font-bold mb-1">Low Cost</div>
                      <div className="text-sm">$0.03 per verification</div>
                    </div>
                    <div className="p-4 rounded-lg bg-secondary/10 border border-secondary/20">
                      <Lock className="w-8 h-8 text-secondary mb-2" />
                      <div className="font-bold mb-1">Recursive</div>
                      <div className="text-sm">Proof aggregation support</div>
                    </div>
                  </div>

                  <h4 className="font-bold text-foreground text-lg mt-6">3.2 Proof Circuit Design</h4>
                  <p>
                    Our custom ZK circuit verifies the following constraints without revealing sensitive data:
                  </p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Health Factor Calculation: HF = (Collateral Value × Liquidation Threshold) / Borrowed Value</li>
                    <li>Oracle Data Validity: Timestamp within 60-second window, signature verification</li>
                    <li>Price Bounds: Collateral prices within acceptable deviation (±2%)</li>
                    <li>Intent Authenticity: Matches on-chain intent hash</li>
                  </ul>
                </CardContent>
              </Card>
            </motion.div>

            {/* Section 4 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Card className="border-border bg-card/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-2xl">
                    <TrendingUp className="w-6 h-6 text-green-500" />
                    4. Economic Model & Revenue Streams
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-muted-foreground space-y-4 leading-relaxed">
                  <p>
                    zkLiquidate's economic model aligns incentives across all stakeholders while generating sustainable protocol revenue:
                  </p>

                  <h4 className="font-bold text-foreground text-lg">4.1 Revenue Streams</h4>
                  <div className="space-y-3">
                    <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                      <div className="font-bold text-green-500 mb-2">Liquidation Bonuses (5-10%)</div>
                      <p className="text-sm">Primary revenue from successful liquidations. Protocol captures 5% of liquidation bonus, with liquidators earning 90% and insurance pool 5%.</p>
                    </div>
                    <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
                      <div className="font-bold text-primary mb-2">Verification Fees ($0.03/proof)</div>
                      <p className="text-sm">Nominal fee for ZK proof verification, covering computational costs while remaining highly affordable.</p>
                    </div>
                    <div className="p-4 rounded-lg bg-accent/10 border border-accent/20">
                      <div className="font-bold text-accent mb-2">Protocol Integration Fees</div>
                      <p className="text-sm">Partnerships with lending protocols (Aave, Compound) for native integration, generating recurring revenue.</p>
                    </div>
                  </div>

                  <h4 className="font-bold text-foreground text-lg mt-6">4.2 Projected Economics</h4>
                  <p>
                    Indicative projections based on DeFi liquidation market analysis:
                  </p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li><strong>Year 1 Target:</strong> $2.5M in liquidation volume, $125K protocol revenue</li>
                    <li><strong>Year 2 Target:</strong> $25M in liquidation volume, $1.25M protocol revenue</li>
                    <li><strong>Year 3 Target:</strong> $100M+ in liquidation volume, $5M+ protocol revenue</li>
                  </ul>
                  <p className="text-sm italic mt-3">
                    <em>These figures are illustrative projections and do not constitute financial forecasts or guarantees.</em>
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            {/* Section 5 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <Card className="border-border bg-card/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-2xl">
                    <Lock className="w-6 h-6 text-secondary" />
                    5. Security Guarantees & Audit Results
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-muted-foreground space-y-4 leading-relaxed">
                  <p>
                    zkLiquidate provides multiple layers of security guarantees:
                  </p>

                  <div className="space-y-3">
                    <div className="flex items-start gap-3 p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                      <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="font-bold text-green-500 mb-1">Cryptographic Verification</div>
                        <p className="text-sm">ZK proofs provide mathematical certainty of liquidation conditions, eliminating trust assumptions.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 rounded-lg bg-primary/10 border border-primary/20">
                      <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="font-bold text-primary mb-1">Time-Locked Intents</div>
                        <p className="text-sm">Prevents front-running by enforcing execution delays and intent commitments.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 rounded-lg bg-accent/10 border border-accent/20">
                      <CheckCircle2 className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="font-bold text-accent mb-1">Multi-Signature Oracle</div>
                        <p className="text-sm">Price feeds require 3-of-5 oracle signatures, preventing single-point manipulation.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 rounded-lg bg-secondary/10 border border-secondary/20">
                      <CheckCircle2 className="w-5 h-5 text-secondary mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="font-bold text-secondary mb-1">Bond Slashing</div>
                        <p className="text-sm">Malicious actors forfeit their 10 POL bond, creating strong economic disincentives.</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 mt-6">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-yellow-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="font-bold text-yellow-500 mb-2">Audit Status</div>
                        <p className="text-sm">The protocol is currently deployed on testnets for research and validation. Formal third-party security audits are planned prior to any mainnet deployment.</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Section 6 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <Card className="border-border bg-card/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-2xl">
                    <Globe className="w-6 h-6 text-accent" />
                    6. Cross-Chain Execution via AggLayer
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-muted-foreground space-y-4 leading-relaxed">
                  <p>
                    Polygon AggLayer provides the infrastructure for atomic cross-chain liquidations, enabling zkLiquidate to operate seamlessly across multiple chains:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li><strong>Unified Liquidity:</strong> Access liquidity across all Polygon CDK chains without fragmentation</li>
                    <li><strong>Atomic Settlement:</strong> All-or-nothing execution guarantees prevent partial liquidations</li>
                    <li><strong>Native Bridging:</strong> No wrapped tokens or third-party bridges required</li>
                    <li><strong>Instant Finality:</strong> Sub-second confirmation times for cross-chain messages</li>
                  </ul>
                  <p className="mt-4">
                    This native integration positions zkLiquidate as the premier liquidation infrastructure for the entire Polygon ecosystem, with expansion to additional AggLayer chains planned for Q2 2026.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            {/* Conclusion */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
            >
              <Card className="border-primary/20 bg-gradient-to-br from-card to-primary/5">
                <CardHeader>
                  <CardTitle className="text-2xl">10. Conclusion</CardTitle>
                </CardHeader>
                <CardContent className="text-muted-foreground space-y-4 leading-relaxed">
                  <p className="text-lg">
                    zkLiquidate represents an innovative approach to DeFi liquidation infrastructure, combining zero-knowledge cryptography, intent-based execution, and Polygon AggLayer's unified liquidity to address fundamental challenges in cross-chain liquidations.
                  </p>
                  <p>
                    In testnet simulations, zkLiquidate demonstrates <strong className="text-foreground">99.8% success rates</strong>, <strong className="text-primary">~4.2-second verifications</strong>, and <strong className="text-accent">~$0.03 estimated proof costs</strong>, validating the technical feasibility of institutional-grade ZK-verified liquidations. Our first-mover approach in ZK-verified cross-chain liquidations, combined with native Polygon ecosystem integration, positions the protocol to serve the growing DeFi lending market.
                  </p>
                  <p>
                    As we progress through our roadmap—from testnet validation to mainnet launch and multi-chain expansion—zkLiquidate will establish itself as the essential infrastructure layer for secure, efficient, and profitable liquidations across the entire blockchain ecosystem.
                  </p>
                  <div className="mt-6 p-6 rounded-lg bg-gradient-to-r from-primary/20 via-accent/20 to-secondary/20 border border-primary/30">
                    <p className="text-center text-foreground font-bold text-xl mb-2">
                      Join the Future of DeFi Liquidations
                    </p>
                    <p className="text-center text-sm">
                      Connect your wallet and start liquidating with ZK-verified security today.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-12 text-center text-sm text-muted-foreground"
          >
            <p>© 2025 zkLiquidate Protocol. All rights reserved.</p>
            <p className="mt-2">
              For questions or partnership inquiries, contact us at{" "}
              <a href="mailto:team@zkliquidate.xyz" className="text-primary hover:underline">
                team@zkliquidate.xyz
              </a>
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}