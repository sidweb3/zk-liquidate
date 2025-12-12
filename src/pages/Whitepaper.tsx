import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Download, FileText } from "lucide-react";
import { useNavigate } from "react-router";

export default function Whitepaper() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-6 py-8">
        <Button variant="ghost" onClick={() => navigate("/")} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Button>

        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold tracking-tight mb-4">Whitepaper</h1>
              <p className="text-xl text-muted-foreground">
                Technical specification and protocol design
              </p>
            </div>
            <Button className="bg-primary text-primary-foreground">
              <Download className="mr-2 h-4 w-4" />
              Download PDF
            </Button>
          </div>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-6 h-6 text-primary" />
                Abstract
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                zkLiquidate introduces a novel approach to cross-chain liquidations by combining zero-knowledge proofs 
                with Polygon's AggLayer technology. This whitepaper presents the technical architecture, economic model, 
                and security guarantees of the protocol.
              </p>
              <p>
                Traditional liquidation mechanisms suffer from oracle desynchronization, front-running attacks, and 
                execution failures across chains. zkLiquidate solves these problems through ZK-verified liquidation 
                intents that ensure cryptographic proof of liquidation conditions before execution.
              </p>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>1. Introduction</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground space-y-3">
                <p>
                  The DeFi lending market has grown to over $50B in total value locked, with cross-chain lending 
                  becoming increasingly important. However, liquidations across chains face significant challenges.
                </p>
                <p>
                  zkLiquidate addresses these challenges by introducing a three-layer architecture: Intent Registry, 
                  ZK Verifier, and AggLayer Executor.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>2. Protocol Architecture</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground space-y-3">
                <h4 className="font-bold text-foreground">2.1 Intent Registry</h4>
                <p>
                  Liquidators submit time-locked intents with bond collateral. Each intent specifies target user, 
                  health factor threshold, minimum price, and deadline.
                </p>
                <h4 className="font-bold text-foreground mt-4">2.2 ZK Verifier</h4>
                <p>
                  Uses Plonky2 to generate zero-knowledge proofs verifying liquidation conditions. Proofs are 
                  generated in ~4 seconds at $0.03 cost per verification.
                </p>
                <h4 className="font-bold text-foreground mt-4">2.3 AggLayer Executor</h4>
                <p>
                  Executes verified liquidations atomically across Polygon zkEVM and CDK chains using AggLayer's 
                  unified bridge.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>3. Economic Model</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground space-y-3">
                <p>
                  The protocol generates revenue through three streams:
                </p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Liquidation bonuses (5-10% of liquidated value)</li>
                  <li>Verification fees ($0.03 per proof)</li>
                  <li>Protocol integration fees from DeFi platforms</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>4. Security Guarantees</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground space-y-3">
                <p>
                  zkLiquidate provides cryptographic guarantees through:
                </p>
                <ul className="list-disc list-inside space-y-1">
                  <li>ZK proofs ensuring liquidation conditions are met</li>
                  <li>Time-locked intents preventing front-running</li>
                  <li>Multi-signature verification for oracle data</li>
                  <li>Bond slashing for malicious actors</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
