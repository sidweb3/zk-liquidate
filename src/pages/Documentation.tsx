import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Book, Code, FileText, Shield } from "lucide-react";
import { useNavigate } from "react-router";

export default function Documentation() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-6 py-8">
        <Button variant="ghost" onClick={() => navigate("/")} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Button>

        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold tracking-tight mb-4">Documentation</h1>
          <p className="text-xl text-muted-foreground mb-8">
            Complete guide to integrating and using zkLiquidate Protocol
          </p>

          <div className="grid gap-6 md:grid-cols-2 mb-8">
            <Card>
              <CardHeader>
                <Book className="w-8 h-8 text-primary mb-2" />
                <CardTitle>Getting Started</CardTitle>
                <CardDescription>Quick start guide for developers</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Learn how to integrate zkLiquidate into your DeFi protocol in minutes.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Code className="w-8 h-8 text-secondary mb-2" />
                <CardTitle>API Reference</CardTitle>
                <CardDescription>Complete API documentation</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Detailed reference for all protocol functions and endpoints.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <FileText className="w-8 h-8 text-accent mb-2" />
                <CardTitle>Smart Contracts</CardTitle>
                <CardDescription>Contract architecture and ABIs</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Explore our verified smart contracts on Polygon AggLayer.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Shield className="w-8 h-8 text-green-500 mb-2" />
                <CardTitle>Security</CardTitle>
                <CardDescription>Best practices and audits</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Security guidelines and audit reports for safe integration.
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Protocol Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-bold mb-2">What is zkLiquidate?</h3>
                <p className="text-muted-foreground">
                  zkLiquidate is a ZK-verified cross-chain liquidation protocol built on Polygon AggLayer. 
                  It enables secure, efficient liquidations using zero-knowledge proofs for transparent intent verification.
                </p>
              </div>
              <div>
                <h3 className="font-bold mb-2">Key Features</h3>
                <ul className="list-disc list-inside text-muted-foreground space-y-1">
                  <li>ZK-verified liquidation intents using Plonky2</li>
                  <li>Cross-chain execution via Polygon AggLayer</li>
                  <li>Front-running protection with time-locked intents</li>
                  <li>AI-enhanced risk oracle for real-time market data</li>
                  <li>Institutional-grade security and compliance</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
